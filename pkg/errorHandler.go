package pkg

import "fmt"

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
