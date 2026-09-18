import {Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {CONFIG_ENV} from '@/config';
import user from '@/store/user';
import basket from '@/store/basket';
import offers from '@/store/offers';
import favorites from '@/store/favorites';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TProductBasket} from "@/types/TProductBasket";
import {ServiceFavorites} from "@/services/ServiceFavorites";
import {ServiceBasket} from "@/services/ServiceBasket";
import {ServiceOffer} from '@/services/ServiceOffer';
import {TAdresaLivrare} from "@/types/TAdresaLivrare";
import {ServiceAdreseLivrare} from "@/services/ServiceAdreseLivrare";
import NomEditAdresaLivrare from '@/components/NomEditAdresaLivrare/NomEditAdresaLivrare';
import EventsBus from "@/store/eventbus";
import EditQuantityArticleCerere from '@/components/EditQuantityArticleCerere/EditQuantityArticleCerere';
import { getFirstCategory } from '@/modules/utils';
import {hideKgQuantity} from '@/modules/umDisplay';
import {localizedTypeLabel} from '@/modules/typeLabel';

type TProductBasketMarkedFavorites = TProductBasket & {isInFavorite:boolean};
@Options({
    name: "MyShoppingCart",
    components: { NomEditAdresaLivrare, EditQuantityArticleCerere }
})
export default class MyShoppingCart extends Vue {
    public loading=false;
    public isMyShoppingCartActivated=false;
    public urlToJPG = CONFIG_ENV.URL_CATEGORY.getJPG;
    public storeBasket = getModule(basket);
    public storeFavorites = getModule(favorites);

    // Type label in the current language; the RO text stays the stored value.
    public typeLabel(sizeType: string|null|undefined): string {
        return localizedTypeLabel(sizeType, this.$i18n.locale);
    }
    public appidToBeRemovedFromBasket = '';
    public appidToBeTogglesWithFavorites = '';
    public inputFreeTextComments='';
    public termenCerere='';
    public nrComandaCerere='';
    public slidAdresaLivrare='';
    public myLocale=CONFIG_ENV.myLocale;
    public adrese:TAdresaLivrare[]=[]; 
    public dialogAdresa=false;
    public selectedAdresa:TAdresaLivrare={
        slid:'0',
        appid: '',
        cif: '',
        adresaCodJudet: '',
        adresaLocalitate: '',
        adresaAdresa: '',
        adresaCodPostal: '',
        tipAdresa: '',
        codTara: '',
        navisionid: '',
        denJudet: '',
        isNewAddress: '0'
    };
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public isAdreseLivrareActivated=false;

    declare public $refs: any;
    public userStore = getModule(user);
    public offersStore = getModule(offers);
    public EventBusStore = getModule(EventsBus);

    get user(): TUser {
        return this.userStore.user;
    }

    get basket():TProductBasketMarkedFavorites[]{
        const vueInst=this;
        const result:TProductBasketMarkedFavorites[]=[];
        this.storeBasket.basket.forEach(product=>{
            result.push({
                appid:product.appid,
                productPid:product.productPid,
                categoryPid: product.categoryPid,
                categoryName: product.categoryName,
                productCode:product.productCode,
                productNameRO: product.productNameRO,
                productNameEN: product.productNameEN,
                productNameBG: product.productNameBG,
                qBuc: product.qBuc,
                q_um_base: product.q_um_base,
                qUm1 :product.qUm1,
                qUm2: product.qUm2,
                um1:product.um1,
                um2:product.um2,
                um1_to_um2:product.um1_to_um2,
                kgFromUm2:product.kgFromUm2,
                l: product.l,
                w: product.w,
                t: product.t,
                d: product.d,
                h: product.h,
                a: product.a,
                k: product.k,
                g: product.g,
                dorescDebitare: product.dorescDebitare,
                cuttingLength: product.cuttingLength,
                cuttingWidth: product.cuttingWidth,
                enumPlacaBara:product.enumPlacaBara,
                densitate:product.densitate,
                isInFavorite:vueInst.storeFavorites.favorites.some(favorite=>{return favorite.productCode==product.productCode}),
                observatii:product.observatii,
                nr_ord:product.nr_ord,
                tip_um:product.tip_um
            });
        })
        return result;
    }


    public removeArticleFromShoppingCart(product:TProductBasket): void {
        const vueInst=this;
        vueInst.appidToBeRemovedFromBasket=product.appid;
        ServiceBasket.removeProductFromBasket(product.appid).then(response=>{
            if(response.status=='success') {
                vueInst.storeBasket.remove_product_from_basket(product);
            }
        });

    }

