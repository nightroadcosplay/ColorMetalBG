import { Vue, Options } from 'vue-class-component'
import { getModule} from 'vuex-module-decorators';
import axios  from 'axios';

import User from "@/store/user";
import {CONFIG_ENV} from '@/config';
import {LocalStorage} from "quasar";
import  {ServiceUser}  from '@/services/ServiceUser';

interface I_AjaxResponse_SaveMyProfile{
    status:number,
    statusText:string,
    data: {
        status:string,
        email_must_to_cheked:string,
        message:string,
    }
}

interface I_MyProfile {
    firstName:string,
    lastName:string,
    email:string,
    phoneNr: string,
    newPassword:string,
    newPasswordRetyped:string,
    motto:string
}


@Options({
    name: "MyProfile",
    components: {}
})
export default class MyProfile extends Vue {
    public isAjaxLoadingLists =false;
    public myBoolFalse=false;
    public showNecessaryInfoForPasswordChange=false;
    public showDialogForChangeImgProfile=false;
    myProfile:I_MyProfile={
        firstName:'',
        lastName:'',
        email:'',
        phoneNr:'',
        newPassword:'',
        newPasswordRetyped:'',
        motto:''
    }
    userStore=getModule(User);
    getUrlForUploadProfileImage:string=CONFIG_ENV.URL_USER.uploadImageMyProfile+'/'+this.userStore.user.appid;
    getUrlForDownloadProfileImage:string=CONFIG_ENV.URL_USER.getMyImageProfile+'/'+this.userStore.user.appid+'?t=' + Math.random();

    declare public $refs:any;



    async saveMyProfile(myProfile:I_MyProfile):Promise<I_AjaxResponse_SaveMyProfile>{
        const userid=LocalStorage.getItem('userid');
        const res = await <Promise<I_AjaxResponse_SaveMyProfile>> axios.post(`${CONFIG_ENV.URL_USER.saveMyProfile}/${userid}`,myProfile);
        return res;
    }

    reloadProfileImage():void{
        const vueInst=this;
        vueInst.getUrlForDownloadProfileImage=CONFIG_ENV.URL_USER.getMyImageProfile+'/'+vueInst.userStore.user.appid+'?t=' + Math.random();

        ServiceUser.getProfileImgAsString(vueInst.userStore.user.appid).then((response:any)=>{
            localStorage.setItem('MyImgProfileString64', response.data);
            vueInst.userStore.set_myimgprofilestring64(response.data);
        });
    }

    imgForProfileWasUploaded(): void {
        const vueInst=this;
        vueInst.showDialogForChangeImgProfile=false;
        vueInst.reloadProfileImage();
        vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            position:'bottom-right',
            timeout: 1500,
            message: vueInst.$t('message.imaginea_de_profil_a_fost_schimbata_cu_succes')
        });
    }

    blurInputNewPassword(): void {
        const vueInst=this;
        if (vueInst.myProfile.newPassword.length == 0) {
            vueInst.showNecessaryInfoForPasswordChange = false;
        }
    }

    checkPasswordIfRetypedEqual(): boolean|string |undefined{
        const vueInst=this;
        let error_message='';
        if (vueInst.myProfile.newPassword.length > 0) {
            if(vueInst.myProfile.newPasswordRetyped.length==0){
                error_message=vueInst.$t('message.reintroduceti_parola');
            }
            else{
                if(vueInst.myProfile.newPassword!=vueInst.myProfile.newPasswordRetyped){
                    error_message=vueInst.$t('message.parolele_nu_coincid');
                }
                if(vueInst.myProfile.newPassword==vueInst.myProfile.newPasswordRetyped && (vueInst.myProfile.newPassword.length <4 || vueInst.myProfile.newPassword.length>20)){
                    error_message=vueInst.$t('message.parola_trebuie_sa_aiba_intre_4_si_20_de_caractere');
                }
            }
            return (error_message.length==0? true:error_message);
        }
    }

    onSubmit(): void {
        const vueInst=this;
        ServiceUser.saveMyProfile(vueInst.myProfile).then(response=>{
            if(response.status=='success'){
                vueInst.$q.notify({
                    color: 'teal',
                    textColor: 'white',
                    position:'top',
                    timeout: 1500,
                    message: response.message
                });
                this.$router.push({ name: 'Dashboard' });
            }
        });
    }

    logout(): void {
        LocalStorage.set('isAuthenticated', 'no');
        LocalStorage.set('token_for_permanent_session', 'x');
        LocalStorage.set('userid', '0');
        this.$router.push({ name: 'home' });
        this.userStore.set_user({
            appid: '',
            userid: '',
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNr: '',
            isAdmin: 'n',
            functie: '',
            companyCode: '',
            companyName: '',
            userToken: '',
            cif: '',
            lang: 'ro'
        });
    }

    get MyImgProfileString64():string{
        return this.userStore.MyImgProfileString64;
    }

    activated(): void {
        console.log('this.userStore=%o',this.userStore)
        this.myProfile.firstName=this.userStore.user.firstName;
        this.myProfile.lastName=this.userStore.user.lastName;
        this.myProfile.email=this.userStore.user.emailAddress;
        this.myProfile.phoneNr=this.userStore.user.phoneNr;
    }
}
