import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TOfferHeader} from "@/types/TOfferHeader";
import {TProductBasket} from "@/types/TProductBasket";
import {TArticleOfferedFromSales} from "@/types/TArticleOfferedFromSales";

interface TAjaxResponseSimple {
    status: string;
    message: string;
}


type TAjaxResponseSendForOffer={
    status: string;
    message: string;
    offerId: string;
}


type TAjaxResponseGetOffers={
    status: string;
    message: string;
    offers: TOfferHeader[];
}

type TAjaxResponseGetOffer={
    status: string;
    message: string;
    offerHeader: TOfferHeader[];
    products: TProductBasket[]
}

export class ServiceCerere {
    public static async getCerere(offerId:string): Promise<TAjaxResponseGetOffer> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_CERERE.cerere}/${offerId}`);
        return response.data;
    }
}
