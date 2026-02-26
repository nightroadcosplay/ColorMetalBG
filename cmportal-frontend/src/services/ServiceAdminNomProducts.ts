import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TArticle} from "@/types/TArticle";
import { TOptionCategory } from '@/types/TOptionCategory';

type TArticleStr = {
    appid:string;
    pid:string;
    categoryPid:string;
    lantHierarchyCategories: TOptionCategory[];
    code: string;
    name:string;
    UMBase:string;
    um1: string;
    um2: string;
    um1ToUm2: number;
    isActive:string;
    withLength: string;
    withWidth: string;
    withThickness: string;
    withDiameter: string;
    withHeight: string;
    withAlloy: string;
    withType: string;
    sizeLength:number|null;
    sizeWidth:number|null;
    sizeThickness:number|null;
    sizeDiameter:number|null;
    sizeHeight:number|null;
    sizeAlloy: string|null;
    sizeType: string|null;
}

interface TAjaxResponseSimple {
    status: string;
    message: string;
}


interface TAjaxResponseGetArticle {
    status: string;
    message: string;
    product:TArticleStr;
}

interface TAjaxResponseGetNomProducts {
    status: string;
    message: string;
    products:TArticle[];
    totalPages:number;
    totalItems:number;
}

export class ServiceAdminNomProducts {

    public static async getArticleFromDB(pid:string): Promise<TAjaxResponseGetArticle> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.nomProduct}/${pid}/${rnd}`);
        return response.data;
    }

    public static async getNomProductsData(pageNumber: number, filterText:string): Promise<TAjaxResponseGetNomProducts> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.nomProduct}/page/10/${pageNumber}/${rnd}`,{ params: { filter_text: filterText } });
        return response.data;
    }

    public static async changeStatusActivInactiv(pid: string, newStatus:string): Promise<TAjaxResponseSimple> {
        const rnd=Math.random();
        const response = await axios.put(`${CONFIG_ENV.URL_ADMIN.nomProduct}/change_status_activ_inactiv/${pid}/${newStatus}`);
        return response.data;
    }

    public static async postProduct(particle: TArticle): Promise<TAjaxResponseSimple> {
        const param = new FormData(); //Create a form object
        param.append('pid', particle.pid);//Add data to the form object via append
        param.append('categoryPid', particle.categoryPid);
        param.append('code', particle.code);
        param.append('name_ro', particle.name_ro);
        param.append('name_en', particle.name_en);
        param.append('name_bg', particle.name_bg);
        param.append('UMBase', particle.UMBase);

        param.append('um1', (particle.um1?particle.um1.toString():''));
        param.append('um2', (particle.um2?particle.um2.toString():''));
        param.append('um1ToUm2', (particle.um1ToUm2?particle.um1ToUm2.toString():''));

        param.append('isActive', (particle.isActive?'y':'n'));
        param.append('sizeLength', (particle.sizeLength?particle.sizeLength.toString():''));
        param.append('sizeWidth', (particle.sizeWidth?particle.sizeWidth.toString():''));
        param.append('sizeThickness', (particle.sizeThickness?particle.sizeThickness.toString():''));
        param.append('sizeDiameter', (particle.sizeDiameter?particle.sizeDiameter.toString():''));

        param.append('sizeAlloy', (particle.sizeAlloy?particle.sizeAlloy.toString():''));
        param.append('sizeHeight', (particle.sizeHeight?particle.sizeHeight.toString():''));
        param.append('sizeType', (particle.sizeType?particle.sizeType.toString():''));

        const config = {
            headers: {'Content-Type': 'multipart/form-data'}
        };
        let response;
        if(particle.pid){
            response = await axios.post(`${CONFIG_ENV.URL_ADMIN.nomProduct}/${particle.pid}`, param, config);
        }else{
            response = await axios.post(`${CONFIG_ENV.URL_ADMIN.nomProduct}/0`, param, config);
        }

        return response.data;
    }


}
