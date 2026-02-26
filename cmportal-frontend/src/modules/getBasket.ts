import { Component, Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios, {AxiosPromise} from 'axios';
import {CONFIG_ENV, URL_WORKERS} from '@/config';
import user from '@/store/user';
import basket from '@/store/basket';
import {TProductBasket} from "@/types/TProductBasket";

export function getBasket() {
    const storeBasket = getModule(basket);
    if (typeof (Worker) !== "undefined") {
        // Yes! Web worker support!
        const workerBasket = new Worker(URL_WORKERS+"/workers/basket.js");
        workerBasket.postMessage({cmd: 'getBasket'});
        workerBasket.onmessage = function (event) {
            switch (event.data.cmd) {
                case 'resultBasket':
                    //event.data.products.forEach((product:TProductBasket,index:number) => {
                    //   event.data.products[index].dorescDebitare=((product.dorescDebitare*1==1)?true:false);
                    storeBasket.set_products_to_basket(event.data.products)
                    break;
            }
        };
    }
}
