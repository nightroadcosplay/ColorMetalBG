import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TFactura} from "@/types/TFactura";
import {TCertificate} from "@/types/TCertificate";

interface TAjaxResponseSimple {
    status: string;
    message: string;
}

type TAjaxResponseGetInvoices={
    status: string;
    message: string;
    areInvoicesOverdue: boolean;
    totalRestDePlata: number;
    totalScadenta: number;
    overdueInvoiceCount:number|0;
    invoices: TFactura[];
    invoice: TFactura;
}

type TAjaxResponseGetCertificate={
    status: string;
    message: string;
    countCertificates: number;
    articles: TCertificate[];
    article: TCertificate;
}

export class ServiceInvoice {

    public static async getInvoicesFromDB(): Promise<TAjaxResponseGetInvoices> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_INVOICE.getMyInvoices}`);
        return response.data;
    }

    public static async downloadInvoice(bill_nr:string): Promise<TAjaxResponseGetInvoices> {
        const rnd=Math.random();
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${CONFIG_ENV.URL_INVOICE.download_invoice}/${bill_nr}`);
        return response.data;
    }

    public static async getInvoicesFromNAV(): Promise<TAjaxResponseGetInvoices> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_INVOICE.getInvoicesFromNAV}`);
        return response.data;
    }

    public static async getInvoice(bill_nr:string): Promise<TAjaxResponseGetInvoices> {
        const rnd=Math.random();
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${CONFIG_ENV.URL_INVOICE.getInvoice}/${bill_nr}`);
        return response.data;
    }

    public static async downloadCertificate(bill_nr:string): Promise<TAjaxResponseGetCertificate> {
        const rnd=Math.random();
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${CONFIG_ENV.URL_INVOICE.download_certificate}/${bill_nr}`);
        return response.data;
    }

    public static async getFilteredInvoices(id: string, data: string, valoare: string, moneda: string, nrZileDepasireTermenPlata:string, restDeAchitat:string, dataScadenta:string): Promise<TAjaxResponseGetInvoices> {
        const rnd=Math.random();
        const params = new URLSearchParams();
        params.set('id', id);
        params.set('data', data);
        params.set('valoare', valoare);
        params.set('moneda', moneda);
        params.set('nrZileDepasireTermenPlata', nrZileDepasireTermenPlata);
        params.set('restDeAchitat', restDeAchitat.toString());
        params.set('dataScadenta', dataScadenta);
        const response = await axios.post(`${CONFIG_ENV.URL_INVOICE.getFilteredInvoices}`, params);
        return response.data;
    }

}
