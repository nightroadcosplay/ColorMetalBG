import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {getModule} from 'vuex-module-decorators';
import {TCompanyUser} from '@/types/TCompanyUser';
import {TUser} from "@/types/TUser";
import {ServiceCompanyUsers} from "@/services/ServiceCompanyUsers"
import ContacteleMeleColorMetal from "@/components/ContacteleMeleColorMetal.vue";
import {CONFIG_ENV} from '@/config';

@Options({
    name: "UsersCompany",
    components: {ContacteleMeleColorMetal}
})
export default class UsersCompany extends Vue {
    @Prop({ default: '0' }) public readonly userid!: string;
    public users:TCompanyUser[] = [];
    public loadingData = true;
    public dialogUser = false;
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public urlUserImgProfileByAppid = CONFIG_ENV.URL_ADMIN.users+'/img_user_profile_jpg_by_user_appid'
    declare public $refs: any;

    public userStore = getModule(user);


    public get user(): TUser {
        return this.userStore.user;
    }


    public getUsers(): void {
        const vueInst = this;
        vueInst.loadingData=true;
        vueInst.users=[];
        ServiceCompanyUsers.getAllCompanyUsers().then(response=>{
            vueInst.loadingData=false;
            if(response.status=='success'){
                vueInst.users=response.users.map((user:TCompanyUser)=> {return {
                    appid: user.appid,
                    userid: user.userid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    functie: user.functie,
                    phoneNr: user.phoneNr,
                    isDisabled: user.isDisabled,
                    urlUserImgProfileByAppid:vueInst.urlUserImgProfileByAppid+'/'+user.appid
                }});
            }
        })
    }

    public activated(): void {
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.users') as string);
        }
    }

    public created(): void {
        const vueInst = this;
        vueInst.getUsers();
    }


}
