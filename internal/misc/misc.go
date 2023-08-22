package misc

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

func ReadQuery(message string) string {
	fmt.Println(message)
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	err := scanner.Err()
	if err != nil {
		log.Fatal(err)
	}
	return scanner.Text()
}

func GetRequest(url string) (io.ReadCloser, error) {
	response, err := http.Get(url)
	if err != nil {
		log.Println(err)
		return nil, errors.New("failed to get item")
	}
	if response.StatusCode != http.StatusOK {
		log.Println("404 SOOQA")
		return nil, fmt.Errorf("we were banned")
	}
	return response.Body, nil
}

func Save_failed_html(url string, data []byte) {
	splitVal := strings.Split(url, "/")
	filename := "test"
	if len(splitVal) > 0 {
		filename = splitVal[len(splitVal)-1]
	}
	logFile, err := os.Create(fmt.Sprintf("%v.html", filename))
	if err != nil {
		log.Println(err)
		return
	}
	defer logFile.Close()
	logFile.WriteString(string(data))
}
