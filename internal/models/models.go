package models

import (
	"github.com/PuerkitoBio/goquery"
)

type Item struct {
	Url         string   `json:"Url"`
	Name        string   `json:"Name"`
	Brand       string   `json:"Brand"`
	Description string   `json:"Description"`
	ImageLink   string   `json:"ImageLink"`
	Hide        bool     `json:"Hide"`
	Components  []string `json:"Components"`
	Error       string   `json:"Error"`
}

type Site interface {
	CalculateNumItems(query string) (int, error)
	ExtractUrls(query string, numItems int) ([]*Item, error)
	ParseLinks(items []*Item, progressCallback func()) ([]*Item, []*Item)
	extractContents(url string) ([]string, string, error)
	extractName(htmlContent string) (string, error)
	extractComponents(htmlContent string) ([]string, error)
	traverseItemList(start *goquery.Selection) []*Item
}

type SiteProps struct {
	BaseUrl                  string
	PageWord                 string
	NameStartWord            string
	NameEndWord              string
	ContentsStartWord        string
	ContentsEndWord          string
	ContentsTargetTag        string
	ProductNameTarget        string
	ProductLinkTarget        string
	ProductDescriptionTarget string
	ProductBrandTarget       string
	ProductImageTarget       string
	NumPagesTarget           string
	ProductContainerClass    string
	ItemsPerPage             int
	MaxRequests              int
	SemaphoreSleepSeconds    int
	Site
}
