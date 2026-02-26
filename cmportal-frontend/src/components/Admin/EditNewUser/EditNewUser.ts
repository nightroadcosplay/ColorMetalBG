import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {getModule} from 'vuex-module-decorators';
import {ServiceCompanies} from '@/services/ServiceCompanies'
import {ServiceAdminUsers} from '@/services/ServiceAdminUsers'
import {TNewUserForAdmin} from '@/types/TNewUserForAdmin';
import {TCompany} from '@/types/TCompany';
import {ServiceAdminCompanies} from "@/services/ServiceAdminCompanies";

@Options({
    name: "EditNewUser",
    components: {}
})
export default class EditNewUser extends Vue {
    @Prop({ default: '0' }) public readonly companyAppid!: string;
    @Prop({ default: '0' }) public readonly userappid!: string;
    @Prop() public fnOnSaveData!: (userid:string)=>void;
    public ajaxLoadingData=true;
    public optionsCompanies:TCompany[]=[];
    public user:TNewUserForAdmin={
        userid: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNr: '',
        functie: '',
        companyCif: '',
        companyCode: '',
        companyName: '',
    }
    public urlUserImgProfileByAppid = '';
    declare public $refs: any;
    public userStore = getModule(user);

    public goToView(pRouteViewName: string ): void {
        this.$router.push({ name: pRouteViewName })
    }

    public focusOnFirstName(): void {
        this.$refs.refFirstName.focus();
    }

    public focusOnLastName(): void {
        this.$refs.refLastName.focus();
    }

    public focusOnEmail(): void {
        this.$refs.refEmail.focus();
    }

    public focusOnPhoneNr(): void {
        this.$refs.refPhoneNr.focus();
    }

    public focusOnFunctie(): void {
        this.$refs.refFunctie.focus();
    }

    public focusOnCompnay(): void {
        this.$refs.refCompany.focus();
    }

    public onSubmit(): void {
        const vueInst=this;

        vueInst.$q.loading.show()
        ServiceAdminUsers.saveNewUser(vueInst.user).then(response=>{
            vueInst.$q.loading.hide()
            if(response.status=='success'){
                vueInst.$q.notify({
                    color: 'teal',
                    textColor: 'white',
                    icon: 'positive',
                    position: 'top',
                    timeout: 2000,
                    message: response.message
                })
                vueInst.fnOnSaveData(response.userappid);
            }


        })
    }

    public filterCompanies(val:string, update:(fn: () => void) => void): void {
        const vueInst=this;
        update(() => {
            const needle = (val?val.toUpperCase():'');
            //this.optionsCompanies = optionsC.filter(item => item.name.toLowerCase().indexOf(needle) > -1)
            vueInst.getFirst20CompaniesByFilter(needle);
        })
    }

    public getCompany(): void {
        const vueInst=this;
        ServiceAdminCompanies.getCompany(vueInst.companyAppid).then(response=>{
            if(response.status=='success'){
                vueInst.user.companyCif=response.company.cif;
                vueInst.user.companyCode=response.company.navisionid;
                vueInst.user.companyName=response.company.denumire;
            }
        });
    }

    @Watch('companyAppid',{ immediate: true})
    onCompanyAppidChanged(): void {
        // console.log('EDITNEWUSER onCompanyAppidChanged')
        const vueInst=this;
        vueInst.getCompany();
    }

    public getFirst20CompaniesByFilter(filterString:string): void {
        ServiceCompanies.getCompaniesByFilter(filterString).then(response=>{
            if(response.status=='success'){
                this.optionsCompanies=response.companies;
            }
        });
    }

    public onReset(): void {
        this.user={
            userid: '',
            firstName: '',
            lastName: '',
            functie: '',
            emailAddress: '',
            phoneNr: '',
            companyCif: '',
            companyCode: '',
            companyName: '',
        }
    }
}
