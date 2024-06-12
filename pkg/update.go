package pkg

import (
	"fmt"
	"github.com/inconshreveable/go-update"
	"io"
	"net/http"
)

func DoUpdate(url string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer func(Body io.ReadCloser) {
		err = Body.Close()
		if err != nil {
			fmt.Printf(err.Error())
		}
	}(resp.Body)
	err = update.Apply(resp.Body, update.Options{})
	if err != nil {
		// 如果更新失败，你可以进行回滚
		if err = update.RollbackError(err); err != nil {
			return err
		}
	}
	return err
}
