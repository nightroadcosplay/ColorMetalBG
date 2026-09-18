import { Vue, Options } from 'vue-class-component'
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import {URL_WORKERS} from '@/config';
import user from '@/store/user';
import basket from '@/store/basket';
import eventbus from '@/store/eventbus';
import favorites from '@/store/favorites';
import nomenclatoare from '@/store/nomenclatoare';
import mailbox from '@/store/mailbox';
import {TUser} from '@/types/TUser';
import {TMail} from '@/types/TMail';
import MenuApp from './components/MenuApp/MenuApp.vue';
import ContacteleMeleColorMetal from "@/components/ContacteleMeleColorMetal.vue";
import {ServiceUser} from '@/services/ServiceUser';
import {setQuasarLang} from '@/modules/quasarLang';
import {getNomenclatoare} from '@/modules/getNomenclatoare'
import {getFavorites} from '@/modules/getFavorites'
import {getBasket} from '@/modules/getBasket'
import { ionLogoFacebook } from '@quasar/extras/ionicons-v5'
import { ionLogoYoutube } from '@quasar/extras/ionicons-v5'
import { ionLogoLinkedin } from '@quasar/extras/ionicons-v5'
import { TUserCompany } from './types/TUserCompany';
import { ServiceCompanyUsers } from './services/ServiceCompanyUsers';
import { ServiceAlerts } from './services/ServiceAlerts';
import { RouteRecordName } from 'vue-router';
import { TLanguage } from './types/TLanguage';
import { ServiceDownload } from './services/ServiceDownload';
import VuePdfEmbed from 'vue-pdf-embed';
/*
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);
mock.onGet('/loadApp').reply(200, {
    userData:{ username:'Florin Codreanu',
        id:'florin.codreanu@bcr.ro',
        empno:12789}
});
*/

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['X-CSRF-TOKEN'] = '1t6bh0lwh72pv.2k9aurnh5tk44';


