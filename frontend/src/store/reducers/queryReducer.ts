import { QueryActionTypes, QueryAction, QueryState, newQuery } from "../../types/queryTypes"

const initialState : QueryState = {}

export const queryReducer = (state = initialState, action : QueryAction) : QueryState => {
    switch (action.type) {
        case QueryActionTypes.ADD_QUERY_FOR_SITE:
            return {
                ...state, 
                [action.siteName] : newQuery()
            }
        case QueryActionTypes.UPDATE_QUERY:
            return {
                ...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    request: action.payload
                }
            }
        case QueryActionTypes.CLEAR_QUERY:
            return {
                ...state, 
                [action.siteName] : newQuery()
            }
        case QueryActionTypes.FETCH_NUM_PAGES:
            return {
                ...state,
                [action.siteName] : {
                    ...state[action.siteName],
                    numItems : 0, loading: true
                } 
            }
        case QueryActionTypes.FETCH_NUM_PAGES_SUCCESS:
            return {...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    numItems : action.payload, loading : false
                } 
            }
        case QueryActionTypes.FETCH_NUM_PAGES_ERROR:
            return {...state,
                [action.siteName] : {
                    ...state[action.siteName],
                    loading : false, error: action.payload
                } 
            }
        default:
            return state
    }
}