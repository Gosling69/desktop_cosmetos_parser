package sites

import (
	"appleparser/internal/models"
	goldenapple "appleparser/internal/sites/golden_apple"
)

var sitesList = []string{"Golden Apple"}

func SiteFactory() map[string]models.Site {
	result := make(map[string]models.Site)
	for _, site := range sitesList {
		switch site {
		case "Golden Apple":
			result[site] = goldenapple.CreateApple()
		default:
			continue
		}
	}
	return result
}
