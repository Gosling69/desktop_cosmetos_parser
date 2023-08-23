import { Dispatch } from "@reduxjs/toolkit"
import { SitesActionTypes, SitesAction } from "../../types/sitesTypes"

export const addSite = (siteName : string) => {
    return (dispatch : Dispatch<SitesAction>) => {
        dispatch({type : SitesActionTypes.ADD_SITE, payload: siteName})
    }
}