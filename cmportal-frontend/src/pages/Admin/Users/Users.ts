import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import eventbus from '@/store/eventbus';
import {getModule} from 'vuex-module-decorators';
import {TUser} from '@/types/TUser';
import {TUserForAdmin} from '@/types/TUserForAdmin';
import {ServiceAdminUsers} from '@/services/ServiceAdminUsers';
import {CONFIG_ENV} from '@/config';
import UserProfile from '@/components/Admin/UserProfile/UserProfile.vue'
import EditNewUser from '@/components/Admin/EditNewUser/EditNewUser.vue'
import {ServiceAdminCompanies} from "@/services/ServiceAdminCompanies";
import {TCompany} from "@/types/TCompany";


@Options({
    name: "Users",
    components: {UserProfile, EditNewUser}
})
export default class Users extends Vue {
    //@Prop({ default: '0' }) public readonly userid!: string;
    @Prop({ default: '0' }) public readonly companyAppid!: string;
    public users:TUserForAdmin[] = [];
    public loadingData = true;
    public isAdminUsersActivated=false;
    public dialogUser = false;
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public urlUserImgProfileByAppid = CONFIG_ENV.URL_ADMIN.users+'/img_user_profile_jpg_by_user_appid'
    public filter = '';
    public titleComponent='';
    declare public $refs: any;
    public currentPage=1;
    public dynamicComponent='';
    public totalNumberOfPages=1;
    public company:TCompany={    cif: '', navisionid: '', name: ''}
    public selectedUser:TUserForAdmin={
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
        urlUserImgProfileByAppid:'',
        hasAvatar:''
    }
    public userStore = getModule(user);
    public EventBusStore = getModule(eventbus);
    public myPagination:any={rowsPerPage:10}
    public visibleColumns: string[] = [ 'userid', 'firstName', 'lastName', 'phoneNr', 'emailAddress', 'isDisabled', 'Company'];
    get  columns(): any {
        return [
            { name: 'appid', label: '', field: 'appid', align: 'left',  classes: 'bg-grey-1'},
            { name: 'userid', label: this.$t('message.user_id'), field: 'userid', align: 'left', sortable: true, classes: 'bg-grey-1'},
            { name: 'firstName', label: this.$t('message.first_name'), field: 'firstName', align: 'left', sortable: true  },
            { name: 'lastName', label: this.$t('message.last_name'), field: 'lastName', align: 'center', sortable: true },
            { name: 'phoneNr', label: this.$t('message.phone'), field: 'phoneNr', align: 'left', sortable: true },
            { name: 'emailAddress', label: this.$t('message.email'), field: 'emailAddress', align: 'left', sortable: true },
            { name: 'isDisabled', label: this.$t('message.blocked_user'), field: 'isDisabled', align: 'left', sortable: true },
            { name: 'Company', label: this.$t('message.company'), field: 'companyCode', align: 'left', sortable: true },
        ]
    }


    public get user(): TUser {
        return this.userStore.user;
    }

    public resetPassword(): void {
        ServiceAdminUsers.resetPassword('abc')
    }

    public openUserDetails(userappid:string): void {
        //this.selectedUser=puser
       // extend(true, this.selectedUser,  puser);
        this.titleComponent=this.$t('message.manage') + ' ' + this.$t('message.user');
        this.selectedUser.appid=userappid;
        this.dynamicComponent='UserProfile';
      if(this.$q.platform.is.mobile){
          this.dialogTransitionShow ='slide-left';
          this.dialogTransitionHide ='slide-right';
      }else{
          this.dialogTransitionShow ='slide-right';
          this.dialogTransitionHide ='slide-left';
      }
        this.dialogUser=true;
    }

    public openFormAddNewUser(): void {
        this.selectedUser.appid='0';
        this.titleComponent=this.$t('message.new_account') as string;
        this.dynamicComponent='EditNewUser';
        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-left';
            this.dialogTransitionHide ='slide-right';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
        this.dialogUser=true;
    }

    public fnOnSaveData(userappid:string): void {
        console.log('fnOnSaveData with userid=%o',userappid);
        //this.dialogUser=false;
        this.openUserDetails(userappid);
        this.getUsers();
    }

    public getUsers(): void {
        const vueInst = this;
        vueInst.loadingData=true;
        vueInst.users=[];
        ServiceAdminUsers.getUsers(vueInst.companyAppid).then(response=>{
            vueInst.loadingData=false;
            if(response.status=='success'){
                vueInst.users=response.users.map(user=> {return {
                    appid: user.appid,
                    userid: user.userid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    phoneNr: user.phoneNr,
                    isDisabled: user.isDisabled,
                    companyCode: user.companyCode,
                    companyName: user.companyName,
                    userToken: user.userToken,
                    hasAvatar: user.hasAvatar,
                    urlUserImgProfileByAppid:vueInst.urlUserImgProfileByAppid+'/'+user.appid
                }});
            }
        })
    }

    public getCompany(): void {
        const vueInst=this;
        ServiceAdminCompanies.getCompany(vueInst.companyAppid).then(response=>{
            if(response.status=='success'){
                vueInst.company.cif=response.company.cif;
                vueInst.company.navisionid=response.company.navisionid;
                vueInst.company.name=response.company.denumire;
                vueInst.getUsers();
            }
        });
    }

    public activated(): void {
        this.isAdminUsersActivated=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.users') as string);
        }
    }

    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        if(vueInst.EventBusStore.event.name=='eventClickAddBtn'){
            if(vueInst.isAdminUsersActivated){
                vueInst.openFormAddNewUser();
            }
        }
    }

    @Watch('companyAppid', { immediate: true, deep: false })
    onCompanyAppidChanged(): void {
        const vueInst=this;
        if(vueInst.companyAppid!='0'){
            vueInst.getCompany();
        }

    }

    public created(): void {
        const vueInst = this;
        vueInst.getUsers();
    }

    public deactivated(): void {
        this.isAdminUsersActivated = false;
    }

}
