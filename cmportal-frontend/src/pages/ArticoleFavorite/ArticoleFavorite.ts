import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import favorites from '@/store/favorites';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TProductBasket} from '@/types/TProductBasket';
import {ServiceFavorites} from '@/services/ServiceFavorites';
import {CONFIG_ENV} from "@/config";
import {ServiceBasket} from "@/services/ServiceBasket";
import {getBasket} from "@/modules/getBasket";
import basket from "@/store/basket";
import { getFirstCategory } from '@/modules/utils';
import {localizedTypeLabel} from '@/modules/typeLabel';

@Options({
    name: "ArticoleFavorite",
    components: {}
})
export default class ArticoleFavorite extends Vue {
    public inputSearchArticle='';
    declare public $refs: any;
    public urlToJPG = CONFIG_ENV.URL_CATEGORY.getJPG;
    public appidToBeRemovedFromFavorites = '';
    public userStore = getModule(user);
    public storeBasket = getModule(basket);
    public storeFavorites = getModule(favorites);

    // Type label in the current language; the RO text stays the stored value.
    public typeLabel(sizeType: string|null|undefined): string {
        return localizedTypeLabel(sizeType, this.$i18n.locale);
    }


    get user(): TUser {
        return this.userStore.user;
    }

    get favorites(): TProductBasket[] {
        return this.storeFavorites.favorites;
    }

    public addProductToBasket(product:TProductBasket): void {
        const vueInst=this;
        console.log('product=%o',product)
        if(product.qUm1 && product.qUm1*1>0){
            vueInst.$q.loading.show();
            ServiceBasket.putArticleIntoBasket(product.productCode.toString(),product.qUm1, product.qUm2)
                .then(response=>{
                    if(response.status=='success'){
                        getBasket();
                        vueInst.$q.loading.hide();
                        vueInst.$q.notify({
                            color: 'orange-9',
                            textColor: 'white',
                            icon: 'shopping_cart',
                            position: 'top',
                            timeout: 500,
                            message: response.message
                        })
                    }
                })
        }else{
            vueInst.$q.notify({
                color: 'orange-9',
                textColor: 'white',
                icon: 'shopping_cart',
                position: 'top',
                timeout: 1500,
                message: this.$t('message.favorite_quantity').toString()
            })
            this.$router.push({ name: 'BrowseArticles', params: { pidCategory: product.categoryPid , productPid: product.productPid} })
        }
    }

    public removeArticleFromFavorites(product:TProductBasket): void {
        const vueInst=this;
        vueInst.appidToBeRemovedFromFavorites=product.appid;
        ServiceFavorites.removeProductFromFavorites(product.productCode).then(response=>{
            if(response.status=='success') {
                 vueInst.storeFavorites.remove_product_from_favorites(product);
                vueInst.$q.notify({
                    color: 'red-6',
                    textColor: 'white',
                    icon: 'favorite',
                    position: 'top',
                    timeout: 500,
                    message: this.$t('message.article_removed_from_favorite').toString()
                })
            }
        });

    }

    public getFirstCategory(categories: string) : string {
            return getFirstCategory(categories);
        }
    

    public activated(): void {
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.favorite_items').toString());
        }
    }
}
