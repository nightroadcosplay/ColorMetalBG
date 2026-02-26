import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';

interface TAjaxResponseSimple {
    status: string;
    message: string;
}

export class ServiceDownload {


    public static async generareOferta(offerId:string): Promise<TAjaxResponseSimple> {
        const response = await axios.get(`${CONFIG_ENV.URL_DOWNLOAD.generare_oferta}/${offerId}`);
        return response.data;
    }

    public static async generareOfertaPdfLink(type:string, offerId:string, lang:string): Promise<TAjaxResponseSimple> {
        const response = await axios.get(`${CONFIG_ENV.URL_DOWNLOAD.generare_oferta_pdf_link}/${type}/${offerId}/${lang}`);
        return response.data;
    }

    public static async generarePDFPrivacy(type:string): Promise<TAjaxResponseSimple> {
        const response = await axios.get(`${CONFIG_ENV.URL_DOWNLOAD.generare_pdf_privacy}/${type}`);
        return response.data;
    }
}