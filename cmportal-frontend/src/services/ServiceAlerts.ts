import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import { TAlerta } from '@/types/TAlerta';


type TAjaxResponseGetAlerts={
    status: string;
    message: string;
    alerts: TAlerta[];
}

type TAjaxResponseGetCounters={
    status: string;
    message: string;
    countAdrese: number;
    countOferte: number;
}


export class ServiceAlerts {

    public static async getAlertsFromDB(): Promise<TAjaxResponseGetAlerts> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ALERTS.getMyAlerts}`);
        return response.data;
    }

    public static async getCounters(): Promise<TAjaxResponseGetCounters> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_COUNTER.getCounters}`);
        return response.data;
    }
}
