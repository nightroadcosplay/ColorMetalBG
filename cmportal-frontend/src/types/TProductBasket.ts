import {TEnumPlacaBara} from "@/types/TEnumPlacaBara";

export type TProductBasket = {
    appid:string;
    productPid:string;
    categoryPid: string;
    productCode:string;
    productNameRO: string;
    productNameEN: string;
    productNameBG: string;
    categoryName: string;
    qBuc: number;
    q_um_base: number;
    qUm1 :number;
    qUm2: number|null;
    um1: string;
    um2: string|null;
    um1_to_um2 : number | null;
    l: number|null;
    w:number|null,
    t:number|null;
    d:number|null;
    h:number|null;
    a:string|null;
    k:string|null;
    g:number|null;
    dorescDebitare:boolean;
    cuttingLength:number|null;
    cuttingWidth:number|null;
    enumPlacaBara:TEnumPlacaBara;
    kgFromUm2?: string | null;
    densitate:number|null;
    observatii: string;
    nr_ord:number;
    tip_um:string;
}
