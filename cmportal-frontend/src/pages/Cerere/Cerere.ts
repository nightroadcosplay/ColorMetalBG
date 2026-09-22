import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {TProductBasket} from '@/types/TProductBasket';
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TAdresaLivrare} from "@/types/TAdresaLivrare";
import {TOfferHeader} from "@/types/TOfferHeader";
import {getFirstCategory, timeUntilFutureDate} from '@/modules/utils'
import nomenclatoare from "@/store/nomenclatoare";
import {ServiceCerere} from '@/services/ServiceCerere';
import {CONFIG_ENV} from "@/config";
import {ServiceFavorites} from "@/services/ServiceFavorites";
import favorites from "@/store/favorites";
import {ServiceAdreseLivrare} from "@/services/ServiceAdreseLivrare";
import {ServiceOffer} from "@/services/ServiceOffer";
import eventbus from "@/store/eventbus";
import EditQuantityArticleCerere from '@/components/EditQuantityArticleCerere/EditQuantityArticleCerere.vue';
import BrowseCategories from '@/pages/BrowseCategories/BrowseCategories.vue';
import BrowseArticles from '@/pages/BrowseArticles/BrowseArticles.vue';
import NomEditAdresaLivrare from '@/components/NomEditAdresaLivrare/NomEditAdresaLivrare';
import {hideKgQuantity} from '@/modules/umDisplay';
import {localizedTypeLabel} from '@/modules/typeLabel';


type TProductBasketMarkedFavorites = TProductBasket & {isInFavorite:boolean};

@Options({
    name: "Cerere",
    components: {BrowseCategories, BrowseArticles, EditQuantityArticleCerere, NomEditAdresaLivrare}
})
export default class Cerere extends Vue {
    @Prop({ default: null }) public readonly propOfferId!: string;
    public termenCerere='';
    public nrComandaCerere='';
    public nrComandaCerereInitial='';
    public slidAdresaLivrare='';
    public isEditingAsNewRequest=false;
    public showBrowseArticles = false;
    public myLocale=CONFIG_ENV.myLocale;
    public pidForBrowseCategory = '0';
    public pidForBrowseCategoryHasArticles = false;
    public adrese:TAdresaLivrare[]=[];
    public offerHeader:TOfferHeader={
        offerId: '',
        offerSlid: '',
        status: '',
        trackCreationDate: '',
        trackDateOfertare: '',
        trackDateAccept: '',
        dateWhenOfferExpire: '',
        termenLivrareSolicitat: '',
        qKg: null,
        valFinalaFaraTvaRON: null,
        valTvaRON: null,
        valFinalaCuTvaRON: null,
        valFinalaFaraTvaEUR: null,
        valTvaEUR: null,
        valFinalaCuTvaEUR: null,
        valFinalaFaraTvaHUF: null,
        valTvaHUF: null,
        valFinalaCuTvaHUF: null,
        idValuta: 'RON',
        ComandaClient: '',
        slidAdresaLivrare: 0,
        val_discount_linii_ron: 0,
        val_discount_oferta_ron: 0,
        val_discount_linii_eur: 0,
        val_discount_oferta_eur: 0,
        val_discount_linii_huf: 0,
        val_discount_oferta_huf: 0,
        invoices: null,
        observatii_asm: '',
        nume_utilizator: '',
        track_user_id: ''
    };
    
