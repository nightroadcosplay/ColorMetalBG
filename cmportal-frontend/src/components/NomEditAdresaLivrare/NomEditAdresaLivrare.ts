import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {ServiceAdreseLivrare} from '@/services/ServiceAdreseLivrare';
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TAdresaLivrare} from "@/types/TAdresaLivrare";
import {TCountry} from "@/types/TCountry";
import {TJudet} from "@/types/TJudet";
import {extend} from "quasar";
import nomenclatoare from "@/store/nomenclatoare";


@Options({
    name: "NomEditAdresaLivrare",
    components: {}
})
export default class NomEditAdresaLivrare extends Vue {
    @Prop({ default: null }) public readonly propAdresa!: TAdresaLivrare;
    @Prop() public closeHandler!: (needRefresh: boolean)=>void;
    public adresa:TAdresaLivrare={
        slid: '0',
        appid: '0',
        cif: '',
        adresaCodJudet: '',
        adresaLocalitate: '',
        adresaAdresa: '',
        adresaCodPostal: '',
        tipAdresa: '',
        codTara: '',
        navisionid: '',
        denJudet: '',
        isNewAddress: '1'
    };
    declare public $refs: any;
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);

    get user(): TUser {
        return this.userStore.user;
    }

    get countryOptions(): TCountry[] {
        return this.storeNomenclatoare.nomCountries;
    }

    get judeteOptions(): TJudet[] {
        return this.storeNomenclatoare.nomJudete;
    }

    public onSubmit (): void {
        const vueInst=this;
        ServiceAdreseLivrare.saveAdresaLivrare(vueInst.adresa).then(response=>{
           console.log(response)
            if(response.status=='success'){
            vueInst.closeHandler(true);
                this.$q.notify({
                    color: 'teal',
                    textColor: 'white',
                    icon: 'positive',
                    position: 'top',
                    timeout: 500,
                    message: this.$t('message.address_saved')
                })
            }
        })

    }

    public onReset(): void {
        this.adresa={
            slid: '0',
            appid: '0',
            cif: '',
            adresaCodJudet: '',
            adresaLocalitate: '',
            adresaAdresa: '',
            adresaCodPostal: '',
            tipAdresa: '',
            codTara: '',
            navisionid: '',
            denJudet: '',
            isNewAddress: '1'
        }
    }

    public created(): void {
        if(this.propAdresa){
            extend(true, this.adresa,  this.propAdresa);
        }
    }
}
