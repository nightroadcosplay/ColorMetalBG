import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TArticle} from "@/types/TArticle";
import {TProductBasket} from "@/types/TProductBasket";


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseIdentifyArticle {
    status: string;
    message: string;
    appid:string;
    categoryPid: string;
    categoryName: string;
    productPid: string;
    productCode: string;
    productNameRO: string;
    productNameEN: string;
    productNameBG: string;
}


type TSize={
    "l":number,
    "w":number,
    "t":number,
    "d":number,
    "h":number,
    "a":string,
    "k":string
}

interface TAjaxResponseGetDetailCategory {
    status: string;
    message: string;
    arrLength: Array<number>;
    arrWidth: Array<number>;
    arrThickness: Array<number>;
    arrDiameter: Array<number>;
    categoryName: string;
    categoryPid: number;
    isParentForArticles: string;
    withDiameter: string;
    withLength: string;
    withThickness: string;
    withWidth: string;
    withHeight: string;
    withAlloy: string;
    withType: string;
    arrSizes:TSize[];
}

type TAjaxResponseGetFavorites={
    status: string;
    message: string;
    products: TProductBasket[];
}
export class ServiceFavorites {
/*
       public static async getDetailsArticlesFromDB(pidCategory:string): Promise<TAjaxResponseGetDetailCategory> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.browseArticles}/${pidCategory}`);
        return response.data;
    }
*/
    public static async getFavoritesFromDB(): Promise<TAjaxResponseGetFavorites> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.favorites}`);
        return response.data;
    }

    public static async removeProductFromFavorites(productCode:string): Promise<TAjaxResponseSimple> {
        const rnd = Math.random();
        const response = await axios.delete(`${CONFIG_ENV.URL_ARTICOL.favorites}/${productCode}`);
        return response.data;
    }

    public static async identifyArticleInDBAndPutIntoFavorites(pidCategory:string,selectedLength:number|null,selectedWidth:number|null, selectedThickness:number|null, selectedDiameter:number|null, selectedHeight:number|null, selectedAlloy:string|null, selectedType:string|null, um1:string|null, um2:string|null, qUm1:number|null, qUm2:number|null, selectedRollWeight:number|null): Promise<TAjaxResponseIdentifyArticle> {
        const params = new URLSearchParams();
        params.set('pidCategory', pidCategory);
        if(selectedLength){ params.set('selectedLength', selectedLength.toString());}else{ params.set('selectedLength', '');}
        if(selectedWidth){ params.set('selectedWidth', selectedWidth.toString());}else{ params.set('selectedWidth', '');}
        if(selectedThickness){ params.set('selectedThickness', selectedThickness.toString());}else{ params.set('selectedThickness', '');}
        if(selectedDiameter){ params.set('selectedDiameter', selectedDiameter.toString());}else{ params.set('selectedDiameter', '');}
        if(selectedHeight){ params.set('selectedHeight', selectedHeight.toString());}else{ params.set('selectedHeight', '');}
        if(selectedAlloy){ params.set('selectedAlloy', selectedAlloy.toString());}else{ params.set('selectedAlloy', '');}
        if(selectedType){ params.set('selectedType', selectedType.toString());}else{ params.set('selectedType', '');}
        if(selectedRollWeight){ params.set('selectedRollWeight', selectedRollWeight.toString());}else{ params.set('selectedRollWeight', '');}
        if(qUm1){ params.set('qUm1', qUm1.toString());}else{ params.set('qUm1', '');}
        if(qUm2){ params.set('qUm2', qUm2.toString());}else{ params.set('qUm2', '');}
        if(um1){ params.set('um1', um1.toString());}else{ params.set('um1', '');}
        if(um2){ params.set('um2', um2.toString());}else{ params.set('um2', '');}

        const response = await axios.post(`${CONFIG_ENV.URL_ARTICOL.identifyArticleInDBAndPutIntoFavorites}`,params);
        return response.data;
    }

    public static async putArticleIntoFavorites(productCode:string, um1:string|null, um2:string|null, qUm1:number|null, qUm2:number|null): Promise<TAjaxResponseIdentifyArticle> {
        const params = new URLSearchParams();
        if(productCode){ params.set('productCode', productCode.toString());}else{ params.set('productCode', '');}
        if(qUm1){ params.set('qUm1', qUm1.toString());}else{ params.set('qUm1', '');}
        if(qUm2){ params.set('qUm2', qUm2.toString());}else{ params.set('qUm2', '');}
        if(um1){ params.set('um1', um1.toString());}else{ params.set('um1', '');}
        if(um2){ params.set('um2', um2.toString());}else{ params.set('um2', '');}

        const response = await axios.post(`${CONFIG_ENV.URL_ARTICOL.putArticlebyCodeIntoFavorites}`,params);
        return response.data;
    }
}
