import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TUser} from '@/types/TUser';
import {TColorMetalAgentAsContact} from '@/types/TColorMetalAgentAsContact';



import {getModule} from 'vuex-module-decorators';
import user from '@/store/user';


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetUser {
    status: string;
    message: string;
    user:TUser
}

interface TAjaxColorMetalUserContacts {
    status: string;
    message: string;
    colorContacts:TColorMetalAgentAsContact
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

export class ServiceUser {
    public static async getCurrentUser(puserId: string, puserToken: string): Promise<TAjaxResponseGetUser> {
        const params = new URLSearchParams();
        params.set('userId', puserId.toString());
        params.set('userToken', puserToken.toString());
        const response = await axios.post(`${CONFIG_ENV.URL_USER.getCurrentUser}`,params);
        return response.data;
    }

    public static async loginUser(puserId: string, password: string): Promise<TAjaxResponseGetUser> {
        const params = new URLSearchParams();
        params.set('user', puserId);
        params.set('password', password);
        const response = await axios.post(`${CONFIG_ENV.URL_USER.loginUser}`,params);
        return response.data;
    }

    public static async getProfileImgAsString(puserappid:string) {
        const res = await  <Promise<string>>  axios.get(`${CONFIG_ENV.URL_USER.getMyImageProfileAsString}/${puserappid}`);
        return res;
    }

    public static async getMyColorMetalUserContacts(): Promise<TAjaxColorMetalUserContacts>  {
        const res = await axios.get(`${CONFIG_ENV.URL_USER.getMyColorMetalUserContacts}`);
        return res.data;
    }
    public static async saveMyProfile(myProfile:I_MyProfile): Promise<TAjaxResponseSimple>{
        const vueInst=this;
        const userAppid=localStorage.getItem('userAppid');
        const response = await axios.put(`${CONFIG_ENV.URL_USER.saveMyProfile}/${userAppid}`,myProfile);
        return response.data;
    }

    public static async checkToken(puserId: string, puserToken: string): Promise<TAjaxResponseGetUser> {
        // const params = new URLSearchParams();
        // params.set('userId', puserId.toString());
        // params.set('userToken', puserToken.toString());
        const response = await axios.post(`${CONFIG_ENV.URL_RESET_PASSWORD.checkToken}/${puserId}/${puserToken}`);
        return response.data;
    }
    
    public static async changePassword(puserId: string, password: string): Promise<TAjaxResponseGetUser> {
        const params = new URLSearchParams();
        params.set('user', puserId);
        params.set('password', password);
        const response = await axios.post(`${CONFIG_ENV.URL_USER.changePassword}`,params);
        return response.data;
    }

    public static async checkSession(): Promise<TAjaxResponseSimple>{
        const response = await axios.get(`${CONFIG_ENV.URL_USER.check_session_status}`);
        return response.data;
    }

    public static async changeLang(lang: string): Promise<TAjaxResponseSimple> {
        const response = await axios.post(`${CONFIG_ENV.URL_USER.changeLanguage}/${lang}`);
        return response.data;
    }
}
