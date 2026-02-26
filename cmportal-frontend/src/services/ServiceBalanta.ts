import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TBalantaNav} from "@/types/TBalantaNav";
import {TCustLedgerEntry} from "@/types/TCustLedgerEntry";

interface TAjaxResponseSimple {
    status: string;
    message: string;
}

type TAjaxResponseGetBalanta={
    status: string;
    message: string;
    balantaInNav: TBalantaNav | TBalantaNav[];
}

export class ServiceBalanta {

    public static async getBalantaFromNav(): Promise<TAjaxResponseGetBalanta> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_BALANTA.getMyAccountingBalanceJson}`);
        return response.data;
    }

    public static balantaGoala:TBalantaNav = {
        Name: '',
        No: '',
        SoldCredit: '',
        SoldDebit: '',
        SoldInit: '',
        SumCredit: '',
        SumDebit: '',
        invoices: [],
        CustLedgerEntry: []
    }

    public static async getBalancePdfMobile(): Promise<TAjaxResponseSimple>{
        const response = await axios.get(`${CONFIG_ENV.URL_BALANTA.getPdfMobile}`);
        return response.data;
    }
}
