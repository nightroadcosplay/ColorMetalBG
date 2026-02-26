import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TUserForAdmin} from '@/types/TUserForAdmin';
import {TAdminCompany} from '@/types/TAdminCompany';
import {TPaginator} from "@/types/TPaginator";
import {getModule} from 'vuex-module-decorators';
import user from '@/store/user';
import {TAdresaLivrare} from "@/types/TAdresaLivrare";



interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetCompany {
    status: string;
    message: string;
    company:TAdminCompany;
}

interface TAjaxResponseGetCompanyAddress {
    status: string;
    message: string;
    adresa:TAdresaLivrare;
}

interface TAjaxResponseGetCompanies {
    status: string;
    message: string;
    page: TPaginator & {items:TAdminCompany[]};
}
export class ServiceAdminCompanies {

    public static async getCompany(companyAppid:string): Promise<TAjaxResponseGetCompany> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.getCompanyByAppid}/${companyAppid}`);
        return response.data;
    }

    public static async getCompanies(pageNumber:number, filterText:string): Promise<TAjaxResponseGetCompanies> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.getOnePageCompanies}/${pageNumber}/10`, { params: { filter_text: filterText } });
        return response.data;
    }

    public static async getUserDetails(puserAppid: string): Promise<TAjaxResponseGetCompanies> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.getCompaniesByFilter}/${puserAppid}`);
        return response.data;
    }

    public static async getCompanyByCif(cif:string): Promise<TAjaxResponseGetCompany> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.getCompanyByCif}/${cif}`);
        return response.data;
    }

    public static async getCompanyAddress(cif:string): Promise<TAjaxResponseGetCompanyAddress> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.getCompanyAddress}/${cif}`);
        return response.data;
    }

}
