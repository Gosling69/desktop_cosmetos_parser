
import { sitesReducer } from "./sitesReducer";
import { itemsReducer } from "./itemsReducer";
import { queryReducer } from "./queryReducer";
import { xlsxReducer } from "./xlsxReducer";
import { combineReducers } from "@reduxjs/toolkit"

export const rootReducer = combineReducers({
    items:itemsReducer,
    query:queryReducer,
    xlsxStatus:xlsxReducer,
    sites : sitesReducer
})
export type RootState = ReturnType<typeof rootReducer>