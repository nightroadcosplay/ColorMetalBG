import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import eventbus from '@/store/eventbus';
import {getModule} from 'vuex-module-decorators';
import {TUser} from '@/types/TUser';
import {TUserForAdmin} from '@/types/TUserForAdmin';
import {TAdminCompany} from '@/types/TAdminCompany';
import {ServiceAdminUsers} from '@/services/ServiceAdminUsers';
import {ServiceAdminCompanies} from '@/services/ServiceAdminCompanies';
import {CONFIG_ENV} from '@/config';
import UserProfile from '@/components/Admin/UserProfile/UserProfile.vue'
import EditNewUser from '@/components/Admin/EditNewUser/EditNewUser.vue'


@Options({
    name: "AdminCompanies",
    components: {UserProfile, EditNewUser}
})
export default class AdminCompanies extends Vue {
    @Prop({ default: '0' }) public readonly userid!: string;
    public companies:TAdminCompany[] = [];
    public loadingData = true;
    public isAdminUsersActivated=false;
    public dialogUser = false;
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public urlUserImgProfileByAppid = CONFIG_ENV.URL_ADMIN.users+'/img_user_profile_jpg_by_user_appid'
    public filterText = '';
    public titleComponent='';
    declare public $refs: any;
    public currentPage=1;
    public dynamicComponent='';
    public totalNumberOfPages=1;
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
    public visibleColumns: string[] = [  'cif', 'navisionid', 'denumire'];
    get  columns(): any {
        return [
            { name: 'appid', label: '', field: 'appid', align: 'left',  classes: 'bg-grey-1'},
            { name: 'cif', label: this.$t('message.fiscal_code'), field: 'cif', align: 'left', sortable: true, classes: 'bg-grey-1'},
            { name: 'navisionid', label: this.$t('message.company_id'), field: 'navisionid', align: 'left', sortable: true  },
            { name: 'denumire', label: this.$t('message.name2'), field: 'denumire', align: 'left', sortable: true }
        ]
    }


    public get user(): TUser {
        return this.userStore.user;
    }

    public resetPassword(): void {
        ServiceAdminUsers.resetPassword('abc');
    }

    public openUserAdminForCompany(companyAppid:string): void {
        //this.selectedUser=puser
        // extend(true, this.selectedUser,  puser);
        console.log('companyAppid=%o',companyAppid)
        this.$router.push({ name: 'AdminUsers', params: { companyAppid:companyAppid } });
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


    public getPageCompanies(pageNumber:number): void {
        const vueInst = this;
        vueInst.loadingData=true;
        vueInst.companies=[];
        ServiceAdminCompanies.getCompanies(pageNumber,vueInst.filterText).then(response=>{
            vueInst.loadingData=false;
            if(response.status=='success'){
                vueInst.totalNumberOfPages=response.page.total_pages;
                vueInst.companies=response.page.items.map(company=> {return {
                    appid: company.appid,
                    cif: company.cif,
                    navisionid: company.navisionid,
                    denumire: company.denumire,
                    rg_jfc: company.rg_jfc,
                    rg_nr: company.rg_nr,
                    rg_an: company.rg_an,
                    pf_pj: company.pf_pj,
                    id_country: company.id_country,
                }});
            }
        })
    }

    public activated(): void {
        this.isAdminUsersActivated=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.companies') as string);
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


    @Watch('currentPage')
    onCurrentPageChanged(): void {
        const vueInst=this;
        vueInst.getPageCompanies(vueInst.currentPage);
    }

    @Watch('filterText')
    onFilterTextChanged(): void {
        const vueInst=this;
        vueInst.getPageCompanies(vueInst.currentPage);
    }

    public created(): void {
        const vueInst = this;
        vueInst.currentPage=1;
        vueInst.getPageCompanies(vueInst.currentPage);

    }

    public deactivated(): void {
        this.isAdminUsersActivated = false;
    }

}
