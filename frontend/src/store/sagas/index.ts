import {put, takeEvery} from "redux-saga/effects"
import {SitesAction, SitesActionTypes} from "../../types/sitesTypes"
import {XlsxActionTypes} from "../../types/xlsxUpdateTypes"
import {QueryActionTypes} from "../../types/queryTypes"
import {ItemActionTypes} from "../../types/itemsTypes"



function* fillStateBySite(action : SitesAction) {
    yield put({type:XlsxActionTypes.ADD_XLSX_FOR_SITE, siteName:action.payload})
    yield put({type:QueryActionTypes.ADD_QUERY_FOR_SITE, siteName:action.payload})
    yield put({type:ItemActionTypes.ADD_ITEMS_FOR_SITE, siteName:action.payload})

}

function* siteSaga() {
    yield takeEvery(SitesActionTypes.ADD_SITE, fillStateBySite)
}

export default siteSaga