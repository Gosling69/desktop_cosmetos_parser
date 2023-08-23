
import { models } from "../../wailsjs/go/models";

export enum ItemActionTypes {
    ADD_ITEMS_FOR_SITE = "ADD_ITEMS_FOR_SITE",
    TOGGLE_HIDE_ITEM = "TOGGLE_HIDE_ITEM",
    FETCH_ITEMS = "FETCH_ITEMS",
    FETCH_ITEMS_SUCCESS = "FETCH_ITEMS_SUCCESS",
    FETCH_ITEMS_ERROR = "FETCH_ITEMS_ERROR",
}

interface addItemsForSite {
    type : ItemActionTypes.ADD_ITEMS_FOR_SITE
    siteName : string
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


interface Items {
    loading : boolean,
    error : string,
    data : models.Item[]
}

export const newItems = () : Items => {
    return {
        loading : false,
        error : "",
        data : []
    }
}


export interface ItemState  {
    [key : string] : Items
}
   

export type ItemAction = toggleHideItem | fetchItemsAction | fetchItemsSuccessAction | fetchItemsErrorAction | addItemsForSite
