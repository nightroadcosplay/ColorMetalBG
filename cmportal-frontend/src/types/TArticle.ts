import { TOptionCategory } from "./TOptionCategory";

export type TArticle = {
    appid:string;
    pid:string;
    categoryPid:string;
    categories: TOptionCategory[];
    code: string;
    name_ro:string;
    name_en:string;
    name_bg:string;
    UMBase:string;
    um1: string;
    um2: string;
    um1ToUm2: number;
    isActive:boolean;
    withLength: boolean;
    withWidth: boolean;
    withThickness: boolean;
    withDiameter: boolean;
    withHeight: boolean;
    withAlloy: boolean;
    withType: boolean;
    sizeLength:number|null;
    sizeWidth:number|null;
    sizeThickness:number|null;
    sizeDiameter:number|null;
    sizeHeight:number|null;
    sizeAlloy: string|null;
    sizeType: string|null;
}
