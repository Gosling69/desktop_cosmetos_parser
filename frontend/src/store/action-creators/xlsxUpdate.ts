import {XlsxAction, XlsxActionTypes} from "../../types/xlsxUpdateTypes"
// import {  } from "react-redux"
import { Dispatch } from "@reduxjs/toolkit"
import { models } from "../../../wailsjs/go/models"

export const addXlsxForSite = (siteName : string) => {
    return (dispatch : Dispatch<XlsxAction>) => {
        dispatch({type : XlsxActionTypes.ADD_XLSX_FOR_SITE, siteName})
    }
}


export const setXlsxLoading = (siteName : string, total : number) => {
    return (dispatch : Dispatch<XlsxAction>) => {
        dispatch({type : XlsxActionTypes.SET_LOADING, payload: total, siteName})
    }
}
export const incrementProgress = (siteName : string) => {
    return (dispatch : Dispatch<XlsxAction>) => {
        dispatch({type : XlsxActionTypes.INCREMENT_PROGRESS, siteName})
    }
}
export const setXlsxComplete = (siteName : string, failed : models.Item[]) => {
    return (dispatch : Dispatch<XlsxAction>) => {
        dispatch({type : XlsxActionTypes.SET_COMPLETE, siteName, payload: failed})
    }
}
export const setXlsxError = (siteName : string, error : any) => {
    return (dispatch : Dispatch<XlsxAction>) => {
        dispatch({type : XlsxActionTypes.SET_ERROR, siteName, payload: error})
    }
}
