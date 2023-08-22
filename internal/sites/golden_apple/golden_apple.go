package goldenapple

import (
	structs "appleparser/internal/concurrency_structs"
	"appleparser/internal/data_utils"
	"appleparser/internal/misc"
	"appleparser/internal/models"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/url"
	"strconv"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
)

type goldenApple struct {
	models.SiteProps
}

type parsedScriptData struct {
	Type     string `json:"type"`
	Value    string `json:"value"`
	Text     string `json:"text"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Content  string `json:"content"`
}

var appleProps = models.SiteProps{
	BaseUrl:                  "https://goldapple.ru/catalogsearch/result?q=",
	PageWord:                 "p",
	ItemsPerPage:             20,
	ProductNameTarget:        "span.catalog-product-name-span",
	ProductLinkTarget:        "a.product-item-link",
	ProductDescriptionTarget: ".product-item-category-title",
	ProductBrandTarget:       ".catalog-brand-name-span",
	ProductImageTarget:       ".product-item-photo__img.js-lazy-load-picture",
	ProductContainerClass:    ".products.list.items.product-items",
	MaxRequests:              3,
	SemaphoreSleepSeconds:    12,
	NumPagesTarget:           ".toolbar-number",
}

// return errors more correctly

func CreateApple() models.Site {
	return &goldenApple{
		SiteProps: appleProps,
	}
}

func (s *goldenApple) CalculateNumItems(query string) (int, error) {
	endpoint := s.BaseUrl + url.QueryEscape(query)
	log.Println(endpoint)
	response, err := misc.GetRequest(endpoint)
	if err != nil {
		return 0, err
	}
	defer response.Close()

	doc, err := goquery.NewDocumentFromReader(response)
	if err != nil {
		return 0, errors.New("failed to parse item")
	}
	total_count_str := doc.Find(s.NumPagesTarget).Text()
	total_count, err := strconv.Atoi(total_count_str)
	if err != nil {
		return 0, err
	}
	return total_count, nil
}

func (s *goldenApple) ExtractUrls(query string, numItems int) ([]*models.Item, error) {
	endpoint := s.BaseUrl + url.QueryEscape(query)
	result := structs.CreateList[*models.Item]()
	var wg sync.WaitGroup
	sem := structs.CreateSemaphore(s.MaxRequests, s.SemaphoreSleepSeconds)
	num_pages := numItems / s.ItemsPerPage
	if num_pages == 0 || numItems/s.ItemsPerPage != 0 && numItems%s.ItemsPerPage != 0 {
		num_pages++
	}
	var numSuccessful int
	for p := 1; p <= num_pages; p++ {
		wg.Add(1)
		sem.Acquire()
		go func(p int) {
			defer wg.Done()
			defer sem.Release(p == num_pages || num_pages <= s.MaxRequests)
			new_url := endpoint + fmt.Sprintf("&%v=%d", s.PageWord, p)
			response, err := misc.GetRequest(new_url)
			if err != nil {
				log.Println(err)
				return
			}
			defer response.Close()
			doc, err := goquery.NewDocumentFromReader(response)
			if err != nil {
				log.Println(err)
				return
			}
			start_point := doc.Find(s.ProductContainerClass).Children()
			resp := s.traverseItemList(start_point)
			result.Append(resp...)
			numSuccessful += len(resp)
		}(p)
	}
	wg.Wait()
	if numSuccessful < numItems {
		return result.GetValue()[:numSuccessful], nil
	} else {
		return result.GetValue()[:numItems], nil
	}
}

func (s *goldenApple) ParseLinks(items []*models.Item, progressCallback func()) ([]*models.Item, []*models.Item) {
	res_list := structs.CreateList[*models.Item]()
	failed_urls := structs.CreateList[*models.Item]()
	var wg sync.WaitGroup
	sem := structs.CreateSemaphore(s.MaxRequests, s.SemaphoreSleepSeconds)
	for index, item := range items {
		wg.Add(1)
		sem.Acquire()
		go func(item *models.Item, index int) {
			defer sem.Release(index == len(items)-1)
			defer wg.Done()
			components, err := s.extractComponents(item.Url)
			if err != nil {
				item.Error = err.Error()
				failed_urls.Append(item)
			} else {
				item.Components = components
				res_list.Append(item)
			}
			progressCallback()
		}(item, index)
	}
	wg.Wait()
	return res_list.GetValue(), failed_urls.GetValue()
}

func (s *goldenApple) traverseItemList(start *goquery.Selection) []*models.Item {
	result := []*models.Item{}
	for _, child := range start.Nodes {
		entry := &models.Item{}
		curr_point := goquery.NewDocumentFromNode(child)
		href := curr_point.Find(s.ProductLinkTarget)
		for _, prop := range href.Nodes {
			for _, attr := range prop.Attr {
				if attr.Key == "href" {
					entry.Url = attr.Val
				}
			}
		}
		if len(entry.Url) == 0 {
			continue
		}
		entry.Name = curr_point.Find(s.ProductNameTarget).Text()
		entry.Description = curr_point.Find(s.ProductDescriptionTarget).Children().First().Text()
		entry.Brand = curr_point.Find(s.ProductBrandTarget).Text()
		entry.ImageLink, _ = curr_point.Find(s.ProductImageTarget).Attr("data-src")
		result = append(result, entry)
	}
	return result
}

func (s *goldenApple) extractComponents(url string) ([]string, error) {
	response, err := misc.GetRequest(url)
	if err != nil {
		log.Println(err)
		return nil, errors.New("failed to get item")
	}
	defer response.Close()

	buf, err := io.ReadAll(response)
	if err != nil {
		return nil, err
	}
	r := bytes.NewReader(buf)
	doc, err := goquery.NewDocumentFromReader(r)
	if err != nil {
		return nil, errors.New("failed to parse item")
	}
	var stringOfContents string

	for _, function := range parseFuncs {
		res, err := function(doc)
		if err == nil {
			stringOfContents = res
		}
	}
	words, err := data_utils.SplitContentsString(stringOfContents)
	if err != nil {
		return nil, fmt.Errorf("couldn't split string")
	}
	return words, nil
}

func findContentsInSEO(doc *goquery.Document) (string, error) {

	contentsTargetTag := "script"
	contentsStartWord := `"text":"состав"`
	contentsEndWord := `"},{"`
	var script_content string

	doc.Find(contentsTargetTag).Each(func(i int, s *goquery.Selection) {
		inner_HTML := s.Text()
		if len(inner_HTML) > len(script_content) {
			script_content = inner_HTML
		}
	})

	script_content = data_utils.EnquoteScriptContent(script_content)
	startIndex := strings.Index(script_content, contentsStartWord)
	if startIndex == -1 {
		return "", fmt.Errorf("components not found")
	}

	for i := startIndex; i > startIndex-1000; i-- {
		if script_content[i] == '{' {
			startIndex = i
			break
		}
	}
	endIndex := strings.Index(script_content[startIndex:], contentsEndWord)
	sliceForJson := script_content[startIndex : startIndex+endIndex+2]
	contentsJson := &parsedScriptData{}
	err := json.Unmarshal([]byte(sliceForJson), contentsJson)
	if err != nil {
		return "", err
	}
	return contentsJson.Content, nil
}

func findContentsInPage(doc *goquery.Document) (string, error) {
	startTarget := "article.info-tabs__item-content_contents"
	result := doc.Find(startTarget).Children().First().Children().First().Text()
	if len(result) > 0 {
		return result, nil
	} else {
		return "", fmt.Errorf("couldn't find contents in page")
	}
}

var parseFuncs = []func(*goquery.Document) (string, error){findContentsInSEO, findContentsInPage}
