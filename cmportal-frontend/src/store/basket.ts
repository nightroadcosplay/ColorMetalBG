import store from './index';
import {Module, VuexModule, Mutation, Action, getModule} from 'vuex-module-decorators';
import {TProductBasket} from '@/types/TProductBasket';
import {TOptionCategory} from "@/types/TOptionCategory";
import {ServiceAdminNomCategory} from "@/services/ServiceAdminNomCategory";

@Module({ namespaced: true, dynamic: true, store, name: 'storeBasket'})
export default class Basket extends VuexModule {
    public basket: TProductBasket[]=[];


    @Mutation
    public PUSH_PRODUCT_TO_BASKET(product: TProductBasket) {
        this.basket.push(product);
    }
    @Action
    public push_product_to_basket(product: TProductBasket) {
        this.context.commit('PUSH_PRODUCT_TO_BASKET', product);
    }

    @Mutation
    public SET_PRODUCTS_TO_BASKET(products: TProductBasket[]) {
        this.basket=JSON.parse(JSON.stringify(products));
    }
    @Action
    public set_products_to_basket(products: TProductBasket[]) {
        this.context.commit('SET_PRODUCTS_TO_BASKET', products);
    }

    @Mutation
    public REMOVE_PRODUCT_FROM_BASKET(product: TProductBasket) {
        this.basket=this.basket.filter(article=>{
           return article.appid!= product.appid;
        });
    }
    @Action
    public remove_product_from_basket(product: TProductBasket) {
        this.context.commit('REMOVE_PRODUCT_FROM_BASKET', product);
    }

    @Mutation
    public CLEAR_BASKET() {
        this.basket=[];
    }
    @Action
    public clear_basket() {
        this.context.commit('CLEAR_BASKET');
    }
}
