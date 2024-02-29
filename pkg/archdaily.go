package pkg

import "strconv"

var URL = "https://www.archdaily.cn/"

// 获取搜索代码
func getSearchUrl(key string, page int) string {
	return URL + "search/api/v1/cn/all?q=" + key + "&page=" + strconv.Itoa(page)
}
