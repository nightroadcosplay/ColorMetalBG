import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TUserForAdmin} from '@/types/TUserForAdmin';
import {TNewUserForAdmin} from '@/types/TNewUserForAdmin';

import {getModule} from 'vuex-module-decorators';
import user from '@/store/user';
import {TAdresaLivrare} from "@/types/TAdresaLivrare";


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetUser {
    status: string;
    message: string;
    user:TUserForAdmin
}

interface TAjaxResponseSaveNewUser {
    status: string;
    message: string;
    userappid:string
}

interface TAjaxResponseGetUsers {
    status: string;
    message: string;
    users:TUserForAdmin[]
}
export class ServiceAdminUsers {

    public static async resetPassword(puserId: string): Promise<TAjaxResponseSimple> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.resetPassword}/${puserId}`);
        return response.data;
    }

    public static async getUsers(companyAppid:string): Promise<TAjaxResponseGetUsers> {
        console.log('getUsers for companyAppid=%o',companyAppid)
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.users}/${companyAppid}`);
        return response.data;
    }

    public static async getUserDetails(puserAppid: string): Promise<TAjaxResponseGetUser> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.userDetails}/${puserAppid}`);
        return response.data;
    }

    public static async saveNewUser(puser: TNewUserForAdmin): Promise<TAjaxResponseSaveNewUser> {
        const params = new URLSearchParams();
        params.set('userid', puser.userid);
        params.set('firstName', puser.firstName);
        params.set('lastName', puser.lastName);
        params.set('emailAddress', puser.emailAddress);
        params.set('phoneNr', puser.phoneNr);
        params.set('functie', puser.functie);
        params.set('companyCif', puser.companyCif);
        params.set('companyCode', puser.companyCode);
        const response = await axios.post(`${CONFIG_ENV.URL_ADMIN.saveNewUser}`,params);
        return response.data;
    }

}
