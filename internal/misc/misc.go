package misc

import (
	"bufio"
	"fmt"
	"log"
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
func Save_failed_html(url string, data []byte) {
	splitVal := strings.Split(url, "/")
	filename := "test"
	if len(splitVal) > 0 {
		filename = splitVal[len(splitVal)-1]
		// log.Println(filename)
	}
	logFile, err := os.Create(fmt.Sprintf("%v.html", filename))
	if err != nil {
		log.Println(err)
		return
	}
	defer logFile.Close()
	logFile.WriteString(string(data))
}
