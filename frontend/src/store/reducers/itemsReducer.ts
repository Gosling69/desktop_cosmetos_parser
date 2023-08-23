import { models } from "../../../wailsjs/go/models";
import { ItemActionTypes, ItemAction, ItemState, newItems } from "../../types/itemsTypes"

const initialState : ItemState = {}

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
        case ItemActionTypes.ADD_ITEMS_FOR_SITE: {
            return {
                ...state, 
                [action.siteName] : newItems()
            }
        }
        case ItemActionTypes.TOGGLE_HIDE_ITEM: {
            return {
                ...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    data: state[action.siteName].data.map(item => itemReducer(item, action))
                }
            }
        }
        case ItemActionTypes.FETCH_ITEMS_SUCCESS: {
            return {
                ... state,
                [action.siteName] : {
                    ...state[action.siteName],
                    data : action.payload, loading: false
                }
            }
        }
        case ItemActionTypes.FETCH_ITEMS_ERROR: {
            return {
                ...state,
                [action.siteName] : {
                    ...state[action.siteName],
                    loading: false, error: action.payload
                }
            }
        }
        case ItemActionTypes.FETCH_ITEMS: {
            return {...state,
                [action.siteName] : {
                    ...state[action.siteName],
                    loading: true, data : []
                }
            }
        }
        default: {
            return {...state}
        }
    }
}