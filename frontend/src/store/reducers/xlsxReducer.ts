
import { XlsxState, XlsxAction, XlsxActionTypes, newXlsx} from "../../types/xlsxUpdateTypes"

const initialState = {} as XlsxState

export const xlsxReducer = (state = initialState, action : XlsxAction) : XlsxState => {
    switch(action.type) {
        case XlsxActionTypes.ADD_XLSX_FOR_SITE: {
            return {
                ...state, 
                [action.siteName] : newXlsx()
            }
        }
        case XlsxActionTypes.SET_LOADING: {
            return {
                ...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    loading: true, total: action.payload

                }
            }
        }
        case XlsxActionTypes.SET_COMPLETE : {
            return{
                ...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    loading: false, failed: action.payload, total: 0, completed: 0
                }
                
            }
        }
        case XlsxActionTypes.INCREMENT_PROGRESS: {
            return {
                ...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    completed: state[action.siteName].completed + 1
                }
               
            }
        }
        case XlsxActionTypes.SET_ERROR: {
            return {
                ...state, 
                [action.siteName] : {
                    ...state[action.siteName],
                    error: action.payload
                }
            }
        }
        default: {
            return {...state}
        }
    }
}