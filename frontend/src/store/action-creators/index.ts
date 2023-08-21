import * as ItemActionCreators from "./items"
import * as QueryActionCreators from "./query"
import * as SiteActionsCreators from "./sites"
import * as XlsxActionsCreators from "./xlsxUpdate"



export default {
    ...ItemActionCreators,
    ...QueryActionCreators,
    ...SiteActionsCreators,
    ...XlsxActionsCreators
}