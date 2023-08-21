import { queryReducer } from "./queryReducer"
import { itemsReducer } from "./itemsReducer"
import { xlsxReducer } from "./xlsxReducer"
import { combineReducers } from "@reduxjs/toolkit"


export const dashboardReducer = combineReducers({
    items:itemsReducer,
    query:queryReducer,
    xlsxStatus:xlsxReducer,
    name : (state : string = "", action) => state,
})