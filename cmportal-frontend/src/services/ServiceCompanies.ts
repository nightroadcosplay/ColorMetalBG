import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TUser} from '@/types/TUser';
import {TCompany} from '@/types/TCompany';

import {getModule} from 'vuex-module-decorators';
import user from '@/store/user';


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetCompanies {
    status: string;
    message: string;
    companies:TCompany[];
}


export class ServiceCompanies {
    public static async getCompaniesByFilter(filterString:string): Promise<TAjaxResponseGetCompanies> {
        const params = new URLSearchParams();
        params.set('filterString', filterString);
        const response = await axios.post(`${CONFIG_ENV.URL_ADMIN.getCompaniesByFilter}`,params);
        return response.data;
    }
}
