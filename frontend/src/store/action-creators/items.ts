import { Dispatch } from "@reduxjs/toolkit"
import { ItemActionTypes, ItemAction } from "../../types/itemsTypes"
import { GetItems } from "../../../wailsjs/go/main/App"

export const addItemsForSite = (siteName : string) => {
    return (dispatch : Dispatch<ItemAction>) => {
        dispatch({type: ItemActionTypes.ADD_ITEMS_FOR_SITE, siteName})
    }
}


export const toggleHideItem = (url : string, siteName : string) => {
    return (dispatch : Dispatch<ItemAction>) => {
        dispatch({type: ItemActionTypes.TOGGLE_HIDE_ITEM, payload: url, siteName})
    }
}

export const fetchItems = (query : string, numPages : number, siteName : string) => {
    return async (dispatch : Dispatch<ItemAction>) => {
        try {
            dispatch({type: ItemActionTypes.FETCH_ITEMS, payload: {query, numPages}, siteName})
            const response = await GetItems(query, siteName, numPages)
            dispatch({type: ItemActionTypes.FETCH_ITEMS_SUCCESS, payload: response, siteName})
        } catch (e : any) {
            dispatch({type: ItemActionTypes.FETCH_ITEMS_ERROR, payload: e, siteName})
        }
       
    }
}