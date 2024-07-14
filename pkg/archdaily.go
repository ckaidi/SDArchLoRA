package pkg

import (
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/fatih/color"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"io"
	"net/http"
	"net/url"
	"strconv"
)

type Detail struct {
	DocCount int    `json:"doc_count"`
	ViewMore string `json:"view_more"`
}

type Aggregations struct {
	Articles     Detail `json:"articles"`
	Folders      Detail `json:"folders"`
	Projects     Detail `json:"projects"`
	Competitions Detail `json:"competitions"`
	Events       Detail `json:"events"`
	All          Detail `json:"all"`
}

type NameUrl struct {
	gorm.Model
	Name string `json:"name"`
	Url  string `json:"url"`
}

type ImageDetail struct {
	gorm.Model
	Name       string `json:"name"`
	Url        string `json:"url"`
	DocumentId string `json:"document_id"`
	Page       int    `json:"page"`
	Project    int    `json:"project"`
	IsLast     bool   `json:"is_last"`
}

// ImageGroup json模型兼数据模型
type ImageGroup struct {
	gorm.Model
	UrlLarge         string `json:"url_large"`
	UrlMedium        string `json:"url_medium"`
	UrlSmall         string `json:"url_small"`
	UrlThumb         string `json:"url_thumb"`
	UrlNewsletter    string `json:"url_newsletter"`
	UrlSlideshow     string `json:"url_slideshow"`
	UrlMini          string `json:"url_mini"`
	UrlSmallPortrait string `json:"url_small_portrait"`
	DocumentOwners   string //数据库字段
	Tags             string //数据库字段
	UserTags         string //用户定义字段
}

type ResultDetail struct {
	gorm.Model
	AuthorID                uint
	Author                  NameUrl     `json:"author"`
	BookmarkedProductsCount int         `json:"bookmarked_products_count"`
	Categories              interface{} `json:"categories"`
	DocumentId              string      `json:"document_id"`
	DocumentType            string      `json:"document_type"`
	FeaturedImagesID        uint
	FeaturedImages          ImageGroup  `json:"featured_images"`
	Location                interface{} `json:"location"`
	MetaDescription         string      `json:"meta_description"`
	MiniaturesID            uint
	Miniatures              []ImageGroup `json:"miniatures"`
	Offices                 []NameUrl    `json:"offices"`
	Photographers           []NameUrl    `json:"photographers"`
	Products                interface{}  `json:"products"`
	ProjectType             string       `json:"project_type"`
	Source                  string       `json:"source"`
	Tags                    []NameUrl    `json:"tags"`
	Title                   string       `json:"title"`
	Year                    string       `json:"year"`
	Bim                     bool         `json:"bim"`
	Url                     string       `json:"url"`
}

type SearchResult struct {
	Aggregations Aggregations   `json:"aggregations"`
	Results      []ResultDetail `json:"results"`
}

var URL = "https://www.archdaily.cn"

// 获取搜索代码
func getSearchUrl(key string, page int) string {
	key = url.QueryEscape(key)
	return URL + "/search/api/v1/cn/all?q=" + key + "&page=" + url.QueryEscape(strconv.Itoa(page))
}

func GetArchdailyImagesRoute(w http.ResponseWriter, r *http.Request) {
	//// 检查请求方法是否为 POST
	//if r.Method != "POST" {
	//	http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	//	return
	//}
	keyword := r.URL.Query().Get("keyword")
	pageString := r.URL.Query().Get("page")
	page, err := strconv.Atoi(pageString)
	handle(err)
	conn, err := upgrader.Upgrade(w, r, nil)
	handle(err)
	defer func(conn *websocket.Conn) {
		err = conn.Close()
		handle(err)
	}(conn)
	getImagesUrl(r, conn, keyword, page)
	handle(err)
}

func getImagesUrl(r *http.Request, conn *websocket.Conn, key string, page int) {
	Get(getSearchUrl(key, page), func(response *http.Response) {
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			handle(err)
		}(response.Body)
		data, err := io.ReadAll(response.Body)
		handle(err)
		text := string(data)
		var searchResult SearchResult
		err = json.Unmarshal([]byte(text), &searchResult)
		handle(err)

		startProjectCount, err := strconv.Atoi(r.URL.Query().Get("projectCount"))
		handle(err)
		allCount := 0
		// 将 HTTP 连接升级为 WebSocket 连接
		for index, project := range searchResult.Results {
			if index < startProjectCount {
				continue
			}
			if allCount > 50 {
				return
			}
			green := color.New(color.FgGreen).PrintlnFunc()
			green("[项目:]" + project.MetaDescription)
			analyseProject(conn, project, page, index, &allCount)
		}
		getImagesUrl(r, conn, key, page+1)
	})
}

func analyseProject(conn *websocket.Conn, project ResultDetail, page int, index int, allCount *int) {
	dbModel := AddProjectToDatabase(project)
	if dbModel != nil {
		err := conn.WriteJSON(dbModel)
		if err != nil {
			fmt.Println("写入项目信息数据库失败")
			fmt.Println(err)
		}
	}
	Get(project.Url, func(response *http.Response) {
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			handle(err)
		}(response.Body)
		reader, err := goquery.NewDocumentFromReader(response.Body)
		handle(err)
		images := reader.Find("img.gallery-thumbs-img")
		green := color.New(color.FgGreen).PrintlnFunc()
		green("找到" + strconv.Itoa(images.Length()) + "张图片")
		imagesLength := images.Length() - 1
		images.Each(func(i int, selection *goquery.Selection) {
			imageUrl := selection.AttrOr("src", "")
			title := selection.AttrOr("alt", "标题")
			if imageUrl != "" {
				formattedNum := fmt.Sprintf("%03d", i)
				green("[图片" + formattedNum + ":]" + title)
				*allCount += 1
				err = conn.WriteJSON(ImageDetail{
					Name:       title,
					Url:        imageUrl,
					DocumentId: project.DocumentId,
					Page:       page,
					Project:    index,
					IsLast:     *allCount >= 50 && i == imagesLength,
				})
				handle(err)
			}
		})
	})
}

// 定义一个 WebSocket 升级器，用于将 HTTP 连接升级为 WebSocket 连接
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// 允许跨域请求
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
