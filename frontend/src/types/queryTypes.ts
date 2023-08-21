
export enum QueryActionTypes {
    UPDATE_QUERY = "UPDATE_QUERY",
    CLEAR_QUERY = "CLEAR_QUERY",
    FETCH_NUM_PAGES_SUCCESS = "FETCH_NUM_PAGES_SUCCESS",
    FETCH_NUM_PAGES = "FETCH_NUM_PAGES",
    FETCH_NUM_PAGES_ERROR = "FETCH_NUM_PAGES_ERROR"
}

interface clearQuery {
    type : QueryActionTypes.CLEAR_QUERY 
    siteName : string
}

interface updateQuery {
    type : QueryActionTypes.UPDATE_QUERY,
    payload :  string
    siteName : string
}
interface fetchNumPages {
    type: QueryActionTypes.FETCH_NUM_PAGES
    payload : string
    siteName : string
}
interface fetchNumPagesError {
    type: QueryActionTypes.FETCH_NUM_PAGES_ERROR
    siteName : string
    payload: string
}
interface fetchNumPagesSuccess {
    type : QueryActionTypes.FETCH_NUM_PAGES_SUCCESS,
    payload : number
    siteName : string
}

export interface QueryState {
    loading : boolean
    error : string
    request : string
    numItems : number
}

export type QueryAction = clearQuery | updateQuery | fetchNumPages | fetchNumPagesError | fetchNumPagesSuccess
