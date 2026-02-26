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
    offerHeader: TOfferHeader;
    productsFromSales: TArticleOfferedFromSales[]
}

export class ServiceOffer {

    public static async sendBasketForAnOffer(basket:TProductBasket[],nrComandaCerere:string,termenCerere:string,slidAdresaLivrare:string,inputFreeTextComments:string): Promise<TAjaxResponseSendForOffer> {
        const rnd=Math.random();
        const postObject={nrComandaCerere:nrComandaCerere,termenCerere:termenCerere,slidAdresaLivrare:slidAdresaLivrare,inputFreeTextComments:inputFreeTextComments,basket:basket}
        const response = await axios.post(`${CONFIG_ENV.URL_OFFER.sendBasketForAnOffer}`,postObject);
        return response.data;
    }

    public static async sendCerereForAnOffer(basket:TProductBasket[],nrComandaCerere:string,termenCerere:string,slidAdresaLivrare:string,offerSlid:string,inputFreeTextComments:string): Promise<TAjaxResponseSendForOffer> {
        const rnd=Math.random();
        const postObject={nrComandaCerere:nrComandaCerere,termenCerere:termenCerere,slidAdresaLivrare:slidAdresaLivrare,offerSlid:offerSlid,inputFreeTextComments:inputFreeTextComments,basket:basket}
        const response = await axios.post(`${CONFIG_ENV.URL_OFFER.sendCerereForNewOffer}`,postObject);
        return response.data;
    }

    public static async sendCerereForAnOffer2(basket:TArticleOfferedFromSales[],nrComandaCerere:string,termenCerere:string,slidAdresaLivrare:string,offerSlid:string,inputFreeTextComments:string): Promise<TAjaxResponseSendForOffer> {
        const rnd=Math.random();
        const postObject={nrComandaCerere:nrComandaCerere,termenCerere:termenCerere,slidAdresaLivrare:slidAdresaLivrare,offerSlid:offerSlid,inputFreeTextComments:inputFreeTextComments,basket:basket}
        const response = await axios.post(`${CONFIG_ENV.URL_OFFER.sendCerereForNewOffer2}`,postObject);
        return response.data;
    }


    public static async getOffersFromDB(): Promise<TAjaxResponseGetOffers> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_OFFER.getMyOffers}`);
        return response.data;
    }

    public static async cancelOffer(offerId:string): Promise<TAjaxResponseSimple> {
        const rnd=Math.random();
        const response = await axios.delete(`${CONFIG_ENV.URL_OFFER.OneOffer}/${offerId}`);
        return response.data;
    }

    public static async getOffer(offerId:string): Promise<TAjaxResponseGetOffer> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_OFFER.OneOffer}/${offerId}`);
        return response.data;
    }

    public static async acceptOffer(offerId:string, nrComandaCerere: string, slidAdresaLivrare: string, inputFreeTextComments: string): Promise<TAjaxResponseGetOffer> {
        const postObject={nrComandaCerere:nrComandaCerere,slidAdresaLivrare:slidAdresaLivrare,inputFreeTextComments:inputFreeTextComments}
        const response = await axios.post(`${CONFIG_ENV.URL_OFFER.acceptOffer}/${offerId}`, postObject);
        return response.data;
    }
}
