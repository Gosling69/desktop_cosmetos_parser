package goldenapple

import (
	"appleparser/internal/models"
	"appleparser/internal/utils"
	"fmt"
	"sort"
	"sync"
	"testing"
)

var apple = CreateApple()

// var test_link = "https://goldapple.ru/3571300002-get-big-lashes-volume-boost-mascara"
var testItems = []*models.Item{
	{
		Name: "Test1",
		Url:  "https://goldapple.ru/3571300002-get-big-lashes-volume-boost-mascara",
	},
	{
		Name: "Test2",
		Url:  "https://goldapple.ru/19000149484-salt-spray",
	},
	{
		Name: "Test3",
		Url:  "https://goldapple.ru/19000019730-for-me-223-bring-me-to-the-beach",
	},
	{
		Name: "Test4",
		Url:  "https://goldapple.ru/11910-19000041617-pro-icon-look-satin-face-powder",
	},
}
var test_query = "масло для волос"

// func TestGetData(t *testing.T) {
// 	response, err := http.Get("https://goldapple.ru/19000019730-for-me-223-bring-me-to-the-beach")
// 	if err != nil {
// 		log.Println(err)
// 		// return 0, errors.New("failed to get item")
// 	}
// 	if response.StatusCode != http.StatusOK {
// 		log.Println("404 SOOQA")
// 	}
// 	defer response.Body.Close()
// 	buf, err := io.ReadAll(response.Body)
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	// strData := string(buf)
// 	re1 := regexp.MustCompile(`([a-zA-Z]+):`)
// 	replaceStr := `"$1":`
// 	res := re1.ReplaceAll(buf, []byte(replaceStr))
// 	re2 := regexp.MustCompile(`:([a-zA-Z]+)`)
// 	replaceStr2 := `:"$1"`
// 	res = re2.ReplaceAll(res, []byte(replaceStr2))
// 	strRes := string(res)
// 	startWord := `"text":"состав"`

// 	end := `"},{"`
// 	startIndex := strings.Index(strRes, startWord)
// 	for i := startIndex; i > startIndex-1000; i-- {
// 		if strRes[i] == '{' {
// 			startIndex = i
// 			break
// 		}
// 	}
// 	// log.Println(strRes[startIndex : startIndex+1000])

// 	endIndex := strings.Index(strRes[startIndex:], end)
// 	// log.Println(strRes[startIndex : startIndex+endIndex+len(end)-3])

// 	// log.Println(strRes[startIndex+len(start) : startIndex+len(start)+endIndex+len(end)-1])
// 	// fmt.Println(string(res)[2000:10000])
// 	// index := 202537
// 	fug := &AutoGenerated{}
// 	log.Println(string(res[startIndex : startIndex+endIndex+2]))
// 	err = json.Unmarshal(res[startIndex:startIndex+endIndex+len(end)-3], fug)
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	// log.Println(fug.Content)
// 	// log.Println(fug.Title)
// 	// fmt.Println(fug.Title)
// 	// scriptIndex := strings.Index(string(buf), "productDescription:")
// 	// log.Println(scriptIndex)
// 	// log.Println(string(res[index : index+10000]))
// 	// fmt.Printf(`%v\n`, string(res[scriptIndex:scriptIndex+10000]))

// }

// func TestGetNumPages(t *testing.T) {
// 	num, err := apple.CalculateNumPages(test_query)
// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	log.Println(num)
// }

// func TestExtractUrls(t *testing.T) {
// 	items, err := apple.ExtractUrls(test_query, 5)

// 	if err != nil {
// 		t.Fatal(err)
// 	}

//		for _, item := range items {
//			log.Printf("%v - %v\n %v\n", item.Brand, item.Name, item.Description)
//		}
//	}
type safeCount struct {
	mx sync.Mutex
	v  int
}

func (s *safeCount) Increment() {
	s.mx.Lock()
	defer s.mx.Unlock()
	s.v++
}
func TestParseLinks(t *testing.T) {

	items, _ := apple.ExtractUrls(test_query, 20)
	// result, _ := apple.ParseLinks(testItems, func() {})
	// for _, fail := range failed {
	// 	log.Println(fail.Url)
	// }
	callback := func(total int) func() {
		counter := &safeCount{}
		return func() {
			counter.Increment()
			fmt.Printf("%v/%v\r", counter.v, total)
		}
	}

	result, _ := apple.ParseLinks(items, callback(len(items)))
	components := utils.GetComponents(result)
	sort.Strings(components)
	for index, comp := range components {
		fmt.Printf("%v - %v\n", comp, index)
	}

	// for _, item := range result {
	// 	log.Printf("%v - %v\n", item.Url, item.Components)
	// }

}
