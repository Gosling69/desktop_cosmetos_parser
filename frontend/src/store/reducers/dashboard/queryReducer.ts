import { QueryActionTypes, QueryAction, QueryState } from "../../../types/queryTypes"

const initialState : QueryState = {
    request :"",
    numItems : 0,
    loading : false,
    error : "",
}

export const queryReducer = (state = initialState, action : QueryAction) : QueryState => {
    switch (action.type) {
        case QueryActionTypes.UPDATE_QUERY:
            return {...state, request: action.payload}
        case QueryActionTypes.CLEAR_QUERY:
            return initialState
        case QueryActionTypes.FETCH_NUM_PAGES:
            return {...state, numItems : 0, loading: true}
        case QueryActionTypes.FETCH_NUM_PAGES_SUCCESS:
            return {...state, numItems : action.payload, loading : false}
        case QueryActionTypes.FETCH_NUM_PAGES_ERROR:
            return {...state, loading : false, error: action.payload}
        default:
            return state
    }
}