import { SiteState, SitesAction, SitesActionTypes, EmptySite } from "../../types/sitesTypes";
import { QueryActionTypes } from "../../types/queryTypes";
import { ItemActionTypes } from "../../types/itemsTypes";
import { XlsxActionTypes } from "../../types/xlsxUpdateTypes";
import { dashboardReducer } from "./dashboard";

const initialState : SiteState = {}

// const nonSiteActions = [...Object.values(ItemActionTypes), ...Object.values(XlsxActionTypes), ...Object.values(QueryActionTypes) ]



export const sitesReducer = (state = initialState, action : SitesAction) : SiteState => {
    switch(action.type) {
        case SitesActionTypes.ADD_SITE: {
            return {
                ...state,
                [action.siteName] : new EmptySite(action.siteName).toObject()
            }
        }
        case XlsxActionTypes.SET_LOADING:
        case XlsxActionTypes.INCREMENT_PROGRESS:
        case XlsxActionTypes.SET_COMPLETE:
        case XlsxActionTypes.SET_ERROR:
        case ItemActionTypes.TOGGLE_HIDE_ITEM:
        case ItemActionTypes.FETCH_ITEMS:
        case ItemActionTypes.FETCH_ITEMS_SUCCESS:
        case ItemActionTypes.FETCH_ITEMS_ERROR:
        case QueryActionTypes.UPDATE_QUERY:
        case QueryActionTypes.CLEAR_QUERY:
        case QueryActionTypes.FETCH_NUM_PAGES_SUCCESS:
        case QueryActionTypes.FETCH_NUM_PAGES_ERROR:
        case QueryActionTypes.FETCH_NUM_PAGES: {
            return {
                ...state,
                [action.siteName] : dashboardReducer(state[action.siteName], action)    
            }
        }
        default : {
            return {...state}
        }
    }

}