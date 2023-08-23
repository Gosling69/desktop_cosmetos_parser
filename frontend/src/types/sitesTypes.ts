import { ItemAction, ItemState } from "./itemsTypes"
import { QueryAction, QueryState } from "./queryTypes"
import { XlsxAction, XlsxState } from "./xlsxUpdateTypes"

export enum SitesActionTypes {
    ADD_SITE = "ADD_SITE"
}

interface addSite {
    type : SitesActionTypes.ADD_SITE,
    payload : string
}

export interface Site {
    name : string,
    // items : ItemState,
    // query : QueryState,
    // xlsxStatus : XlsxState
}

// export class EmptySite implements Site {
//     name : string
//     items : ItemState = {
//         loading: false,
//         error :"",
//         data :[],
//     }
//     query: QueryState = {
//         numItems: 0,
//         loading: false,
//         error: "",
//         request : "",
//     }
//     xlsxStatus: XlsxState = {
//         loading: false,
//         error : "",
//         completed: 0,
//         total : 0,
//         failed : []
//     }
//     constructor(name : string){
//         this.name = name
//     }

//     toObject() : Site {
//         return {
//             name: this.name,
//             query : this.query,
//             items : this.items,
//             xlsxStatus : this.xlsxStatus
//         } as Site
//     }
// }

export interface SiteState extends Array<Site> {}

export type SitesAction = addSite
