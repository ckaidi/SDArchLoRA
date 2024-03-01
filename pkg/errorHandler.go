package pkg

import (
	"fmt"
	"time"
)

func handle(err error) {
	if err != nil {
		fmt.Print(err.Error())
	}
}

func retry(err error, f func()) {
	if err != nil {
		f()
	}
}

func retryAfter(err error, second int) {
	if err != nil {
		a := 5 * time.Second
		time.Sleep(a)
	}
}