@Options({
    name: "App",
    components: {MenuApp,ContacteleMeleColorMetal,VuePdfEmbed}
})
export default class App extends Vue {
    public leftDrawerOpen = false;
    public rightDrawerOpen = false;
    public visibleMobileBarForSearch =false;
    public loadingResultForFastSearch = false;
    public currentPageTitle= '';
    public inputFastSearch = '';
    public nrRanduriTabel = 10;
    public ionLogoFacebook = ionLogoFacebook;
    public ionLogoYoutube = ionLogoYoutube;
    public ionLogoLinkedin = ionLogoLinkedin;
    public visibleInputFastSearch = false;
    public pdfDocumentDialog = false;
    public pdfDocument = '';
    public pdfDocumentTitle = '';
    public isLoadingDocument = false;
    public widthPdf = 300;
    public clickedZoom = false;
    declare public $refs: any;
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);
    public storeBasket = getModule(basket);
    public storeFavorites = getModule(favorites);
    public storeMailbox = getModule(mailbox);
    public storeEventsBus = getModule(eventbus);
    public type='0';
    public token='';
    public languages: Array<TLanguage>=[{id: 'ro', name: 'romana'}, {id: 'en', name: 'english'},{id: 'bg', name: 'bulgarian'}];
    public selectedLang = 'en';
    // public userCompanies: Array<TUserCompany> = [];

    public div_el: HTMLDivElement | undefined;
    public iframe: any;
    get mesajSeLoadingNomenclatoare(): string {
        return this.$t('message.loading_nomenclatoare') as string;
    }


    get nrArticlesInBasket():number{
        return this.storeBasket.basket.length;
    }

    get nrArticlesInFavorites():number{
        return this.storeFavorites.favorites.length;
    }
    
    get userCompanies(): Array<TUserCompany> {
        return this.userStore.userCompanies;
    }

    get showAddBtnBarMenu():boolean{
        let result = false;
        if(this.$route.name=='AdminArticles' || this.$route.name=='AdminCategory' || this.$route.name=='AdminUsers' || this.$route.name=='AdreseLivrare'){
            result=true;
        }
        return result;
    }

    get showSearchBtnBarMenu():boolean{
        let result = false;
        if(this.$route.name=='MyShoppingCart'){
            result=true;
        }
        return result;
    }

    get showBasketBtnBarMenu():boolean{
        return this.$route.name!='MyShoppingCart' && this.$route.name !='AdreseLivrare' && this.$route.name !='AdminArticles' && this.$route.name !='AdminCategory' && this.$route.name !='AdminUsers';
    }

    get user(): TUser {
        return this.userStore.user;
    }

    get isLoadingNomenclatoare(): boolean {
        return this.storeNomenclatoare.isLoadingNomenclatoare;
    }

    get visibleMobileRightBtnForDashboard():boolean{
        return this.userStore.PREVIOUS1_ROUTE_NAME != 'Dashboard' && this.userStore.PREVIOUS2_ROUTE_NAME != 'Dashboard'
            && (this.$route.name=='MyShoppingCart' || this.$route.name=='BrowseArticles');
    }

    get sessionIsValid(): boolean {
        return (this.userStore.userIsAuthenticated && !this.storeNomenclatoare.isLoadingNomenclatoare?true:false);
    }

    public goToDashboardInMobile(): void {
        this.$router.push({name: 'Dashboard'});
        this.userStore.set_showmenubar(false);
        this.userStore.set_showbackbar(false);
    }
    public goToDashboard(): void {
        this.$router.push({name: 'Dashboard'});
    }
    public onGoCautaArticole(): void {
        this.$router.push({name: 'BrowseCategories',  params: { pid: '0' }});
    }

    public onGoToOffers(): void {
        this.$router.push({name: 'Offers'});
    }

    public setNrRanduriTabel(): void {
        localStorage.setItem('nrRanduriTabel', this.nrRanduriTabel.toString());
    }

    public clearInputFastSearch(): void {
        this.inputFastSearch='';
        this.$refs.refOptionsFastSearch.hide();
    }

    public clearListFastSearch(): void {
        if(!this.inputFastSearch){
            console.log('clearListFastSearch')
        }
    }

    public onGoToBrowseCategories(): void {
        this.onHideInputFastSearch();
        this.$router.push({name: 'BrowseCategories',  params: { pid: '0', typeOfAccess: 'fromDashboard' }});
        //this.$router.push({name: 'BrowseCategories' });
    }

    public goToFavorite(): void {
        this.onHideInputFastSearch();
        this.$router.push({name: 'ArticoleFavorite'});
    }

    public onShowInputFastSearch(): void {
        this.visibleInputFastSearch=true;
    }

    public onHideInputFastSearch(): void {
        this.inputFastSearch='';
        this.visibleInputFastSearch=false;
        this.visibleMobileBarForSearch=false;
    }

    public get currentRouteName(): RouteRecordName | undefined | null {
        return this.$route.name;
    }
    get userIsAuthenticated(): boolean {
        return this.userStore.userIsAuthenticated;
    }

    get showMenuBar(): boolean {
        return this.userStore.showMenuBar;
    }

    get showBackBar(): boolean {
        return this.userStore.showBackBar;
    }

    get titleBackBar(): string {
        return this.userStore.titleBackBar;
    }

    get MyImgProfileString64():string{
        return this.userStore.MyImgProfileString64;
    }

    get pageTransition():string{
        return this.userStore.pageTransition;
    }

    public goToMyProfile(): void {
        this.$router.push({ name: 'MyProfile' });
    }

    public goBack(): void {
        //Cerere/Oferta have an inner browse-articles view, so they decide themselves what "back" means
        if(this.$route.name=='Cerere' || this.$route.name=='Oferta'){
            this.storeEventsBus.set_event({name:'closeCurrentView', params:null});
            return;
        }
        this.$router.back();
    }

    public getOptionSArticlesFastSearch(pInputSearch: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vueInst = this;
        if(pInputSearch && pInputSearch.length>1){
            vueInst.$refs.refOptionsFastSearch.show();
        }else{
            vueInst.$refs.refOptionsFastSearch.hide();
        }

        vueInst.loadingResultForFastSearch=false;
    }

    public logout(): void {
        localStorage.setItem('isAuthenticatedUser', 'n');
        localStorage.setItem('userToken', 'x');
        localStorage.setItem('userid', 'x');
        this.userStore.set_user_is_authenticated(false);
        this.$q.notify({
            color: 'purple',
            textColor: 'white',
            position:'top',
            timeout: 1000,
            message: this.$t('message.you_have_been_logout') as string
        });
        this.userStore.set_user({
            appid: '',
            userid: '',
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNr: '',
            isAdmin: 'n',
            functie: '',
            userToken: '',
            companyName: '',
            companyCode: '',
            cif: '',
            lang: 'ro'
        });
        this.$router.push({name: 'Login'});
    }

    public onCloseMenu(): void {
        this.leftDrawerOpen=false;
    }

    public connectUserMailbox(): void {
        const vueInst = this;
        if (typeof (Worker) !== "undefined") {
            // Yes! Web worker support!
            const workerMailbox = new Worker(URL_WORKERS+"/workers/mailbox.js");
            workerMailbox.postMessage({cmd: 'getNewMessages'});
            workerMailbox.onmessage = function (event) {
                switch (event.data.cmd) {
                    case 'resultMyNewMessages':
                        console.log('newMails=%o',event.data.newMails);
                        ServiceAlerts.getCounters().then( responce => {
                            if(responce.status == 'success'){
                                vueInst.userStore.set_screencountadrese(responce.countAdrese);
                                vueInst.userStore.set_screencountoferte(responce.countOferte);
                            }
                        });
                        ServiceUser.checkSession().then(responce => {
                            if(responce.status == 'error' && vueInst.userStore.userIsAuthenticated) {
                                vueInst.logout();
                                // workerMailbox.terminate();
                            }
                        });
                        if(event.data.newMails && event.data.newMails.length > 0){
                            event.data.newMails.forEach((email:TMail) => {
                                vueInst.storeMailbox.push_email(email)
                                if(email.refObject=='NewOfferFromSales'){
                                    vueInst.storeEventsBus.set_event({name:'eventNewOfferFromSales',params:{offerId:email.refAppid}});
                                }

                            })
                        }

                        break;
                }
            };
        }
    }

    public checkToken(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        console.log('checkToken!!!!!!!!!!!!!!!!!!')
        const vueInst = this;
        const userToken=localStorage.getItem('userToken')||'x';
        const userId=localStorage.getItem('userId')||'x';
        this.selectedLang = this.$i18n.locale;
        console.log("check token " + this.selectedLang);
        
        ServiceUser.getCurrentUser(userId,userToken).then(response=>{
            console.log('ServiceUser.getCurrentUser response=%o',response)
            if(response.status=='success') {
                vueInst.connectUserMailbox();
                getFavorites();
                getBasket();
                ServiceAlerts.getCounters().then( responce => {
                    if(responce.status == 'success'){
                        this.userStore.set_screencountadrese(responce.countAdrese);
                        this.userStore.set_screencountoferte(responce.countOferte);
                    }
                });
                vueInst.getUserCompanies(userId);

                // this.$q.fullscreen.request().then(()=>{
                //     vueInst.$q.notify({
                //         color: 'teal',
                //         textColor: 'white',
                //         icon: 'positive',
                //         position: 'top',
                //         timeout: 2000,
                //         message: 'FullScreen cu success!'
                //     })
                // }) .catch(err => { console.log('err on Fullscreen=%o',err)
                //
                //     vueInst.$q.notify({
                //         color: 'red',
                //         textColor: 'white',
                //         icon: 'positive',
                //         position: 'top',
                //         timeout: 2000,
                //         message: 'Eroare la FullScrren!'
                //     })
                // });
                localStorage.setItem('isAuthenticatedUser', 'y');
                this.selectedLang = response.user.lang;
                this.$i18n.locale = response.user.lang;
                setQuasarLang(response.user.lang);
                localStorage.setItem('lang', response.user.lang);
                console.log("check token " + this.selectedLang);
                vueInst.userStore.set_user(response.user);
                vueInst.userStore.set_user_is_authenticated(true);
                vueInst.storeNomenclatoare.set_loading_nomenclatoare(true);
                ServiceUser.getProfileImgAsString(vueInst.userStore.user.appid).then((response:any)=>{
                    localStorage.setItem('MyImgProfileString64', response.data);
                    vueInst.userStore.set_myimgprofilestring64(response.data);
                });
                vueInst.storeNomenclatoare.getNomenclatoare().then(response=>{
                    if(response=='success'){
                        vueInst.storeNomenclatoare.set_loading_nomenclatoare(false);
                        vueInst.$router.push({name: 'Dashboard'});
                        vueInst.userStore.set_showmenubar(true);
                        vueInst.userStore.set_showbackbar(false);
                    }
                });

                
            } else {
                localStorage.setItem('isAuthenticatedUser', 'n');
                localStorage.setItem('userToken', 'x');
                localStorage.setItem('userId', 'x');
                vueInst.userStore.set_user_is_authenticated(false);
            
                vueInst.$router.push({name: 'Login'});
            }
        }).catch(Error=>{
            console.log('Error=%o',Error)
            vueInst.logout();
        });
    }

    public makeMobileBarForSearch(): void {
        this.visibleMobileBarForSearch=true;
    }

    public onClickAddBtnForDialogChild(): void {
        this.storeEventsBus.set_event({name:'eventClickAddBtn',params:{emitter:'app'}});
    }

    public getAppUser(): void {
        const vueInst = this;
        this.selectedLang = this.$i18n.locale;
        console.log("created " + this.selectedLang);
        //vueInst.$q.fullscreen.request();

        if(location.href.includes("reset_password?token")){
            const arr = (new URL(location.href).searchParams.get('token') as string).split('-');
            localStorage.setItem('type', arr[0]);
            localStorage.setItem('slid', arr[1]);
            localStorage.setItem('token', arr[2]);
            vueInst.userStore.set_user_is_authenticated(false);
            vueInst.$router.push({name: 'ResetPassword'});
        } else {
            localStorage.setItem('type', '0');
            localStorage.setItem('slid', '');
            localStorage.setItem('token', '');
            const isAuthenticatedUser=localStorage.getItem('isAuthenticatedUser')||false;
            if(isAuthenticatedUser){
                vueInst.checkToken();
            }else{
                vueInst.$router.push({name: 'Login'});
            }
        }

    }

    public getUserCompanies(userid: string): void {
        const vueInst = this;
        ServiceCompanyUsers.getUsersCompanies(userid).then(response=>{
            if(response.status == 'success') {
                // console.log(response.companies);
                vueInst.userStore.set_user_companies(response.companies);
            }
        });
    }

    public changeCompanyUser(val: string): void {
        const vueInst = this;
        console.log(val);
        ServiceCompanyUsers.changeUserCompany(vueInst.userStore.user.userid, val).then(response=>{
            if(response.status == 'success') {
                console.log(response.companies);
                vueInst.userStore.user.cif = response.companies[0].cif;
                vueInst.userStore.user.companyCode = response.companies[0].company_code;
                vueInst.userStore.user.companyName = response.companies[0].denumire;
                vueInst.getAppUser();
            }
        });
    }

    public changeLanguage(val: string): void {
        const vueInst = this;
        vueInst.selectedLang = val;
        console.log("change lang " + this.selectedLang);
        localStorage.setItem('lang', vueInst.selectedLang);
        this.$i18n.locale = vueInst.selectedLang;
        setQuasarLang(vueInst.selectedLang);
        ServiceUser.changeLang(vueInst.selectedLang);
        vueInst.storeEventsBus.set_event({name:'changeLanguage', params:null});
    }

    public putFocusBackToFastSearch(): void {
        this.$refs.refInputFastSearch.focus();
    }

    public get widthForDrawerDocument(): number{
        let result=0;
        if(this.$q.platform.is.mobile) {result = window.innerWidth;}
        else{
            if(screen.availWidth>1500){ result = 1200;}
            else{
                if(screen.availWidth>1000){ result = 1000;}
                else {
                    if (screen.availWidth > 800) {
                        result = 600;
                    } else {
                        result = window.innerWidth - 100;
                    }
                }
            }
        }
        return result;
    }

    public openCalculatorGreutate(): void {
        window.open("https://color-metal.ro/ro/calculator-de-greutate-roman");
    }

    public openLink(link: string): void {
        window.open(link);
    }

    public changeWitdhPdf(op: string): void {
        if(op == 'in') {
            if(this.widthPdf > 1500) {return;}
            this.widthPdf *= 1.25;
        } else {
            if(this.widthPdf < 300) {return;}
            this.widthPdf /= 1.25;
        }
        this.clickedZoom = true;
        setTimeout(function(){
            this.clickedZoom = false;
        }.bind(this),1000);
    }

    public downloadPDF(): void {
        const vueInst = this;
        const downloadLink = document.createElement("a");
        downloadLink.href = vueInst.pdfDocument;
        downloadLink.download = vueInst.pdfDocumentTitle + '.pdf';
        downloadLink.click();
    }

    public generarePdfDocument(type: string, title: string): void {
        const vueInst = this;
        vueInst.pdfDocument = '';
        vueInst.pdfDocumentTitle = title;
        vueInst.isLoadingDocument = true;
        vueInst.pdfDocumentDialog = true;
        ServiceDownload.generarePDFPrivacy(type).then(response => {
            vueInst.isLoadingDocument = false;
            if(response.status == 'success') {
                vueInst.pdfDocument = 'data:application/pdf;base64,'+ response.message;
            }
        });
    }

    public onGoTOMyShoppingCart(): void {
        this.$router.push({name: 'MyShoppingCart'});
    }

    public closeWindowDocument(): void {
        this.rightDrawerOpen=false;
    }

    public created(): void {
        const vueInst = this;
        vueInst.userStore.set_screenwidth(screen.availWidth);
        vueInst.userStore.set_screenheight(screen.availHeight);
        getNomenclatoare();
        vueInst.getAppUser();
    }

    activated(): void {
        this.selectedLang = this.$i18n.locale;
        console.log("activated " + this.selectedLang);
        // this.changeLanguage(this.selectedLang);
    }

}
