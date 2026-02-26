import store from './index';
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';
import {TProductBasket} from '@/types/TProductBasket';

@Module({ namespaced: true, dynamic: true, store, name: 'storeFavorites'})
export default class Favorites extends VuexModule {
    public favorites: TProductBasket[]=[];


    @Mutation
    public PUSH_PRODUCT_TO_FAVORITES(product: TProductBasket) {
        this.favorites.push(product);
    }
    @Action
    public push_product_to_favorites(product: TProductBasket) {
        this.context.commit('PUSH_PRODUCT_TO_FAVORITES', product);
    }


    @Mutation
    public SET_PRODUCTS_TO_FAVORITES(products: TProductBasket[]) {
        this.favorites=JSON.parse(JSON.stringify(products));
    }
    @Action
    public set_products_to_favorites(products: TProductBasket[]) {
        this.context.commit('SET_PRODUCTS_TO_FAVORITES', products);
    }


    @Mutation
    public REMOVE_PRODUCT_FROM_FAVORITES(product: TProductBasket) {
        this.favorites=this.favorites.filter(article=>{
           return article.productCode!= product.productCode;
        });
    }
    @Action
    public remove_product_from_favorites(product: TProductBasket) {
        this.context.commit('REMOVE_PRODUCT_FROM_FAVORITES', product);
    }

    @Mutation
    public CLEAR_FAVORITES() {
        this.favorites=[];
    }
    @Action
    public clear_favorites() {
        this.context.commit('CLEAR_FAVORITES');
    }
}
