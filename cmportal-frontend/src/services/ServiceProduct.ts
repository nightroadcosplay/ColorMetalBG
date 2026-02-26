import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TArticle} from "@/types/TArticle";
import {TProductBasket} from '@/types/TProductBasket';

type TProduct=TProductBasket & {withLength: string;withWidth: string;withThickness: string; withDiameter: string; withHeight: string; withAlloy: string; withType: string; withRollWeight: string;isPlacaAluminiu:string}

interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetArticleStock {
    status: string;
    message: string;
    itemStock:number;
}


interface TAjaxResponseGetArticle {
    status: string;
    message: string;
    product:TProduct;
}

export class ServiceProduct {

    public static async getArticleFromDB(pid:string): Promise<TAjaxResponseGetArticle> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.articol}/${pid}/${rnd}`);
        return response.data;
    }

    public static async getArticleStock(productCode:string): Promise<TAjaxResponseGetArticleStock> {
        const response = await axios.get(`${CONFIG_ENV.URL_ARTICOL.get_article_stock}/${productCode}`);
        return response.data;
    }
}
