import { SiteState, SitesAction, SitesActionTypes } from "../../types/sitesTypes";

const initialState : SiteState = []

export const sitesReducer = (state = initialState, action : SitesAction) : SiteState => {
    switch(action.type) {
        case SitesActionTypes.ADD_SITE: {
            return [...state, {name: action.payload}]
        }
        default : {
            return [...state]
        }
    }

}