    public toggleArticleInFavorites(item:TProductBasketMarkedFavorites): void {
        const vueInst = this;
        vueInst.appidToBeTogglesWithFavorites=item.appid;
        if (item.isInFavorite) {
            ServiceFavorites.removeProductFromFavorites(item.productCode).then(response=>{
                if(response.status=='success'){
                    vueInst.storeFavorites.remove_product_from_favorites(item);
                    vueInst.appidToBeTogglesWithFavorites='';
                    vueInst.$q.notify({
                        color: 'red-6',
                        textColor: 'white',
                        icon: 'favorite',
                        position: 'top',
                        timeout: 500,
                        message: vueInst.$t('message.article_removed_from_favorite')
                    })
                }
            });
        } else {
        ServiceFavorites.identifyArticleInDBAndPutIntoFavorites(item.categoryPid.toString(), item.l, item.w, item.t, item.d, item.h, item.a, item.k, item.um1, item.um2, item.qUm1, item.qUm2, item.g)
            .then(response => {
                vueInst.appidToBeTogglesWithFavorites='';
                if (response.status == 'success') {
                    const productForFavorite: TProductBasket = {
                        appid: response.appid,
                        productPid: response.productPid,
                        categoryName: response.categoryName,
                        categoryPid: response.categoryPid,
                        productCode: response.productCode,
                        productNameRO: response.productNameRO,
                        productNameEN: response.productNameEN,
                        productNameBG: response.productNameBG,
                        qBuc: item.qBuc,
                        q_um_base: item.qBuc,
                        qUm1: 0,
                        qUm2: null,
                        um1:'',
                        um2:'',
                        um1_to_um2:null,
                        l: item.l,
                        w: item.w,
                        t: item.t,
                        d: item.d,
                        h: item.h,
                        a: item.a,
                        k: item.k,
                        g: item.g,
                        dorescDebitare: item.dorescDebitare,
                        cuttingLength: item.cuttingLength,
                        cuttingWidth: item.cuttingWidth,
                        enumPlacaBara:item.enumPlacaBara,
                        densitate: item.densitate,
                        observatii:'',
                        nr_ord:item.nr_ord,
                        tip_um:item.tip_um
                    }
                    vueInst.storeFavorites.push_product_to_favorites(productForFavorite);
                    vueInst.$q.notify({
                        color: 'red-6',
                        textColor: 'white',
                        icon: 'favorite',
                        position: 'top',
                        timeout: 500,
                        message: vueInst.$t('message.article_added_to_favorite')
                    })
                }
            })
        }
    }

    public optionsDataViitor (date:string): boolean {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        const todayFmt = yyyy + '/' + mm + '/' + dd;
        return date > todayFmt
    }

    public trySendBasketForAnOffer(): void {
        const vueInst=this;
        if(vueInst.slidAdresaLivrare.toString().length==0){
            vueInst.$q.notify({
                color: 'orange-9',
                textColor: 'white',
                icon: 'shopping_cart',
                position: 'top',
                timeout: 1000,
                message: vueInst.$t('message.insert_delivery_address')
            })
            return;
        }
        vueInst.setSelectedAdresa(vueInst.slidAdresaLivrare);
        if(vueInst.selectedAdresa.isNewAddress == '1') {
            vueInst.$q.notify({
                color: 'orange-9',
                textColor: 'white',
                icon: 'shopping_cart',
                position: 'top',
                timeout: 1000,
                message: vueInst.$t('message.address_waiting_for_approval')
            })
            return;
        }
        if(!vueInst.nrComandaCerere && !vueInst.termenCerere){
            vueInst.$q.dialog({
                title: vueInst.$t('message.confirm'),
                message: vueInst.$t('message.nu_ati_completat_termen'),
                cancel: true,
                persistent: true
            }).onOk(() => {
                vueInst.$q.loading.show();
                vueInst.sendBasketForAnOffer();
            })
        }else{
            vueInst.$q.loading.show();
            vueInst.sendBasketForAnOffer();
        }
    }

