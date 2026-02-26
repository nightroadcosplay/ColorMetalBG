import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {ServiceAdreseLivrare} from '@/services/ServiceAdreseLivrare';
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TAdresaLivrare} from "@/types/TAdresaLivrare";
import {TOfferHeader} from "@/types/TOfferHeader";
import {TArticleOfferedFromSales} from "@/types/TArticleOfferedFromSales";
import {minutesAfterNow, parsePostgresArray, timeUntilFutureDate, getFirstCategory} from '@/modules/utils'
import nomenclatoare from "@/store/nomenclatoare";
import {ServiceOffer} from '@/services/ServiceOffer';
import {CONFIG_ENV} from "@/config";
import eventbus from "@/store/eventbus";
import {TProductBasket} from "@/types/TProductBasket";
import {TEnumPlacaBara} from "@/types/TEnumPlacaBara";
import EditQuantityArticleCerere from '@/components/EditQuantityArticleCerere/EditQuantityArticleCerere.vue';
import BrowseCategories from '@/pages/BrowseCategories/BrowseCategories.vue';
import BrowseArticles from '@/pages/BrowseArticles/BrowseArticles.vue';
import favorites from "@/store/favorites";
import { ServiceDownload } from '@/services/ServiceDownload';
import VuePdfEmbed from 'vue-pdf-embed';
import { TOptionCategory } from '@/types/TOptionCategory';

type TProductBasketMarkedFavorites = TProductBasket & {isInFavorite:boolean};

@Options({
    name: "Oferta",
    components: {BrowseCategories, BrowseArticles, EditQuantityArticleCerere, VuePdfEmbed}
})
export default class Oferta extends Vue {
    @Prop({ default: null }) public readonly propOfferId!: string;
    @Prop() public closeHandler!: (needRefresh: boolean)=>void;
    public offerHeader:TOfferHeader={
        offerId: '',
        offerSlid: '',
        status: '',
        trackCreationDate: '',
        trackDateOfertare: '',
        dateWhenOfferExpire: '',
        trackDateAccept: '',
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
    public productsFromSales:TArticleOfferedFromSales[]=[];
    declare public $refs: any;
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);
    public urlToJPG = CONFIG_ENV.URL_CATEGORY.getJPG;
    public slidAdresaLivrare='';
    public termenCerere='';
    public nrComandaCerere='';
    public nrComandaCerereInitial='';
    public inputFreeTextComments='';
    public showBrowseArticles = false;
    public isEditingAsNewRequest=false;
    public pidForBrowseCategoryHasArticles = false;
    public pidForBrowseCategory = '0';
    public adrese:TAdresaLivrare[]=[];
    public EventBusStore = getModule(eventbus);
    public storeFavorites = getModule(favorites);
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
    public changedItemsInOffer = false;
    public downloadingFile = false;
    public pdfTitle='';
    public fixed=false;
    public pdf='';
    public myLocale=CONFIG_ENV.myLocale;
    public isLoadingOffer=false;
    public widthPdf=300;
    public clicked=false;
    public valFaraTVA = 0;
    public discLinii = 0;
    public discOferta = 0;
    public totalFaraTVA = 0;
    public valTVA = 0;
    public totalVal = 0;

    private timeUntilFutureDate(pStringDate: string, pformat:string){
        return timeUntilFutureDate(pStringDate,pformat)
    }

    public changeWitdhPdf(op: string): void {
        if(op == 'in') {
            if(this.widthPdf > 1500) {return;}
            this.widthPdf *= 1.25; 
        } else {
            if(this.widthPdf < 300) {return;}
            this.widthPdf /= 1.25; 
        }
        this.clicked=true;
        setTimeout(function(){
            this.clicked = false;
        }.bind(this),1000);
    }

