package data_utils

import (
	"appleparser/internal/models"
	"regexp"
	"strconv"
	"strings"
)

var unquotedKeyWordsRegexp = regexp.MustCompile(`([a-zA-Z]+):`)
var unquotedValuesWordsRegexp = regexp.MustCompile(`:([a-zA-Z]+)`)
var replaceKeysWithQuotes = []byte(`"$1":`)
var replaceValuesWithQuotes = []byte(`:"$1"`)

func Includes[V comparable](target V, list []V) (int, bool) {
	for index, elem := range list {
		if target == elem {
			return index, true
		}
	}
	return -1, false
}

func EnquoteScriptContent(scriptcontent string) string {
	scriptcontent = string(unquotedKeyWordsRegexp.ReplaceAll([]byte(scriptcontent), replaceKeysWithQuotes))
	scriptcontent = string(unquotedValuesWordsRegexp.ReplaceAll([]byte(scriptcontent), replaceValuesWithQuotes))
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

func SplitContentsString(stringOfContents string) ([]string, error) {
	// log.Println(stringOfContents)
	words := strings.Split(stringOfContents, ", ")
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
