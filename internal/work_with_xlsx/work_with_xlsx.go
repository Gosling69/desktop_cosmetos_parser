package work_with_xlsx

import (
	"appleparser/internal/models"
	"appleparser/internal/utils"
	"sort"

	"fmt"
	"log"
	"unicode/utf8"

	"github.com/xuri/excelize/v2"
)

var sheetName = "Sheet1"
var verticalOffset = 3
var cellColor = []string{"267041"}

// add count of encountered components for each row

func ExportToXlsx(items []*models.Item, filename string) error {

	all_components := utils.GetComponents(items)
	sort.Strings(all_components)

	f := excelize.NewFile()
	style, err := f.NewStyle(&excelize.Style{
		Fill: excelize.Fill{Type: "pattern", Color: cellColor, Pattern: 1},
	})
	if err != nil {
		log.Println(err)
		return err
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	urls := []string{}
	i := 1
	for _, item := range items {
		cell_name := fmt.Sprintf("%s%d", string(rune(65+i)), 1)
		f.SetCellValue(sheetName, cell_name, fmt.Sprintf("%v %v", item.Brand, item.Name))
		cell_name = fmt.Sprintf("%s%d", string(rune(65+i)), 2)
		f.SetCellValue(sheetName, cell_name, item.Url)
		urls = append(urls, item.Url)
		i++
	}
	for i, comp := range all_components {
		vertical_coord := i + verticalOffset
		cell_name := fmt.Sprintf("A%v", vertical_coord)
		f.SetCellValue(sheetName, cell_name, comp)

		for index, url := range urls {
			target_comps := []string{}
			for _, item := range items {
				if item.Url == url {
					target_comps = item.Components
					break
				}
			}
			if _, ok := utils.Includes[string](comp, target_comps); ok {
				cell_name := fmt.Sprintf("%s%d", string(rune(65+index+1)), vertical_coord)
				f.SetCellStyle(sheetName, cell_name, cell_name, style)
			}
		}

	}
	cols, err := f.GetCols(sheetName)
	if err != nil {
		return err
	}

	for idx, col := range cols {
		largestWidth := 0
		for _, rowCell := range col {
			cellWidth := utf8.RuneCountInString(rowCell) + 2 // + 2 for margin
			if cellWidth > largestWidth {
				largestWidth = cellWidth
			}
		}
		name, err := excelize.ColumnNumberToName(idx + 1)
		if err != nil {
			return err
		}
		f.SetColWidth(sheetName, name, name, float64(largestWidth))
	}
	err = f.SetPanes("Sheet1", &excelize.Panes{
		Freeze:      true,
		XSplit:      1,
		YSplit:      1,
		TopLeftCell: "B2",
		ActivePane:  "bottomRight",
		Panes: []excelize.PaneOptions{
			{Pane: "bottomRight"},
		},
	})
	if err != nil {
		return err
	}

	if err := f.SaveAs(fmt.Sprintf("%v.xlsx", filename)); err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}