    public trySendCerereForAnOffer(): void {
        const vueInst=this;
        if(vueInst.productsFromSales.length==0){
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

    public sendCerereForAnOffer(): void {
        const vueInst=this;
        // const products :  TProductBasket[]=vueInst.productsFromSales.map(item=>{
        //     return{
        //             appid:item.appid,
        //             productPid:item.productPid,
        //             categoryPid: item.categoryPid,
        //             productCode:item.productCode,
        //             productName: item.productName,
        //             categoryName: item.categoryName,
        //             qBuc: item.nrBuc??0,
        //             q_um_base: item.q1,
        //             qUm1 :item.q1,
        //             qUm2: item.q2,
        //             um1: item.um1,
        //             um2: item.um2,
        //             um1_to_um2: item.um1_to_um2,
        //             l: item.l??0,
        //             w: item.w??0,
        //             t: item.t??0,
        //             d: item.d??0,
        //             h: item.h??0,
        //             a: item.a??null,
        //             k: item.k??null,
        //             g: item.g??0,
        //             dorescDebitare:(item.cuDebitare=='y'?true:false),
        //             cuttingLength: item.sizeLengthFromSales??0,
        //             cuttingWidth: item.sizeWidthFromSales??0,
        //             enumPlacaBara:TEnumPlacaBara.others,
        //             densitate:null,
        //             observatii: item.observatii,
        //             nr_ord: item.nr_ord
        //     }
        // });
        ServiceOffer.sendCerereForAnOffer2(vueInst.productsFromSales,vueInst.nrComandaCerere,vueInst.termenCerere,vueInst.slidAdresaLivrare, vueInst.offerHeader.offerSlid,vueInst.inputFreeTextComments).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                vueInst.EventBusStore.set_event({name:'eventCloseDialogViewOffer',params:{offerId:response.offerId}});
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
    public repetaCerere(): void {
        const vueInst = this;
        if(!vueInst.changedItemsInOffer) {
            vueInst.changedItemsInOffer = true;
        }
    }
    public chainCategories(categoryPid:string):TOptionCategory[]{
        const vueInst = this;
        let result: TOptionCategory[]=[];
        const categoryPids = parsePostgresArray(categoryPid);
        const lantHierarchyCategory=vueInst.storeNomenclatoare.optionsCategories.filter(category=>{
            // console.log(categoryPids.includes(category.pid));
            return categoryPids.includes(category.pid.toString());
        });
        if(lantHierarchyCategory){
            result=lantHierarchyCategory;
        }
        return result;
    }
    
    public optionsDataViitor (date:string): boolean {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        const todayFmt = yyyy + '/' + mm + '/' + dd;
        return date > todayFmt
    }


    private removeArticle(index:number){
        const vueInst=this;
        vueInst.$q.dialog({
            title: vueInst.$t('message.delete_item') + ' - ' +  vueInst.productsFromSales[index].productName,
            message: vueInst.$t('message.delete_item_question'),
            cancel: {label: vueInst.$t('message.close').toString() },
        })
        .onOk(() => {
            vueInst.productsFromSales.splice(index,1);
            if(!vueInst.changedItemsInOffer) {
                vueInst.changedItemsInOffer = true;
            }
        });
        
    }

    public getDetaliiOferta(): void {
        const vueInst=this;
        vueInst.productsFromSales=[];
        ServiceOffer.getOffer(vueInst.propOfferId).then(response=>{
            if(response.status=='success'){
                //extend(true, vueInst.offerHeader,  response.offerHeader);
                vueInst.offerHeader=JSON.parse(JSON.stringify(response.offerHeader));
                vueInst.productsFromSales=JSON.parse(JSON.stringify(response.productsFromSales));
                vueInst.productsFromSales.map(function(product) {
                    product.itemChanged = false;
                    return product;
                });
                vueInst.$q.loading.hide();
                vueInst.nrComandaCerere = response.offerHeader.ComandaClient;
                vueInst.nrComandaCerereInitial = vueInst.nrComandaCerere;
                vueInst.termenCerere = vueInst.offerHeader.termenLivrareSolicitat;
                vueInst.inputFreeTextComments = vueInst.offerHeader.observatii_asm ? vueInst.offerHeader.observatii_asm : '';


                vueInst.totalFaraTVA = Number(vueInst.offerHeader.idValuta == 'RON' ? Number(vueInst.offerHeader.valFinalaFaraTvaRON).toFixed(2) : vueInst.offerHeader.idValuta == 'EUR' ? Number(vueInst.offerHeader.valFinalaFaraTvaEUR).toFixed(2) : Number(vueInst.offerHeader.valFinalaCuTvaHUF).toFixed(2));
                vueInst.discLinii = Number(vueInst.offerHeader.idValuta == 'RON' ? Number(vueInst.offerHeader.val_discount_linii_ron).toFixed(2) : vueInst.offerHeader.idValuta == 'EUR' ? Number(vueInst.offerHeader.val_discount_linii_eur).toFixed(2): Number(vueInst.offerHeader.val_discount_linii_huf).toFixed(2));
                vueInst.discOferta = Number(vueInst.offerHeader.idValuta == 'RON' ? Number(vueInst.offerHeader.val_discount_oferta_ron).toFixed(2) : vueInst.offerHeader.idValuta == 'EUR' ? Number(vueInst.offerHeader.val_discount_oferta_eur).toFixed(2) : Number(vueInst.offerHeader.val_discount_oferta_huf).toFixed(2));
                vueInst.valFaraTVA = vueInst.totalFaraTVA + vueInst.discLinii + vueInst.discOferta;
                vueInst.valTVA = vueInst.totalFaraTVA * 0.21;
                vueInst.totalVal = vueInst.totalFaraTVA + vueInst.valTVA;
            

                ServiceAdreseLivrare.getAdresaLivrare(vueInst.offerHeader.slidAdresaLivrare).then (response=>{
                    if(response.status=='success') {
                        vueInst.adresa = JSON.parse(JSON.stringify(response.adresa))[0];
                        vueInst.slidAdresaLivrare = vueInst.adresa.slid;
                    }
                })
            }
        })
    }

    public sendAcceptForOffer(): void {
        const vueInst=this;
        vueInst.$q.dialog({
            title: vueInst.$t('message.offer'),
            message: vueInst.$t('message.confirm_order_launch'),
            cancel: true,
            persistent: true
        }).onOk(() => {
            ServiceOffer.acceptOffer(vueInst.propOfferId, vueInst.nrComandaCerere, vueInst.slidAdresaLivrare, vueInst.inputFreeTextComments).then(response=>{
                if(response.status=='success'){
                    vueInst.$q.notify({
                        color: 'teal',
                        textColor: 'white',
                        icon: 'positive',
                        position: 'top',
                        timeout: 500,
                        message: response.message
                    })
                    vueInst.closeHandler(true);
                }
            })
            .catch(err => {
                vueInst.$q.notify({
                    color: 'red',
                    textColor: 'white',
                    icon: 'negative',
                    position: 'top',
                    timeout: 500,
                    message: err
                })
            });
        })
    }


    public ItemForEdit(item: TArticleOfferedFromSales): TProductBasket{
        return {
            appid:item.appid,
            productPid:item.productPid,
            categoryPid: item.categoryPid,
            productCode:item.productCode,
            productNameRO: item.productNameRO,
            productNameEN: item.productNameEN,
            productNameBG: item.productNameBG,
            categoryName: item.categoryName,
            qBuc: (item.nrBuc?item.nrBuc:1),
            q_um_base: item.q1,
            qUm1 :item.q1,
            qUm2: item.q2,
            um1: item.um1,
            um2: item.um2,
            um1_to_um2: item.um1_to_um2,
            l: item.l,
            w:item.w,
            t:item.t,
            d:item.d,
            h:item.h,
            a:item.a,
            k:item.k,
            g:item.g,
            dorescDebitare:(item.cuDebitare==='y'?true:false),
            cuttingLength:item.sizeLengthFromSales,
            cuttingWidth:item.sizeWidthFromSales,
            densitate: 1,
            enumPlacaBara:TEnumPlacaBara.others,
            observatii:'',
            nr_ord: item.nr_ord,
            tip_um:item.tip_um
        }
}

    public onEditItem(item:TProductBasket, index:number): void {
        const vueInst=this;
        // console.log('edit item=%o',item)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        
        const prodcut_to_replace = vueInst.productsFromSales[index];
        // const changed = vueInst.changedItemsInOffer;
        
        // vueInst.changedItemsInOffer = prodcut_to_replace.q1 == item.qUm1 || prodcut_to_replace.q2 == item.qUm2 || prodcut_to_replace.nrBuc == item.qBuc || 
        //                               prodcut_to_replace.sizeLengthFromSales == item.cuttingLength || prodcut_to_replace.sizeWidthFromSales == item.cuttingWidth;

        // if(vueInst.changedItemsInOffer == true && changed == false) {
        //     vueInst.nrComandaCerere = '';
        //     vueInst.termenCerere = '';
        // }

        if(!vueInst.changedItemsInOffer) {
            vueInst.changedItemsInOffer = true;
        }
        
        prodcut_to_replace.q1 = item.qUm1;
        prodcut_to_replace.q2 = item.qUm2;
        prodcut_to_replace.cuDebitare = item.dorescDebitare ? 'y' : 'n';
        prodcut_to_replace.nrBuc = item.qBuc;
        prodcut_to_replace.sizeLengthFromSales = item.cuttingLength;
        prodcut_to_replace.sizeWidthFromSales = item.cuttingWidth;
        prodcut_to_replace.itemChanged = true;
        
        prodcut_to_replace.tvaProc = null;
        prodcut_to_replace.cuCheltuieliTransport = null;
        prodcut_to_replace.curseur = null;
        prodcut_to_replace.idDepozit = null;
        prodcut_to_replace.termenLivrare = '';
        prodcut_to_replace.pretMediuCalculatUM1RON = null;
        prodcut_to_replace.pretMediuCalculatUM1EUR = null;
        prodcut_to_replace.pretMediuCalculatUM2RON = null;
        prodcut_to_replace.pretMediuCalculatUM2EUR = null;
        prodcut_to_replace.pretMediuCalculatUM1HUF = null;
        prodcut_to_replace.pretMediuCalculatUM2HUF = null;
        prodcut_to_replace.valFinalaFaraTvaRON = null;
        prodcut_to_replace.valTvaRON = null;
        prodcut_to_replace.valFinalaCuTvaRON = null;
        prodcut_to_replace.valFinalaFaraTvaEUR = null;
        prodcut_to_replace.valTvaEUR = null;
        prodcut_to_replace.valFinalaCuTvaEUR = null;
        prodcut_to_replace.valFinalaFaraTvaHUF = null;
        prodcut_to_replace.valTvaHUF = null;
        prodcut_to_replace.valFinalaCuTvaHUF = null;
        prodcut_to_replace.costLivrareRON = null;
        prodcut_to_replace.costLivrareEUR = null;
        prodcut_to_replace.costlivrareHUF = null;
        prodcut_to_replace.val_baza_ron = 0;
        prodcut_to_replace.val_baza_eur = 0;
        prodcut_to_replace.val_baza_huf = 0;
        prodcut_to_replace.discount_proc = 0;
        prodcut_to_replace.tip_um=item.tip_um;
        prodcut_to_replace.observatii=item.observatii;

        vueInst.productsFromSales.splice(index,1, prodcut_to_replace);
    }

    private browseArticle(){
        const vueInst=this;
        vueInst.showBrowseArticles=true;
    }

    public get oraAcceptOffer():string{
        const vueInst=this;
        if(vueInst.offerHeader.trackDateAccept.length>0){
            return vueInst.offerHeader.trackDateAccept.substr(11);
        }else{
            return '';
        }
    }

    public get isOfferExpired():boolean{
        const vueInst=this;
        const minutes=minutesAfterNow(vueInst.offerHeader.dateWhenOfferExpire,'YYYY-MM-DD HH:mm')
        if(minutes>60){
            return true;
        }else{
            return false;
        }
    }

    public get minutesAfterNowExp():number{
        const vueInst=this;
        const minutes=minutesAfterNow(vueInst.offerHeader.dateWhenOfferExpire,'YYYY-MM-DD HH:mm')
        return minutes;
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
                const artSelectatDeUtilizator = JSON.parse(vueInst.EventBusStore.event.params.artPentruCerere) as TProductBasketMarkedFavorites;
                const artPentruCerere= {
                    appid: '0',
                    offerId: vueInst.offerHeader.offerId,
                    offerSlid: vueInst.offerHeader.offerSlid,
                    productPid: artSelectatDeUtilizator.productPid,
                    productCode: artSelectatDeUtilizator.productCode,
                    categoryPid: artSelectatDeUtilizator.categoryPid,
                    categoryName: '',
                    productName: artSelectatDeUtilizator.productNameRO,
                    productNameRO: artSelectatDeUtilizator.productNameRO,
                    productNameEN: artSelectatDeUtilizator.productNameEN,
                    productNameBG: artSelectatDeUtilizator.productNameBG,
                    status: 'p',
                    q1: artSelectatDeUtilizator.qUm1,
                    um1: artSelectatDeUtilizator.um1,
                    q2: artSelectatDeUtilizator.qUm2,
                    um2: artSelectatDeUtilizator.um2,
                    um1_to_um2: artSelectatDeUtilizator.um1_to_um2,
                    tip_um: artSelectatDeUtilizator.tip_um,
                    nrBuc: artSelectatDeUtilizator.qBuc,
                    qKg: (artSelectatDeUtilizator.um1==='KG'?artSelectatDeUtilizator.qUm1:(artSelectatDeUtilizator.um2==='KG'?artSelectatDeUtilizator.qUm2:null)),
                    tvaProc: null,
                    cuCheltuieliTransport: null,
                    curseur: null,
                    l: artSelectatDeUtilizator.l,
                    w: artSelectatDeUtilizator.w,
                    t: artSelectatDeUtilizator.t,
                    d: artSelectatDeUtilizator.d,
                    h: artSelectatDeUtilizator.h,
                    a: artSelectatDeUtilizator.a,
                    k: artSelectatDeUtilizator.k,
                    g: artSelectatDeUtilizator.g,
                    idDepozit: null,
                    termenLivrare: vueInst.termenCerere,
                    pretMediuCalculatUM1RON: null,
                    pretMediuCalculatUM1EUR: null,
                    pretMediuCalculatUM2RON: null,
                    pretMediuCalculatUM2EUR: null,
                    pretMediuCalculatUM1HUF: null,
                    pretMediuCalculatUM2HUF: null,
                    valFinalaFaraTvaRON: null,
                    valTvaRON: null,
                    valFinalaCuTvaRON: null,
                    valFinalaFaraTvaEUR: null,
                    valTvaEUR: null,
                    valFinalaCuTvaEUR: null,
                    valFinalaFaraTvaHUF: null,
                    valTvaHUF: null,
                    valFinalaCuTvaHUF: null,
                    costLivrareRON: null,
                    costLivrareEUR: null,
                    costlivrareHUF: null,
                    observatii: artSelectatDeUtilizator.observatii,
                    cuDebitare: (artSelectatDeUtilizator.dorescDebitare?'y':'n'),
                    sizeLengthFromSales: artSelectatDeUtilizator.cuttingLength,
                    sizeWidthFromSales: artSelectatDeUtilizator.cuttingWidth,
                    discount_proc:0,
                    nr_ord:artSelectatDeUtilizator.nr_ord,
                    itemChanged:true,
                    val_baza_ron:0,
                    val_baza_eur:0,
                    val_baza_huf:0
                }
                vueInst.productsFromSales.push(artPentruCerere);
                vueInst.showBrowseArticles=false;
                vueInst.pidForBrowseCategory='0';
                vueInst.pidForBrowseCategoryHasArticles=false;
                vueInst.changedItemsInOffer = true;
            }
        }

        if(vueInst.EventBusStore.event.name=='closeCurrentView'){
            if(vueInst.showBrowseArticles){
                vueInst.showBrowseArticles=false;
                vueInst.pidForBrowseCategory='0';
                vueInst.pidForBrowseCategoryHasArticles=false;
            }else{
                vueInst.EventBusStore.set_event({name:'eventCloseDialogViewOffer',params:null});
            }
        }
    }

    public downloadPDF(): void {
        const vueInst = this;
        const linkSource = vueInst.pdf;
        const downloadLink = document.createElement("a");
        const fileName = vueInst.pdfTitle;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    public generareOfertaPDFRO(): void {
        const vueInst = this;
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.isLoadingOffer= true;  
        vueInst.fixed = true;  
        ServiceDownload.generareOfertaPdfLink('offer', vueInst.offerHeader.offerSlid, 'bg').then(response => {
            vueInst.isLoadingOffer = false;
            if(response.status == 'success') {
                const pathPdf = response.message;
                    vueInst.pdfTitle = 'Oferta_'+vueInst.offerHeader.offerSlid+'_'+this.userStore.user.companyName+'.pdf'
                    vueInst.pdf = 'data:application/pdf;base64,'+ pathPdf +'#title='+ vueInst.pdfTitle;
            }
        });
        
    }

    public generareOfertaPDFENG(): void {
        const vueInst = this;
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.isLoadingOffer= true;   
        vueInst.fixed = true;
        ServiceDownload.generareOfertaPdfLink('offer', vueInst.offerHeader.offerSlid, 'eng').then(response => {
            vueInst.isLoadingOffer = false;
            if(response.status == 'success') {
                const pathPdf = response.message;
                    vueInst.pdfTitle = 'Offer_'+vueInst.offerHeader.offerSlid+'_'+this.userStore.user.companyName+'.pdf'
                    vueInst.pdf = 'data:application/pdf;base64,'+ pathPdf +'#title='+ vueInst.pdfTitle;
            }
        });
        
    }

    public moveUP(index: number): void {
        const vueInst=this;
        if (index > 0) {
            const currentItem = vueInst.productsFromSales[index];
            currentItem.nr_ord = index-1;
            const newItem = vueInst.productsFromSales[index-1];
            newItem.nr_ord = index;
            vueInst.productsFromSales.splice(index, 1,newItem);
            vueInst.productsFromSales.splice(index-1, 1, currentItem);
        }
    }

    public moveDown(index: number): void {
        const vueInst=this;
        if (index < vueInst.productsFromSales.length-1) {
            const currentItem = vueInst.productsFromSales[index];
            currentItem.nr_ord = index+1;
            const newItem = vueInst.productsFromSales[index+1];
            newItem.nr_ord = index;
            vueInst.productsFromSales.splice(index, 1,newItem);
            vueInst.productsFromSales.splice(index+1, 1, currentItem);
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

    public getFirstCategory(categories: string): string {
        return getFirstCategory(categories);
    }

    public created(): void {
        const vueInst=this;
        if(this.propOfferId){
            vueInst.$q.loading.show();
            //extend(true, this.adresa,  this.propAdresa);
            vueInst.getDetaliiOferta();
            ServiceAdreseLivrare.getAdreseLivrare().then(response=>{
                if(response.status=='success'){
                    vueInst.adrese=JSON.parse(JSON.stringify(response.adrese));
                    if(vueInst.adrese.length==1){
                        vueInst.slidAdresaLivrare=vueInst.adrese[0].slid;
                    }
                }
            })
        }
    }
}
