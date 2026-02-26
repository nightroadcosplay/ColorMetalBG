import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TAdresaLivrare} from "@/types/TAdresaLivrare";

import {getModule} from 'vuex-module-decorators';
import user from '@/store/user';


interface TAjaxResponseSimple {
    status: string;
    message: string;
}

interface TAjaxResponseGetAdrese {
    status: string;
    message: string;
    adresa:TAdresaLivrare;
    adrese:TAdresaLivrare[];
}

export class ServiceAdreseLivrare {
    public static userStore = getModule(user);
    public static async getAdreseLivrare(): Promise<TAjaxResponseGetAdrese> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_USER_ADRESE_LIVRARE.adrese}/${rnd}`);
        return response.data;
    }

    public static async saveAdresaLivrare(padresa: TAdresaLivrare): Promise<TAjaxResponseSimple> {
        const params = new URLSearchParams();
        params.set('codTara', padresa.codTara);
        params.set('adresaAdresa', padresa.adresaAdresa);
        params.set('adresaCodJudet', padresa.adresaCodJudet);
        params.set('adresaLocalitate', padresa.adresaLocalitate);
        params.set('cif', padresa.cif);
        params.set('adresaCodPostal', padresa.adresaCodPostal);
        params.set('slid', padresa.slid);
        params.set('appid', padresa.appid);
        params.set('userid', this.userStore.user.userid);
        params.set('den_judet', padresa.denJudet);
        const response = await axios.post(`${CONFIG_ENV.URL_USER_ADRESE_LIVRARE.adresa}`,params);
        return response.data;
    }

    public static async deleteAdresaLivrare(padresa: TAdresaLivrare): Promise<TAjaxResponseSimple> {
        const response = await axios.delete(`${CONFIG_ENV.URL_USER_ADRESE_LIVRARE.adresa}/${padresa.slid}`);
        return response.data;
    }

    public static async getAdresaLivrare(slid: number): Promise<TAjaxResponseGetAdrese> {
        const response = await axios.get(`${CONFIG_ENV.URL_USER_ADRESE_LIVRARE.getAdresa}/${slid}`);
        return response.data;
    }
}
