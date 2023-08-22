package main

import (
	"appleparser/internal/models"
	"appleparser/internal/sites"
	"appleparser/internal/work_with_xlsx"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"context"
	"log"
)

var emitXlsxUpdate = "xlsxInc"

// App struct
type App struct {
	ctx     context.Context
	siteMap map[string]models.Site
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		siteMap: make(map[string]models.Site),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.siteMap = sites.SiteFactory()
}

func (a *App) GetAvailableSites() []string {
	result := []string{}
	for site := range a.siteMap {
		result = append(result, site)
	}
	return result
}

func (a *App) GetNumItems(query, siteName string) (int, error) {
	targetSite, ok := a.siteMap[siteName]
	if !ok {
		return 0, fmt.Errorf("site: %v not found", siteName)
	}
	num, err := targetSite.CalculateNumItems(query)
	if err != nil {
		log.Println(err)
		return 0, fmt.Errorf("error calculating pages for: %v", query)
	}
	return num, nil
}

func (a *App) GetItems(url, siteName string, numItems int) ([]*models.Item, error) {
	targetSite, ok := a.siteMap[siteName]
	if !ok {
		return nil, fmt.Errorf("site: %v not found", siteName)
	}
	items, err := targetSite.ExtractUrls(url, numItems)
	if err != nil {
		log.Println(err)
		return nil, fmt.Errorf("urls for query: %v not found", url)
	}
	return items, nil
}

func (a *App) ParseLinksAndSaveToXlsx(items []*models.Item, siteName, filename string) ([]*models.Item, error) {
	targetSite, ok := a.siteMap[siteName]
	if !ok {
		return nil, fmt.Errorf("site: %v not found", siteName)
	}
	progressCallback := func() {
		runtime.EventsEmit(a.ctx, emitXlsxUpdate, siteName)
	}
	data, failed := targetSite.ParseLinks(items, progressCallback)
	err := work_with_xlsx.Export_to_xlsx(data, filename)
	if err != nil {
		return nil, err
	}
	return failed, nil
}