    public dialogAdresa=false;
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public inputFreeTextComments='';
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
    }
    public adresa:TAdresaLivrare={
        slid: '',
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
    public products:TProductBasketMarkedFavorites[]=[];
    declare public $refs: any;
    public appidToBeTogglesWithFavorites = '';
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);

    // Type label in the current language; the RO text stays the stored value.
    public typeLabel(sizeType: string|null|undefined): string {
        return localizedTypeLabel(sizeType, this.$i18n.locale);
    }
    public storeFavorites = getModule(favorites);
    public urlToJPG = CONFIG_ENV.URL_CATEGORY.getJPG;
    public EventBusStore = getModule(eventbus);
    public changedItemsInOffer = false;

    private timeUntilFutureDate(pStringDate: string, pformat:string){
        return timeUntilFutureDate(pStringDate,pformat,this.$i18n.locale)
    }

    get pageTitle(): string {
        const date = this.offerHeader.trackCreationDate || (this.$route.query.d as string) || '';
        const numeUtilizator = (this.$route.query.u as string) || '';
        return `${this.$t('message.request')} ${this.propOfferId}${date?' / '+date:''}${numeUtilizator?' '+numeUtilizator:''}`;
    }

    @Watch('pageTitle')
    onPageTitleChanged(): void {
        if(this.$q.platform.is.mobile){
            this.userStore.set_title_back_bar(this.pageTitle);
        }
    }

    public onBack(): void {
        const vueInst=this;
        if(vueInst.showBrowseArticles){
            vueInst.showBrowseArticles=false;
            vueInst.pidForBrowseCategory='0';
            vueInst.pidForBrowseCategoryHasArticles=false;
        }else{
            vueInst.$router.push({name: 'Offers'});
        }
    }

    public toggleArticleInFavorites(item:TProductBasketMarkedFavorites,indexInProductsList:number): void {
        const vueInst = this;
        console.log('item=%o',item)
        vueInst.appidToBeTogglesWithFavorites=item.appid;
        if (item.isInFavorite) {
            ServiceFavorites.removeProductFromFavorites(item.productCode).then(response=>{
                if(response.status=='success'){
                    vueInst.storeFavorites.remove_product_from_favorites(item);
                    vueInst.appidToBeTogglesWithFavorites='';
                    vueInst.products[indexInProductsList].isInFavorite=vueInst.storeFavorites.favorites.some(favorite=>{return favorite.productCode==item.productCode})
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
            if(item.productCode && item.productCode.length > 0) {//stim exact articolul
                ServiceFavorites.putArticleIntoFavorites(item.productCode,item.um1, item.um2, item.qUm1, item.qUm2).then(response => {
                    vueInst.appidToBeTogglesWithFavorites = '';
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
                            um1: '',
                            um2: null,
                            um1_to_um2: null,
                            qUm1: 0,
                            qUm2: 0,
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
                            enumPlacaBara: item.enumPlacaBara,
                            densitate: item.densitate,
                            observatii:'',
                            nr_ord: item.nr_ord,
                            tip_um: item.tip_um
                        }
                        vueInst.storeFavorites.push_product_to_favorites(productForFavorite);
                        vueInst.products[indexInProductsList].isInFavorite=vueInst.storeFavorites.favorites.some(favorite=>{return favorite.productCode==item.productCode})
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
            }else {
                ServiceFavorites.identifyArticleInDBAndPutIntoFavorites(item.categoryPid.toString(), item.l, item.w, item.t, item.d, item.h, item.a, item.k, item.um1, item.um2, item.qUm1, item.qUm2, item.g)
                    .then(response => {
                        vueInst.appidToBeTogglesWithFavorites = '';
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
                                um1: '',
                                um2: null,
                                um1_to_um2: null,
                                qUm1: 0,
                                qUm2: 0,
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
                                enumPlacaBara: item.enumPlacaBara,
                                densitate: item.densitate,
                                observatii:'',
                                nr_ord: item.nr_ord,
                                tip_um: item.tip_um
                            }
                            vueInst.storeFavorites.push_product_to_favorites(productForFavorite);
                            vueInst.products[indexInProductsList].isInFavorite=vueInst.storeFavorites.favorites.some(favorite=>{return favorite.productCode==item.productCode})
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
    }

    public trySendCerereForAnOffer(): void {
        const vueInst=this;
        if(vueInst.products.length==0){
            vueInst.$q.notify({
                color: 'orange-9',
                textColor: 'white',
                icon: 'shopping_cart',
                position: 'top',
                timeout: 1000,
                message: vueInst.$t('message.no_articles_in_request')
            })
            return;
        }
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
        if(new Date(vueInst.termenCerere) < new Date()){
            vueInst.$q.notify({
                color: 'orange-9',
                textColor: 'white',
                icon: 'shopping_cart',
                position: 'top',
                timeout: 1000,
                message: vueInst.$t('message.termen_livrare_invalid')
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
                vueInst.sendCerereForAnOffer();
            })
        }else{
            vueInst.$q.loading.show();
            vueInst.sendCerereForAnOffer();
        }
    }

    public removeArticle(item:TProductBasketMarkedFavorites,index:number): void {
        const vueInst=this;
        vueInst.$q.dialog({
            title: vueInst.$t('message.delete_item') + ' - ' +  this.$i18n.locale === 'ro' ? vueInst.products[index].productNameRO : this.$i18n.locale === 'en' ? vueInst.products[index].productNameEN : vueInst.products[index].productNameBG,
            message: vueInst.$t('message.delete_item_question'),
            cancel: true
        })
        .onOk(() => {
            vueInst.products.splice(index,1);
        });
    }

    public sendCerereForAnOffer(): void {
        const vueInst=this;
        ServiceOffer.sendCerereForAnOffer(vueInst.products,vueInst.nrComandaCerere,vueInst.termenCerere,vueInst.slidAdresaLivrare,'', vueInst.inputFreeTextComments).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
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
            const currentItem = vueInst.products[index];
            currentItem.nr_ord = index-1;
            const newItem = vueInst.products[index-1];
            newItem.nr_ord = index;
            vueInst.products.splice(index, 1,newItem);
            vueInst.products.splice(index-1, 1, currentItem);
        }
    }

    public moveDown(index: number): void {
        const vueInst=this;
        if (index < vueInst.products.length-1) {
            const currentItem = vueInst.products[index];
            currentItem.nr_ord = index+1;
            const newItem = vueInst.products[index+1];
            newItem.nr_ord = index;
            vueInst.products.splice(index, 1,newItem);
            vueInst.products.splice(index+1, 1, currentItem);
        }
    }


    public getDetaliiCerere(): void {
        const vueInst=this;
        vueInst.products=[];
        ServiceCerere.getCerere(vueInst.propOfferId).then(response=>{
            if(response.status=='success'){
                //extend(true, vueInst.offerHeader,  response.offerHeader);
                vueInst.offerHeader=JSON.parse(JSON.stringify(response.offerHeader));
                vueInst.products=JSON.parse(JSON.stringify(response.products));
                vueInst.$q.loading.hide();
                vueInst.nrComandaCerere = vueInst.offerHeader.ComandaClient;
                vueInst.nrComandaCerereInitial = vueInst.nrComandaCerere;
                vueInst.termenCerere = vueInst.offerHeader.termenLivrareSolicitat;
                vueInst.inputFreeTextComments = vueInst.offerHeader.observatii_asm ? vueInst.offerHeader.observatii_asm : '';
                ServiceAdreseLivrare.getAdresaLivrare(vueInst.offerHeader.slidAdresaLivrare).then (response=>{
                    if(response.status=='success') {
                        vueInst.adresa = JSON.parse(JSON.stringify(response.adresa))[0];
                        vueInst.slidAdresaLivrare = vueInst.adresa.slid;
                    }
                })
            }
        })
    }

    public optionsDataViitor (date:string): boolean {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        const todayFmt = yyyy + '/' + mm + '/' + dd;
        return date > todayFmt
    }


    public onEditItem(item:TProductBasket, index:number): void {
        const vueInst=this;
        console.log('edit item=%o',item)
        const prodcut_to_replace = vueInst.products[index];
        
        vueInst.changedItemsInOffer = prodcut_to_replace.qUm1 == item.qUm1 || prodcut_to_replace.qUm2 == item.qUm2 || prodcut_to_replace.qBuc == item.qBuc || 
                                      prodcut_to_replace.cuttingLength == item.cuttingLength || prodcut_to_replace.cuttingWidth == item.cuttingWidth;
                                      
        vueInst.products.splice(index,1, {...item, isInFavorite:vueInst.storeFavorites.favorites.some(favorite=>{return favorite.productCode==item.productCode})});
        console.log('Now, products=%o',vueInst.products)
    }

    private browseArticle(){
        const vueInst=this;
        vueInst.showBrowseArticles=true;
    }

    public repetaCerere(): void {
        const vueInst = this;
        if(!vueInst.changedItemsInOffer) {
            // vueInst.nrComandaCerere = '';
            // vueInst.termenCerere = '';
            // vueInst.slidAdresaLivrare = '';
            // vueInst.inputFreeTextComments = '';
            vueInst.changedItemsInOffer = true;
        }
    }

    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        if(vueInst.EventBusStore.event.name=='eventBrowseCategories'){
            if(vueInst.EventBusStore.event.params && vueInst.EventBusStore.event.params.pid){
                vueInst.pidForBrowseCategory= vueInst.EventBusStore.event.params.pid;
            }
        }

        if(vueInst.EventBusStore.event.name=='eventBrowseArticles'){
            if(vueInst.EventBusStore.event.params && vueInst.EventBusStore.event.params.pidCategory){
                vueInst.pidForBrowseCategoryHasArticles=true;
                vueInst.pidForBrowseCategory= vueInst.EventBusStore.event.params.pidCategory;
            }
        }

        if(vueInst.EventBusStore.event.name=='eventPutArticleInCerere'){
            if(vueInst.EventBusStore.event.params && vueInst.EventBusStore.event.params.artPentruCerere){
                console.log('vueInst.EventBusStore?.event?.params?.artPentruCerere=%o',)
                const artPentruCerere = JSON.parse(vueInst.EventBusStore.event.params.artPentruCerere);
                vueInst.products.push(artPentruCerere);
                vueInst.showBrowseArticles=false;
                vueInst.pidForBrowseCategory='0';
                vueInst.pidForBrowseCategoryHasArticles=false;
            }
        }

        if(vueInst.EventBusStore.event.name=='closeCurrentView'){
            vueInst.onBack();
        }
    }

    public onOpenFormAddNewAdresa(): void {
        //this.selectedUser=puser
        this.selectedAdresa={
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
        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
        this.dialogAdresa=true;
    }

    public closeFormEditAdresaLivrare(needRefresh:boolean): void {
        const vueInst=this;
        vueInst.dialogAdresa=false;
        if(needRefresh){
            vueInst.getAdreseLivrare();
        }
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
        });
    }
    
    public setSelectedAdresa(slid: string): void {
        const vueInst = this;
        vueInst.adrese.forEach(adresa => {
            if(adresa.slid == slid) {
                vueInst.selectedAdresa = adresa;
            }
        });
        console.log(vueInst.selectedAdresa);
    }

    public getFirstCategory(categories: string): string {
            return getFirstCategory(categories);
    }

    public activated(): void {
        const vueInst=this;
        vueInst.userStore.set_page_transition('fade-in-right');
        if(vueInst.$q.platform.is.mobile) {
            vueInst.userStore.set_showbackbar(true);
            vueInst.userStore.set_title_back_bar(vueInst.pageTitle);
        }
        vueInst.showBrowseArticles=false;
        vueInst.pidForBrowseCategory='0';
        vueInst.pidForBrowseCategoryHasArticles=false;
        vueInst.changedItemsInOffer=false;
        vueInst.products=[];
        if(vueInst.propOfferId){
            vueInst.$q.loading.show();
            vueInst.getDetaliiCerere();
            vueInst.getAdreseLivrare();
        }
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
