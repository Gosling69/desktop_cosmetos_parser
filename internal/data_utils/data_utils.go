package data_utils

import (
	"appleparser/internal/models"
	"appleparser/internal/variables"
)

func Includes[V comparable](target V, list []V) (int, bool) {
	for index, elem := range list {
		if target == elem {
			return index, true
		}
	}
	return -1, false
}

func EnquoteScriptContent(scriptcontent string) string {
	scriptcontent = string(variables.UnquotedKeyWordsRegexp.ReplaceAll([]byte(scriptcontent), variables.ReplaceKeysWithQuotes))
	scriptcontent = string(variables.UnquotedValuesWordsRegexp.ReplaceAll([]byte(scriptcontent), variables.ReplaceValuesWithQuotes))
	return scriptcontent
}

func Get_Components(data []*models.Item) []string {
	compSet := make(map[string]bool)
	for _, item := range data {
		for _, comp := range item.Components {
			if len(comp) > 0 {
				compSet[comp] = true
			}
		}
	}
	comp_list := []string{}
	for key := range compSet {
		comp_list = append(comp_list, key)
	}
	return comp_list
}
