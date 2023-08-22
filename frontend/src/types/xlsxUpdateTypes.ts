import { models } from "../../wailsjs/go/models"

export enum XlsxActionTypes  {
    SET_LOADING = "SET_LOADING",
    INCREMENT_PROGRESS = "INCREMENT_PROGRESS",
    SET_COMPLETE = "SET_COMPLETE",
    SET_ERROR = "SET_ERROR"
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

export interface XlsxState {
    loading : boolean
    total : number
    completed : number
    error : string
    failed :models.Item[]
}

export type XlsxAction = setLoading | setComplete | setError | incrementProgress