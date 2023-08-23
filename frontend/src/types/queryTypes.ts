
export enum QueryActionTypes {
    ADD_QUERY_FOR_SITE = "ADD_QUERY_FOR_SITE",
    UPDATE_QUERY = "UPDATE_QUERY",
    CLEAR_QUERY = "CLEAR_QUERY",
    FETCH_NUM_PAGES_SUCCESS = "FETCH_NUM_PAGES_SUCCESS",
    FETCH_NUM_PAGES = "FETCH_NUM_PAGES",
    FETCH_NUM_PAGES_ERROR = "FETCH_NUM_PAGES_ERROR"
}

interface addQueryForSite {
    type: QueryActionTypes.ADD_QUERY_FOR_SITE
    siteName : string
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

interface Query {
    loading : boolean
    error : string
    request : string
    numItems : number
}

export const newQuery = () : Query => {
    return {
        loading : false,
        error : "",
        request : "",
        numItems : 0,
    }
}


export interface QueryState {
    [key : string]: Query
}

export type QueryAction = clearQuery | updateQuery | fetchNumPages | fetchNumPagesError | fetchNumPagesSuccess | addQueryForSite
