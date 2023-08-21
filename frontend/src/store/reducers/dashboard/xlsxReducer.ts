
import { XlsxState, XlsxAction, XlsxActionTypes} from "../../../types/xlsxUpdateTypes"

const initialState = {
    loading: false,
    total : 0,
    completed : 0,
} as XlsxState

export const xlsxReducer = (state = initialState, action : XlsxAction) : XlsxState => {
    switch(action.type) {
        case XlsxActionTypes.SET_LOADING: {
            return {...state, loading: true, total: action.payload}
        }
        case XlsxActionTypes.SET_COMPLETE : {
            return{...state, loading: false, failed: action.payload, total: 0, completed: 0}
        }
        case XlsxActionTypes.INCREMENT_PROGRESS: {
            return {...state, completed: state.completed + 1}
        }
        default: {
            return {...state}
        }
    }
}