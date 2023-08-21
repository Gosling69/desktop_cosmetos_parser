import { QueryAction, QueryActionTypes  } from "../../types/queryTypes"
import { Dispatch } from "@reduxjs/toolkit"
import { GetNumItems } from "../../../wailsjs/go/main/App"

export const setQuery = (newQuery : string, siteName : string) => {
    return (dispatch : Dispatch<QueryAction>) => {
        dispatch({type : QueryActionTypes.UPDATE_QUERY, payload: newQuery, siteName})
    }
}
export const clearQuery = (siteName : string) => {
    return (dispatch : Dispatch<QueryAction>) => {
        dispatch({type : QueryActionTypes.CLEAR_QUERY, siteName})
    }
}

export const fetchNumPages = (query : string, siteName : string) => {
    return async (dispatch : Dispatch<QueryAction>) => {
        try {
            dispatch({type : QueryActionTypes.FETCH_NUM_PAGES, payload: query, siteName})
            const response = await GetNumItems(query, siteName)
            dispatch({type : QueryActionTypes.FETCH_NUM_PAGES_SUCCESS, payload: response, siteName})
        } catch(e : any) {
            dispatch({type : QueryActionTypes.FETCH_NUM_PAGES_ERROR, payload:e, siteName})
        }
    }
}

