// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {models} from '../models';

export function GetAvailableSites():Promise<Array<string>>;

export function GetItems(arg1:string,arg2:string,arg3:number):Promise<Array<models.Item>>;

export function GetNumItems(arg1:string,arg2:string):Promise<number>;

export function ParseLinksAndSaveToXlsx(arg1:Array<models.Item>,arg2:string,arg3:string):Promise<Array<models.Item>>;