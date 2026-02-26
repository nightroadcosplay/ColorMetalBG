import { Component, Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios, {AxiosPromise} from 'axios';
import {CONFIG_ENV,URL_WORKERS} from '@/config';
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';


export function getNomenclatoare() {
    const storeNomenclatoare = getModule(nomenclatoare);
    if (typeof (Worker) !== "undefined") {
        // Yes! Web worker support!
        const workerNomCountries = new Worker(URL_WORKERS+"/workers/nomCountriesJudete.js");
        workerNomCountries.postMessage({cmd: 'getNomCountries'});
        workerNomCountries.postMessage({cmd: 'getNomJudete'});
        workerNomCountries.onmessage = function (event) {
            switch (event.data.cmd) {
                case 'resultNomCountries':
                    storeNomenclatoare.set_countries(event.data.countries);
                    break;
                case 'resultNomJudete':
                    storeNomenclatoare.set_judete(event.data.judete);
                    break;
            }
        };
    }
}
