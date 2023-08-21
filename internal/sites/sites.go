package sites

import (
	"appleparser/internal/models"
	goldenapple "appleparser/internal/sites/golden_apple"
	"appleparser/internal/variables"
	"fmt"
)

func SiteFactory(siteName string) (models.Site, error) {
	switch siteName {
	case "Golden Apple":
		return goldenapple.CreateApple(variables.AppleProps), nil
	default:
		return nil, fmt.Errorf("site %v not found", siteName)
	}
}
