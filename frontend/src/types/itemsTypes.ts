
import { models } from "../../wailsjs/go/models";

export enum ItemActionTypes {
    TOGGLE_HIDE_ITEM = "TOGGLE_HIDE_ITEM",
    FETCH_ITEMS = "FETCH_ITEMS",
    FETCH_ITEMS_SUCCESS = "FETCH_ITEMS_SUCCESS",
    FETCH_ITEMS_ERROR = "FETCH_ITEMS_ERROR",
}

interface toggleHideItem {
    type : ItemActionTypes.TOGGLE_HIDE_ITEM
    payload : string
    siteName : string
}

interface fetchItemsAction {
    type : ItemActionTypes.FETCH_ITEMS
    payload : {query : string, numPages : number}
    siteName : string
}

interface fetchItemsSuccessAction {
    type : ItemActionTypes.FETCH_ITEMS_SUCCESS
    payload : Array<models.Item>
    siteName : string
}
interface fetchItemsErrorAction {
    type : ItemActionTypes.FETCH_ITEMS_ERROR
    payload : string
    siteName : string
}


export interface ItemState  {
    loading : boolean,
    error : string,
    data : models.Item[]
}

export type ItemAction = toggleHideItem | fetchItemsAction | fetchItemsSuccessAction | fetchItemsErrorAction
