package variables

import (
	"regexp"
)

var UnquotedKeyWordsRegexp = regexp.MustCompile(`([a-zA-Z]+):`)
var UnquotedValuesWordsRegexp = regexp.MustCompile(`:([a-zA-Z]+)`)
var ReplaceKeysWithQuotes = []byte(`"$1":`)
var ReplaceValuesWithQuotes = []byte(`:"$1"`)
