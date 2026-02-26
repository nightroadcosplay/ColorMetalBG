import { Component, Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios, {AxiosPromise} from 'axios';
import {URL_WORKERS } from '@/config';
import user from '@/store/user';
import favorites from '@/store/favorites';


export function getFavorites() {
    const storeFavorites = getModule(favorites);
    if (typeof (Worker) !== "undefined") {
        // Yes! Web worker support!
        const workerFavorites = new Worker(`${URL_WORKERS}/workers/favorites.js`);
        workerFavorites.postMessage({cmd: 'getFavorites'});
        workerFavorites.onmessage = function (event) {
            switch (event.data.cmd) {
                case 'resultFavorites':
                    storeFavorites.set_products_to_favorites(event.data.products)
                    break;
            }
        };
    }
}
