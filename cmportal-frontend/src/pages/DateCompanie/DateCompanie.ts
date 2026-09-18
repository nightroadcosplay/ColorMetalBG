import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import ContacteleMeleColorMetal from "@/components/ContacteleMeleColorMetal.vue";
import { ServiceAdminCompanies } from '@/services/ServiceAdminCompanies';

@Options({
    name: "DateCompanie",
    components: {ContacteleMeleColorMetal}
})
export default class DateCompanie extends Vue {
    public loading=false;
    public cui = '';
    public regCom='';
    public adresaBaza='';
    public denumire='';


    declare public $refs: any;
    public userStore = getModule(user);


    get user(): TUser {
        return this.userStore.user;
    }

    public activated(): void {
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.company_data'));
        }
        
        const vueInst=this;
        vueInst.getDateCompanie();
    }

    public getDateCompanie(): void {
        const vueInst = this;
        vueInst.$q.loading.show();
        ServiceAdminCompanies.getCompanyByCif(this.userStore.user.cif).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success') {
                vueInst.cui = response.company.cif;
                if(response.company.id_country == 'RO'){
                    vueInst.cui = 'RO' + vueInst.cui;
                }
                vueInst.regCom = (response.company.pf_pj ? response.company.pf_pj.toUpperCase() : '') + response.company.rg_jfc + '/' + response.company.rg_nr + '/' + response.company.rg_nr;
                vueInst.denumire = response.company.denumire;

                ServiceAdminCompanies.getCompanyAddress(this.userStore.user.cif).then (response => {
                    if (response.status == 'success') {
                        console.log(response.adresa);
                        vueInst.adresaBaza = response.adresa.adresaAdresa + (response.adresa.adresaLocalitate ? ", " + response.adresa.adresaLocalitate : '') +  (response.adresa.denJudet ? ", " + response.adresa.denJudet : '');
                    }
                });
            }
        });
        
    }
    
    public created(): void {
        const vueInst=this;
        vueInst.getDateCompanie();
    }

}