    public sendBasketForAnOffer(): void {
        const vueInst=this;
        ServiceOffer.sendBasketForAnOffer(vueInst.storeBasket.basket,vueInst.nrComandaCerere,vueInst.termenCerere,vueInst.slidAdresaLivrare,vueInst.inputFreeTextComments).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                //vueInst.offersStore.push_offer(offer);
                vueInst.storeBasket.clear_basket();
                vueInst.termenCerere='';
                vueInst.nrComandaCerere='';
                vueInst.slidAdresaLivrare='';
                vueInst.inputFreeTextComments='';
                vueInst.$router.push({name: 'FirstPageAfterPushOffer',  params: { pidOffer:response.offerId }});
            }
        }).catch((error) => {
            vueInst.$q.loading.hide();
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                icon: 'error',
                position: 'top',
                timeout: 3000,
                message: error.toString()
            })
        });
    }
    
    public moveUP(index: number): void {
        const vueInst=this;
        if (index > 0) {
            const currentItem = vueInst.storeBasket.basket[index];
            currentItem.nr_ord = index-1;
            const newItem = vueInst.storeBasket.basket[index-1];
            newItem.nr_ord = index;
            vueInst.storeBasket.basket.splice(index, 1,newItem);
            vueInst.storeBasket.basket.splice(index-1, 1, currentItem);
        }
    }

    public moveDown(index: number): void {
        const vueInst=this;
        if (index < vueInst.storeBasket.basket.length-1) {
            const currentItem = vueInst.storeBasket.basket[index];
            currentItem.nr_ord = index+1;
            const newItem = vueInst.storeBasket.basket[index+1];
            newItem.nr_ord = index;
            vueInst.storeBasket.basket.splice(index, 1,newItem);
            vueInst.storeBasket.basket.splice(index+1, 1, currentItem);
        }
    }

    public setSelectedAdresa(slid: string): void {
        const vueInst = this;
        vueInst.adrese.forEach(adresa => {
            if(adresa.slid == slid) {
                vueInst.selectedAdresa = adresa;
            }
        });
        // console.log(vueInst.selectedAdresa);
    }

    public activated(): void {
        const vueInst=this;
        this.isMyShoppingCartActivated=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(vueInst.$t('message.my_basket'));
        }
        vueInst.getAdreseLivrare();
    }

    public getAdreseLivrare(): void {
        const vueInst=this;
        ServiceAdreseLivrare.getAdreseLivrare().then(response=>{
            if(response.status=='success'){
                vueInst.adrese=JSON.parse(JSON.stringify(response.adrese));
                if(vueInst.adrese.length==1){
                    vueInst.slidAdresaLivrare=vueInst.adrese[0].slid;
                }
            }
        })
    }

    public onEditItem(item:TProductBasket, index:number): void {
        const vueInst=this;
        // console.log('edit item=%o',item);

        vueInst.storeBasket.basket.splice(index,1, {...item});
        // console.log('Now, products=%o',vueInst.storeBasket.basket)
    }

    public printItem(item:TProductBasket, index:number): void {
        console.log(item);
        console.log(index);
    }


    public onOpenFormAddNewAdresa(): void {
        //this.selectedUser=puser
        const vueInst=this;
        vueInst.selectedAdresa={
            slid:'0',
            appid: '',
            cif: '',
            adresaCodJudet: '',
            adresaLocalitate: '',
            adresaAdresa: '',
            adresaCodPostal: '',
            tipAdresa: '',
            codTara: '',
            navisionid: '',
            denJudet: '',
            isNewAddress: '1'
        };
        if(vueInst.$q.platform.is.mobile){
            vueInst.dialogTransitionShow ='slide-right';
            vueInst.dialogTransitionHide ='slide-left';
        }else{
            vueInst.dialogTransitionShow ='slide-right';
            vueInst.dialogTransitionHide ='slide-left';
        }
        // console.log(this.selectedAdresa);
        vueInst.dialogAdresa=true;
    }

    public closeFormEditAdresaLivrare(needRefresh:boolean): void {
        const vueInst=this;
        vueInst.dialogAdresa=false;
        if(needRefresh){
            vueInst.getAdreseLivrare();
        }
    }

    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        if(vueInst.EventBusStore.event.name=='eventClickAddBtn'){
            if(vueInst.isAdreseLivrareActivated){
                vueInst.onOpenFormAddNewAdresa();
            }
        }
    }

    public getFirstCategory(categories: string): string {
            return getFirstCategory(categories);
        }
    

    public deactivated(): void {
        this.isMyShoppingCartActivated = false;
        this.isAdreseLivrareActivated = false;
    }

    //The KG figure is dropped when it would just repeat the um2 figure - see
    //hideKgQuantity. Only ever hidden while the um2 line is actually rendered,
    //so a row never ends up with no quantity at all. item.qUm1 is untouched.
    public showQtyUm1(item:TProductBasket):boolean{
        const byTipUm = item.tip_um === 'um12' || item.tip_um === 'um1';
        if(!byTipUm){return false;}
        const um2Shown = !!(item.um2 && item.um2.length>0 && (item.tip_um === 'um12' || item.tip_um === 'um2'));
        return !(um2Shown && hideKgQuantity({
            kgFromUm2: item.kgFromUm2,
            um1: item.um1,
            um2: item.um2,
            um1ToUm2: item.um1_to_um2,
            cutting: !!item.dorescDebitare
        }));
    }

}
