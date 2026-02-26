import store from './index';
import {Module, VuexModule, Mutation, Action, getModule} from 'vuex-module-decorators';
import {TProductBasket} from '@/types/TProductBasket';
import {TOffer} from "@/types/TOffer";

@Module({ namespaced: true, dynamic: true, store, name: 'storeOffers'})
export default class Offers extends VuexModule {
    public offers: TOffer[]=[];

    @Mutation
    public PUSH_OFFER(offer: TOffer) {
        this.offers.push(offer);
    }
    @Action
    public push_offer(offer: TOffer) {
        this.context.commit('PUSH_OFFER', offer);
    }


}
