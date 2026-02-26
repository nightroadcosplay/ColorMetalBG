import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TUser} from '@/types/TUser';
import {TCompanyUser} from '@/types/TCompanyUser';

import {getModule} from 'vuex-module-decorators';
import user from '@/store/user';
import { TCompany } from '@/types/TCompany';
import { TUserCompany } from '@/types/TUserCompany';


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetCompanyUsers {
    status: string;
    message: string;
    users:TCompanyUser[];
}

interface TAjaxResponseGetUserCompanies {
    status: string;
    message: string;
    companies: TUserCompany[];
}

interface I_MyProfile {
    firstName:string,
    lastName:string,
    email:string,
    phoneNr: string,
    newPassword:string,
    newPasswordRetyped:string,
    motto:string
}

export class ServiceCompanyUsers {
    public static async getAllCompanyUsers(): Promise<TAjaxResponseGetCompanyUsers> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_COMPANY_USERS.allUsers}/${rnd}`);
        return response.data;
    }

    public static async getProfileImgAsString(puserappid:string) {
        const res = await  <Promise<string>>  axios.get(`${CONFIG_ENV.URL_USER.getMyImageProfileAsString}/${puserappid}`);
        return res;
    }

    public static async getUsersCompanies(userid:string): Promise<TAjaxResponseGetUserCompanies> {
        const response = await axios.get(`${CONFIG_ENV.URL_USER_COMPANIES.getUserCompanies}/${userid}`);
        return response.data;
    }

    
    public static async changeUserCompany(userid:string, cif:string): Promise<TAjaxResponseGetUserCompanies> {
        const response = await axios.post(`${CONFIG_ENV.URL_USER_COMPANIES.changeUserCompany}/${userid}/${cif}`);
        return response.data;
    }

}
