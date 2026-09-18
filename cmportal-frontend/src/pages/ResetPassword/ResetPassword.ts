import { Vue, Options } from 'vue-class-component'
import {ServiceUser} from '@/services/ServiceUser';
import {setQuasarLang} from '@/modules/quasarLang';
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from "vuex-module-decorators";
import { Notify } from 'quasar';
import { TLanguage } from '@/types/TLanguage';
import eventbus from '@/store/eventbus';


@Options({
    name: "ResetPassword",
    components: {}
})
export default class ResetPassword extends Vue {
    public password='';
    public confirmPassword='';
    public user='';
    public isPwd = true;
    public ajaxIsLoading = false;
    public isUserAvailable=false;
    declare public $refs: any;
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);
    public type='1';
    public token='';
    public slid='';
    public languages: Array<TLanguage>=[{id: 'ro', name: 'romana'}, {id: 'en', name: 'english'},{id: 'bg', name: 'bulgarian'}];
    public selectedLang = 'ro';
    public storeEventsBus = getModule(eventbus);

    public focusOnPassword(): void {
        this.$refs.refPassword.focus();
    }
    public focusOnBtnLogin(): void {
        this.$refs.refBtnLogin.focus();
    }

    public onSubmitLoginData(): void {
        const vueInst=this;

        if(this.password != this.confirmPassword) {
            Notify.create({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                message: this.$t("message.password_mismatch") as string,
                position: 'top',
                timeout: 3500,
            })
        } else {
            this.ajaxIsLoading=true;
            ServiceUser.changePassword(vueInst.user, vueInst.password).then(response=>{
                if(response.status=='success'){
                    localStorage.setItem('isAuthenticatedUser', 'n');
                    localStorage.setItem('userToken', 'x');
                    localStorage.setItem('userId', 'x');
                    vueInst.userStore.set_user_is_authenticated(false);
                    vueInst.$router.push({name: 'Login'});
                } else {
                    Notify.create({
                        color: 'red',
                        textColor: 'white',
                        type: 'negative',
                        message: response.message,
                        position: 'top',
                        timeout: 3500,
                    })
                }
                vueInst.ajaxIsLoading=false;
            });
        }
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

    public mounted(): void {
        this.type = localStorage.getItem('type') as string;
        this.token = localStorage.getItem('token') as string;
        this.slid = localStorage.getItem('slid') as string;

        // console.log('mounted reset password');
        // console.log(this.type);
        // console.log(this.token);
        // console.log(this.slid);

        ServiceUser.checkToken(this.slid, this.token).then( response => {
            console.log('ServiceUser.checkToken response=%o',response)
            if(response.status == 'success') { //token  valid
                this.isUserAvailable = true;
                this.userStore.set_user(response.user);
                this.user = response.user.userid;
            } else {
                this.isUserAvailable = false;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
