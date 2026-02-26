import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TArticle} from "@/types/TArticle";



interface TAjaxResponseSimple {
    status: string;
    message: string;
}

type infoCateg={
    "categoryPid":string,
    "categoryName":string
}


interface TAjaxResponseGetDetailCategory {
    status: string;
    message: string;
    categoryPid: string;
    categoryNameRO: string;
    categoryNameEN: string;
    categoryNameBG: string;
    isParentForArticles: string;
    categories: { pid:string, name_ro:string, name_en:string, name_bg:string, isParentForArticles:string, children:  { pid:string, name_ro:string, name_en:string, name_bg:string, isParentForArticles:string, children:  { pid:string, name_ro:string, name_en:string, name_bg:string}[] }[] }[];
    hierarchicalChain:infoCateg[];
}

export class ServiceBrowseCategories {

    public static async getDetailsCategoriesFromDB(): Promise<TAjaxResponseGetDetailCategory> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_CATEGORY.browseCategories}`);
        return response.data;
    }

    public static async getDetailsCategoryFromDB(pidCategory:string): Promise<TAjaxResponseGetDetailCategory> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_CATEGORY.browseCategories}/${pidCategory}`);

        return response.data;
    }

}
