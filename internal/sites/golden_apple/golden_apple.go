package goldenapple

import (
	structs "appleparser/internal/concurrency_structs"
	"appleparser/internal/data_utils"
	"appleparser/internal/models"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
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
	NameStartWord:            `"productDescription":[`,
	NameEndWord:              `]},`,
	ContentsStartWord:        `"text":"состав"`,
	ContentsEndWord:          `"},{"`,
	ContentsTargetTag:        "script",
	ProductNameTarget:        "span.catalog-product-name-span",
	ProductLinkTarget:        "a.product-item-link",
	ProductDescriptionTarget: ".product-item-category-title",
	ProductBrandTarget:       ".catalog-brand-name-span",
	ProductImageTarget:       ".product-item-photo__img.js-lazy-load-picture",
	MaxRequests:              3,
	SemaphoreSleepSeconds:    12,
	NumPagesTarget:           ".toolbar-number",
	ProductContainerClass:    ".products.list.items.product-items",
}

func CreateApple() models.Site {
	return &goldenApple{
		SiteProps: appleProps,
	}
}

func (s *goldenApple) CalculateNumItems(query string) (int, error) {
	endpoint := s.BaseUrl + url.QueryEscape(query)
	log.Println(endpoint)
	response, err := http.Get(endpoint)
	if err != nil {
		log.Println(err)
		return 0, errors.New("failed to get item")
	}
	if response.StatusCode != http.StatusOK {
		log.Println("404 SOOQA")
		return 0, fmt.Errorf("we were banned")
	}
	defer response.Body.Close()
	doc, err := goquery.NewDocumentFromReader(response.Body)
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
	for p := 1; p <= num_pages; p++ {
		wg.Add(1)
		sem.Acquire()
		go func(p int) {
			defer wg.Done()
			defer sem.Release(p == num_pages || num_pages <= s.MaxRequests)

			new_url := endpoint + fmt.Sprintf("&%v=%d", s.PageWord, p)
			response, err := http.Get(new_url)
			if err != nil {
				log.Println(err)
				return
			}
			defer response.Body.Close()
			doc, err := goquery.NewDocumentFromReader(response.Body)
			if err != nil {
				log.Println(err)
				return
			}
			start_point := doc.Find(s.ProductContainerClass).Children()
			resp := s.traverseItemList(start_point)
			result.Append(resp...)
		}(p)
	}
	wg.Wait()
	return result.GetValue()[:numItems], nil
}

func (s *goldenApple) ParseLinks(items []*models.Item, progressCallback func()) ([]*models.Item, []*models.Item) {
	res_list := structs.CreateList[*models.Item]()
	failed_urls := structs.CreateList[*models.Item]()
	done := make(chan bool)
	var wg sync.WaitGroup
	sem := structs.CreateSemaphore(s.MaxRequests, s.SemaphoreSleepSeconds)
	for index, item := range items {
		wg.Add(1)
		sem.Acquire()
		go func(item *models.Item, index int) {
			defer sem.Release(index == len(items)-1)
			defer wg.Done()
			components, name, err := s.extractContents(item.Url)
			if err != nil {
				item.Error = err.Error()
				failed_urls.Append(item)
			} else {
				item.Components = components
				item.Name = name
				res_list.Append(item)
			}
			if index == len(items)-1 {
				done <- true
			}
			progressCallback()
		}(item, index)
	}
	<-done
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
func (s *goldenApple) extractContents(url string) ([]string, string, error) {
	result := []string{}
	var name string
	response, err := http.Get(url)
	if err != nil {
		log.Println(err)
		return result, "", errors.New("failed to get item")
	}
	defer response.Body.Close()
	buf, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, "", err
	}
	r := bytes.NewReader(buf)
	doc, err := goquery.NewDocumentFromReader(r)
	if err != nil {
		return result, "", errors.New("failed to parse item")
	}
	var script_content string
	doc.Find(s.ContentsTargetTag).Each(func(i int, s *goquery.Selection) {
		inner_HTML := s.Text()
		if len(inner_HTML) > len(script_content) {
			script_content = inner_HTML
		}
	})
	script_content = data_utils.EnquoteScriptContent(script_content)
	name, err = s.extractName(script_content)
	if err != nil {
		log.Println(err, url)
		// misc.Save_failed_html(url, buf)
		return nil, "", err
	}
	result, err = s.extractComponents(script_content)
	if err != nil {
		log.Println(err, url)
		// misc.Save_failed_html(url, buf)
		return nil, name, err
	}
	return result, name, nil
}

func (s *goldenApple) extractName(htmlContent string) (string, error) {
	startIndex := strings.Index(htmlContent, s.NameStartWord)
	endIndex := strings.Index(htmlContent[startIndex+len(s.NameStartWord):], s.NameEndWord)
	sliceForJson := htmlContent[startIndex+len(s.NameStartWord) : startIndex+len(s.NameStartWord)+endIndex+len(s.NameEndWord)-1]
	nameJson := &parsedScriptData{}
	err := json.Unmarshal([]byte(sliceForJson), nameJson)
	if err != nil {
		return "", err
	}
	return nameJson.Title, nil
}

func (s *goldenApple) extractComponents(htmlContent string) ([]string, error) {
	startIndex := strings.Index(htmlContent, s.ContentsStartWord)
	if startIndex == -1 {
		return []string{}, fmt.Errorf("components not found")
	}

	for i := startIndex; i > startIndex-1000; i-- {
		if htmlContent[i] == '{' {
			startIndex = i
			break
		}
	}
	endIndex := strings.Index(htmlContent[startIndex:], s.ContentsEndWord)
	sliceForJson := htmlContent[startIndex : startIndex+endIndex+2]
	contentsJson := &parsedScriptData{}
	err := json.Unmarshal([]byte(sliceForJson), contentsJson)
	if err != nil {
		return nil, err
	}
	// REDO, incorrect strings split, filter for empty stuff
	words := strings.Split(contentsJson.Content, ", ")
	for index, word := range words {
		words[index], _ = strconv.Unquote(`"` + strings.ToLower(word) + `"`)
		word = words[index]
		if strings.Contains(word, "may contain") {
			words = words[:index]
			break
		}
	}
	words[len(words)-1] = strings.ReplaceAll(words[len(words)-1], ".", "")
	return words, nil
}
