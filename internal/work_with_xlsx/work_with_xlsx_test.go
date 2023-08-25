package work_with_xlsx

import (
	"appleparser/internal/models"
	goldenapple "appleparser/internal/sites/golden_apple"

	"testing"
)

var test_items = []*models.Item{
	{
		Url:  "https://goldapple.ru/10515-19000164636-cream-bronzer",
		Name: "Cream Bronzer",
	},
	{
		Url:  "https://goldapple.ru/19000039123-fixing-natural-spray",
		Name: "Natural Spray",
	},
	{
		Url:  "https://goldapple.ru/3571300002-get-big-lashes-volume-boost-mascara",
		Name: "Mascara",
	},
}

//	var test_links = []string{
//		"https://goldapple.ru/10515-19000164636-cream-bronzer",
//		"https://goldapple.ru/19000039123-fixing-natural-spray",
//		"https://goldapple.ru/3571300002-get-big-lashes-volume-boost-mascara",
//		// "https://goldapple.ru/19000012490-fix-spray",
//		// "https://goldapple.ru/19000152825-ocean-spray-for-natural-styling",
//		// "https://goldapple.ru/19000087916-nude-spray-helsinki",
//		// "1",
//		// "3",
//		// "4",
//		// "5",
//		// "6",
//		// "7",
//		// "8",
//		// "9",
//	}
var apple = goldenapple.CreateApple()

func Test_Single_Parse(t *testing.T) {
	data, _ := apple.ParseLinks(test_items, func() {})
	// for _, item := range data {
	// 	log.Printf("%v - %v\n%v\n", item.Name, item.Url, item.Components)
	// }

	err := ExportToXlsx(data, "testA")
	if err != nil {
		t.Fatal(err)
	}
}
