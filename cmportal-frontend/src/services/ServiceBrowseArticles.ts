import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TArticle} from "@/types/TArticle";
import {TEnumPlacaBara} from '@/types/TEnumPlacaBara';


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseIdentifyArticle {
    status: string;
    message: string;
    categoryPid: string;
    productCode: string;
    productNameRO: string;
    productNameEN: string;
    productNameBG: string;
    productPid: string;
    um1: string;
    um2: string;
    um1ToUm2: number;
    cuDebitare:'y'|'n';
    enumPlacaBara:TEnumPlacaBara;
    densitate:number|null;
    isPlacaAluminiu:string;
}

interface TAjaxResponseCalculDimensiuniDebitare {
    status: string;
    message: string;
    productCode: string;
    productPid: string;
    um1: string;
    um2: string;
    q_um1: number;
    q_um2: number;
}

type TSize={
    "l":number,
    "w":number,
    "t":number,
    "d":number
}

type infoCateg={
    "categoryPid":string,
    "categoryName":string
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
    positionLength: number;
    positionWidth: number;
    positionThickness: number;
    positionDiameter: number;
    positionHeight: number;
    positionAlloy: number;
    arrSizes:TSize[];
    hierarchicalChain:infoCateg[];
}

export class ServiceBrowseArticles {

       public static async getDetailsArticlesFromDB(pidCategory:string): Promise<TAjaxResponseGetDetailCategory> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.browseArticles}/${pidCategory}`);
        return response.data;
    }

    public static async identifyArticleInDB(pidCategory:string,selectedLength:number|null,selectedWidth:number|null, selectedThickness:number|null, selectedDiameter:number|null, selectedHeight:number|null, selectedAlloy:string|null, selectedType:string|null, selectedRollWeight:number|null): Promise<TAjaxResponseIdentifyArticle> {
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

        const response = await axios.post(`${CONFIG_ENV.URL_ARTICOL.identifyArticleInDB}`,params);
        return response.data;
    }

    public static async getArticleByProductCode(productCode:string): Promise<TAjaxResponseIdentifyArticle> {
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.articolByProductCode}/${productCode}`);
        return response.data;
    }

    public static async calculDimensiuniDebitare(productCode:string, sizeCuttingLength:number|null, NrBuc:number|null): Promise<TAjaxResponseCalculDimensiuniDebitare> {
        const params = new URLSearchParams();
        params.set('productCode', productCode);
        if(sizeCuttingLength){ params.set('sizeCuttingLength', sizeCuttingLength.toString());}else{ params.set('sizeCuttingLength', '');}
        if(NrBuc){ params.set('NrBuc', NrBuc.toString());}else{ params.set('NrBuc', '');}

        const response = await axios.post(`${CONFIG_ENV.URL_ARTICOL.calculDimensiuniDebitare}`,params);
        return response.data;
    }
}
