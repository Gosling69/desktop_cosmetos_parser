package variables

import (
	"appleparser/internal/models"
	"regexp"
)

var UnquotedKeyWordsRegexp = regexp.MustCompile(`([a-zA-Z]+):`)
var UnquotedValuesWordsRegexp = regexp.MustCompile(`:([a-zA-Z]+)`)
var ReplaceKeysWithQuotes = []byte(`"$1":`)
var ReplaceValuesWithQuotes = []byte(`:"$1"`)
var EmitXlsxUpdate = "xlsxInc"
var SitesList = []string{"Golden Apple"}

var AppleProps = models.SiteProps{
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
