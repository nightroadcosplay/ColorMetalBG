import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TArticle} from "@/types/TArticle";
import {TProductBasket} from "@/types/TProductBasket";


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseIdentifyArticleAndPutInBasket {
    status: string;
    message: string;
    appid: string;
    categoryPid: string;
    categoryName: string;
    productCode: string;
    productName: string;
    productPid: string;
}


type TSize={
    "l":number,
    "w":number,
    "t":number,
    "d":number,
    "h":number,
    "a":string,
    "k": string
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
    withHieght: string;
    withAlloy: string;
    withType: string;
    arrSizes:TSize[];
}

type TAjaxResponseGetBasket={
    status: string;
    message: string;
    products: TProductBasket[];
}
export class ServiceBasket {
/*
       public static async getDetailsArticlesFromDB(pidCategory:string): Promise<TAjaxResponseGetDetailCategory> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.browseArticles}/${pidCategory}`);
        return response.data;
    }
*/
    public static async getBasketFromDB(): Promise<TAjaxResponseGetBasket> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.favorites}`);
        return response.data;
    }

    public static async removeProductFromBasket(appid:string): Promise<TAjaxResponseSimple> {
        const rnd = Math.random();
        const response = await axios.delete(`${CONFIG_ENV.URL_ARTICOL.basket}/${appid}`);
        return response.data;
    }

    public static async identifyArticleInDBAndPutIntoBasket(pidCategory:string,selectedLength:number|null,selectedWidth:number|null, selectedThickness:number|null, selectedDiameter:number|null, selectedHeight:number|null, selectedAlloy:string|null, selectedType:string|null, selectedRollWeight:number|null, um1:string|null, um2:string|null, qUm1:number|null, qUm2:number|null,nrBucati:number|null,dorescDebitare:boolean|null,cuttingLength:number|null,cuttingWidth:number|null,inputFreeTextComments:string|null,tip_um:string|'um12'): Promise<TAjaxResponseIdentifyArticleAndPutInBasket> {
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
        if(um1){ params.set('um1', um1.toString());}else{ params.set('um1', '');}
        if(um2){ params.set('um2', um2.toString());}else{ params.set('um2', '');}
        if(qUm1){ params.set('qUm1', qUm1.toString());}else{ params.set('qUm1', '');}
        if(qUm2){ params.set('qUm2', qUm2.toString());}else{ params.set('qUm2', '');}
        if(nrBucati){ params.set('nrBucati', nrBucati.toString());}else{ params.set('nrBucati', '');}
        if(dorescDebitare){ params.set('dorescDebitare', 'y');}else{ params.set('dorescDebitare', 'n');}
        if(cuttingLength){ params.set('cuttingLength', cuttingLength.toString());}else{ params.set('cuttingLength', '');}
        if(cuttingWidth){ params.set('cuttingWidth', cuttingWidth.toString());}else{ params.set('cuttingWidth', '');}
        if(inputFreeTextComments && inputFreeTextComments.length>0){ params.set('inputFreeTextComments', inputFreeTextComments);}else{ params.set('inputFreeTextComments', '');}
        params.set('tip_um',tip_um);
        const response = await axios.post(`${CONFIG_ENV.URL_ARTICOL.identifyArticleInDBAndPutIntoBasket}`,params);
        return response.data;
    }

    public static async putArticleIntoBasket(productCode:string, qUm1:number|null, qUm2:number|null,inputFreeTextComments?:string|null): Promise<TAjaxResponseIdentifyArticleAndPutInBasket> {
        const params = new URLSearchParams();
        params.set('productCode', productCode);
        if(qUm1){ params.set('qUm1', qUm1.toString());}else{ params.set('qUm1', '');}
        if(qUm2){ params.set('qUm2', qUm2.toString());}else{ params.set('qUm2', '');}
        if(inputFreeTextComments && inputFreeTextComments.length>0){ params.set('inputFreeTextComments', inputFreeTextComments);}else{ params.set('inputFreeTextComments', '');}

        const response = await axios.post(`${CONFIG_ENV.URL_ARTICOL.putArticlebyCodeIntoBasket}`,params);
        return response.data;
    }
}
