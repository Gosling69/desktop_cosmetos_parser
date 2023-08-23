import { models } from "../../wailsjs/go/models"

export enum XlsxActionTypes  {
    ADD_XLSX_FOR_SITE = "ADD_QUERY_FOR_SITE",
    SET_LOADING = "SET_LOADING",
    INCREMENT_PROGRESS = "INCREMENT_PROGRESS",
    SET_COMPLETE = "SET_COMPLETE",
    SET_ERROR = "SET_ERROR"
}

interface addXlsxForSite {
    type : XlsxActionTypes.ADD_XLSX_FOR_SITE,
    siteName : string
}

interface setLoading {
    type : XlsxActionTypes.SET_LOADING,
    siteName : string
    payload : number,
}
interface setError {
    type : XlsxActionTypes.SET_ERROR,
    siteName : string
    payload : string
}
interface setComplete {
    type : XlsxActionTypes.SET_COMPLETE,
    siteName : string
    payload : models.Item[]
}

interface incrementProgress {
    type : XlsxActionTypes.INCREMENT_PROGRESS,
    siteName : string
}

interface Xlsx {
    loading : boolean
    total : number
    completed : number
    error : string
    failed :models.Item[]
}
export const newXlsx = () : Xlsx => {
    return {
        loading : false,
        total : 0,
        completed : 0,
        error : "",
        failed :[],
    }
}

export interface XlsxState {
    [key : string] :Xlsx
}
   

export type XlsxAction = setLoading | setComplete | setError | incrementProgress | addXlsxForSite