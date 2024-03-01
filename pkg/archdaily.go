package pkg

import (
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/gorilla/websocket"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
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
	Name string `json:"name"`
	Url  string `json:"url"`
}

type ImageGroup struct {
	UrlLarge         string `json:"url_large"`
	UrlMedium        string `json:"url_medium"`
	UrlSmall         string `json:"url_small"`
	UrlThumb         string `json:"url_thumb"`
	UrlNewsletter    string `json:"url_newsletter"`
	UrlSlideshow     string `json:"url_slideshow"`
	UrlMini          string `json:"url_mini"`
	UrlSmallPortrait string `json:"url_small_portrait"`
}

type ResultDetail struct {
	Author                  NameUrl      `json:"author"`
	BookmarkedProductsCount int          `json:"bookmarked_products_count"`
	Categories              interface{}  `json:"categories"`
	DocumentId              string       `json:"document_id"`
	DocumentType            string       `json:"document_type"`
	FeaturedImages          ImageGroup   `json:"featured_images"`
	Location                interface{}  `json:"location"`
	MetaDescription         string       `json:"meta_description"`
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
		err := conn.Close()
		handle(err)
	}(conn)
	getImagesUrl(conn, keyword, page)
	// 发送一个结束标志给客户端，表示数据发送完毕
	err = conn.WriteMessage(websocket.TextMessage, []byte("end"))
	handle(err)
}

func getImagesUrl(conn *websocket.Conn, key string, page int) {
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
		count := 0 // 将 HTTP 连接升级为 WebSocket 连接
		for _, project := range searchResult.Results {
			analyseProject(conn, project, &count)
		}
	})
}

func analyseProject(conn *websocket.Conn, project ResultDetail, count *int) {
	Get(project.Url, func(response *http.Response) {
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			handle(err)
		}(response.Body)
		reader, err := goquery.NewDocumentFromReader(response.Body)
		handle(err)
		reader.Find("img.gallery-thumbs-img").Each(func(i int, selection *goquery.Selection) {
			fmt.Print(selection.Text())
			imageUrl := selection.AttrOr("src", "")
			title := selection.AttrOr("alt", "标题")
			if imageUrl != "" {
				lastText := strings.Split(imageUrl, "/")
				fmt.Print(lastText)
				err = conn.WriteJSON(NameUrl{
					Name: title,
					Url:  imageUrl,
				})
				handle(err)
				*count += 1
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
