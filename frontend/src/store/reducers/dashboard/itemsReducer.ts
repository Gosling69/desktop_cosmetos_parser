import { models } from "../../../../wailsjs/go/models";
import { ItemActionTypes, ItemAction, ItemState } from "../../../types/itemsTypes"

const initialState : ItemState = {
    data : new Array<models.Item>,
    loading: false,
    error : ""
}

const itemReducer = (state = {} as models.Item, action : ItemAction) => {
    switch (action.type) {
        case ItemActionTypes.TOGGLE_HIDE_ITEM : {
            if(state.Url !== action.payload) {
                return state
            }
            return {...state, Hide : !state.Hide}
        }
        default: {
            return state
        }
    }
}

export const itemsReducer = (state = initialState, action : ItemAction) : ItemState => {
    switch (action.type) {
        case ItemActionTypes.TOGGLE_HIDE_ITEM: {
            return {...state, data: state.data.map(item => itemReducer(item, action))}
        }
        case ItemActionTypes.FETCH_ITEMS_SUCCESS: {
            return {... state, data : action.payload, loading: false}
        }
        case ItemActionTypes.FETCH_ITEMS_ERROR: {
            return {...state, loading: false, error: action.payload}
        }
        case ItemActionTypes.FETCH_ITEMS: {
            return {...state, loading: true, data : []}
        }
        default: {
            return {...state}
        }
    }
}