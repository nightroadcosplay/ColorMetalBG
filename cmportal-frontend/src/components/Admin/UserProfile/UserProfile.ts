import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {CONFIG_ENV} from '@/config';
import {getModule} from 'vuex-module-decorators';
import {ServiceAdminUsers} from '@/services/ServiceAdminUsers'
import {TUserForAdmin} from '@/types/TUserForAdmin';
import {extend} from "quasar";

@Options({
    name: "UserProfile",
    components: {}
})
export default class UserProfile extends Vue {
    @Prop({ default: '0' }) public readonly userappid!: string;
    public ajaxLoadingData=true;
    public user:TUserForAdmin={
        appid: '',
        userid: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNr: '',
        isDisabled: '',
        companyCode: '',
        companyName: '',
        userToken: '',
        hasAvatar:'',
        urlUserImgProfileByAppid:''
    }
    public urlUserImgProfileByAppid = '';
    declare public $refs: any;
    public userStore = getModule(user);
    public goToView(pRouteViewName: string ): void {
        this.$router.push({ name: pRouteViewName })
    }

    public created(): void {
        this.ajaxLoadingData=true;
        this.$q.loading.show()
        this.getUserDetails();
    }

    public resetPassword(): void {
        const vueInst = this;
        vueInst.$q.loading.show()
        ServiceAdminUsers.resetPassword(vueInst.userappid).then(response=>{
            vueInst.$q.loading.hide()
            if(response.status=='success'){
                this.$q.dialog({
                    title: this.$t('message.message'),
                    html: true,
                    message: response.message
                })
            }
        })
    }

    public getUserDetails(): void {
        const vueInst = this;
        ServiceAdminUsers.getUserDetails(vueInst.userappid).then(response=>{
            vueInst.ajaxLoadingData=false;
            this.$q.loading.hide()
            if(response.status=='success'){
                extend(true, vueInst.user,  response.user);
                vueInst.urlUserImgProfileByAppid = CONFIG_ENV.URL_ADMIN.users+'/img_user_profile_jpg_by_user_appid/'+vueInst.user.appid;
            }

        })
    }
}
