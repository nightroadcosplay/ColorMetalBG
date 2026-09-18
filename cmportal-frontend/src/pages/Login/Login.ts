import { Vue, Options } from 'vue-class-component'
import {CONFIG_ENV} from '@/config';
import {ServiceUser} from '@/services/ServiceUser';
import {setQuasarLang} from '@/modules/quasarLang';
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from "vuex-module-decorators";
import {getNomenclatoare} from '@/modules/getNomenclatoare'
import {getFavorites} from "@/modules/getFavorites";
import {getBasket} from "@/modules/getBasket";
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { ref } from 'vue';
import axios from 'axios';
import { ServiceDownload } from '@/services/ServiceDownload';
import VuePdfEmbed from 'vue-pdf-embed';
import { ServiceCompanyUsers } from '@/services/ServiceCompanyUsers';
import { TLanguage } from '@/types/TLanguage';
import eventbus from '@/store/eventbus';

@Options({
    name: "Login",
    components: { VueHcaptcha, VuePdfEmbed },
})
export default class Login extends Vue {
    public password='';
    public confirmPassword='';
    public user='';
    public isPwd = true;
    public ajaxIsLoading = false;
    declare public $refs: any;
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);
    public terms = false;
    public gdpr = false;
    public sitekey = process.env.VUE_APP_CAPTCHAKEY; 
    public downloadingFile = false;
    public pdfTitle='';
    public fixed=false;
    public clicked=false;
    public pdf='';
    public myLocale=CONFIG_ENV.myLocale;
    public isLoadingDocument=false;
    public widthPdf=300;
    public languages: Array<TLanguage>=[{id: 'ro', name: 'romana'}, {id: 'en', name: 'english'},{id: 'bg', name: 'bulgarian'}];
    public selectedLang = 'ro';
    public storeEventsBus = getModule(eventbus);

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

    public focusOnPassword(): void {
        const refPassword = this.$refs.refPassword as any;
        if (refPassword && typeof refPassword.focus === 'function') {
            refPassword.focus();
            return;
        }
        if (refPassword && refPassword.$el && typeof refPassword.$el.focus === 'function') {
            refPassword.$el.focus();
        }
    }
    public focusOnBtnLogin(): void {
        const refBtnLogin = this.$refs.refBtnLogin as any;
        if (refBtnLogin && typeof refBtnLogin.focus === 'function') {
            refBtnLogin.focus();
            return;
        }
        if (refBtnLogin && refBtnLogin.$el && typeof refBtnLogin.$el.focus === 'function') {
            refBtnLogin.$el.focus();
        }
    }

    public onSubmit(): void {
        const vueInst=this;
        // if(!vueInst.verified) {
        //     this.$q.notify({
        //         color: 'red',
        //         textColor: 'white',
        //         type: 'negative',
        //         icon: 'error',
        //         position: 'top',
        //         timeout: 1000,
        //         message: 'Captcha fara success, incercati din nou!'
        //     });
        // } else {
            vueInst.onSubmitLoginData();
        // }
    }
    
    public onSubmitLoginData(): void {
        const vueInst=this;
        this.ajaxIsLoading=true;
        ServiceUser.loginUser(vueInst.user, vueInst.password).then(response=>{
            if(response.status=='success'){
                localStorage.setItem('isAuthenticatedUser', 'y');
                localStorage.setItem('userToken', response.user.userToken);
                localStorage.setItem('userId', response.user.userid);
                localStorage.setItem('userAppid', response.user.appid);
                vueInst.userStore.set_user(response.user);
                vueInst.userStore.set_user_is_authenticated(true);
                vueInst.storeNomenclatoare.set_loading_nomenclatoare(true);
                vueInst.gdpr = false;
                vueInst.terms = false;
                getNomenclatoare();
                getFavorites();
                getBasket();
                vueInst.getUserCompanies(response.user.userid);
                ServiceUser.getProfileImgAsString(vueInst.userStore.user.appid).then((response:any)=>{
                    localStorage.setItem('MyImgProfileString64', response.data);
                    vueInst.userStore.set_myimgprofilestring64(response.data);
                });
                vueInst.storeNomenclatoare.getNomenclatoare().then(response=>{
                    if(response=='success'){
                        vueInst.storeNomenclatoare.set_loading_nomenclatoare(false);
                        vueInst.$router.push({name: 'Dashboard'});
                    }
                });
            }
            vueInst.ajaxIsLoading=false;
        });
    }

    public verified = false;
    public expired = false;
    public token = "";
    public eKey = "";
    public error = "";
    public asyncExecuteHCaptcha = ref<VueHcaptcha|null>(null);
    
    public onVerify(tokenStr: string, ekey: string): void {
        this.verified = true;
        this.token = tokenStr;
        this.eKey = ekey;
    }
    public onExpire(): void {
        console.log('Expired');
        this.verified = false;
        this.token = '';
        this.eKey = '';
        this.expired = true;
    }
    public onChallengeExpire(): void {
        console.log('Challenge expired');
        this.verified = false;
        this.token = '';
        this.eKey = '';
        this.expired = true;
    }
    public onError(err: string): void {
        console.log(`Error: ${err}`);
        this.token = '';
        this.eKey = '';
        this.error = err;
    }
    async onAsyncExecute(): Promise<void> {
        if (this.asyncExecuteHCaptcha.value) {
            const res = await this.asyncExecuteHCaptcha.value.executeAsync();
            console.log("Async execute response", res);
        }
    }

    async verifyHCaptchaResponse(responseToken: string, secretKey: string): Promise<boolean> {
        const url = 'https://hcaptcha.com/siteverify';
        const options = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
        const params = new URLSearchParams();
        params.set('secret', secretKey);
        params.set('response', responseToken);
        try {
          const response = await axios.post(url, params, options);
          console.log(response);
          if(response.data.success == false) {
            this.$q.notify({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                icon: 'error',
                position: 'top',
                timeout: 1000,
                message: (this.$t('message.captcha_failed') as string)
            });
          } else {
            this.onSubmitLoginData();
          }
          return response.data.success;
        } catch (err) {
            this.$q.notify({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                icon: 'error',
                position: 'top',
                timeout: 1000,
                message: (this.$t('message.captcha_failed') as string)
            });
            console.error('Error verifying hCaptcha response:', err);
            return false;
        }
    }

    public downloadPDF(): void {
        const vueInst = this;
        const linkSource = vueInst.pdf;
        const downloadLink = document.createElement("a");
        const fileName = vueInst.pdfTitle + '.pdf';
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    public generarePdfGDPR(type: string): void {
        const vueInst = this;
        vueInst.pdf = '';
        if(type == 'gdpr') {
            vueInst.pdfTitle = vueInst.$t('message.gdpr');
        } else {
            vueInst.pdfTitle = vueInst.$t('message.terms');
        }
        vueInst.isLoadingDocument= true;  
        vueInst.fixed = true;  
        ServiceDownload.generarePDFPrivacy(type).then(response => {
            vueInst.isLoadingDocument = false;
            if(response.status == 'success') {
                const pathPdf = response.message;
                vueInst.pdf = 'data:application/pdf;base64,'+ pathPdf;
            }
        });
        
    }

    public getUserCompanies(userid: string): void {
        const vueInst = this;
        ServiceCompanyUsers.getUsersCompanies(userid).then(response=>{
            if(response.status == 'success') {
                console.log(response.companies);
                vueInst.userStore.set_user_companies(response.companies);
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
}
