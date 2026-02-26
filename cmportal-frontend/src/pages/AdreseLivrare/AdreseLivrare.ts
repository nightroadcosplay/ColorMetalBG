import {Watch} from 'vue-property-decorator';
import {ServiceAdreseLivrare} from '@/services/ServiceAdreseLivrare';
import {TUser} from '@/types/TUser';
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TAdresaLivrare} from "@/types/TAdresaLivrare";
import NomEditAdresaLivrare from "@/components/NomEditAdresaLivrare/NomEditAdresaLivrare.vue"
import {extend} from "quasar";
import {Vue, Options} from "vue-class-component";
import EventsBus from "@/store/eventbus";

@Options({
    name: "AdminArticles",
    components: {NomEditAdresaLivrare}
})
export default class AdreseLivrare extends Vue {
    public dialogAdresa=false;
    public isAdreseLivrareActivated=false;
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public adrese:TAdresaLivrare[]=[];
    public selectedAdresa:TAdresaLivrare={
        slid:'0',
        appid: '',
        cif: '',
        adresaCodJudet: '',
        adresaLocalitate: '',
        adresaAdresa: '',
        adresaCodPostal: '',
        tipAdresa: '',
        codTara: '',
        navisionid: '',
        denJudet: '',
        isNewAddress: '0'
    }

    declare public $refs: any;
    public userStore = getModule(user);
    public EventBusStore = getModule(EventsBus);

    public onOpenFormAddNewAdresa(): void {
        //this.selectedUser=puser
        this.selectedAdresa={
            slid:'0',
            appid: '',
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
        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
        this.dialogAdresa=true;
    }

    public onOpenFormAdresa(padresa:TAdresaLivrare|null): void {
        if(padresa){
            extend(true, this.selectedAdresa,  padresa);
        }else{
            this.selectedAdresa={
                slid:'0',
                appid: '',
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
        }

        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
        this.dialogAdresa=true;
    }

    public closeFormEditAdresaLivrare(needRefresh:boolean): void {
        const vueInst=this;
        vueInst.dialogAdresa=false;
        if(needRefresh){
            vueInst.getAdreseLivrare();
        }
    }

    public onDeleteAdresaLivrare(padresa:TAdresaLivrare): void {
        const vueInst=this;
        vueInst.$q.dialog({
            title: this.$t('message.confirmation').toString(),
            message: `${this.$t('message.stergeti_adresa_de_livrare')} ${padresa.adresaAdresa}?`,
            cancel: true,
            persistent: true
        }).onOk(() => {
            vueInst.$q.loading.show();
            ServiceAdreseLivrare.deleteAdresaLivrare(padresa).then(response=>{
               if(response.status=='success'){
                   vueInst.getAdreseLivrare();
                   this.$q.notify({
                       color: 'teal',
                       textColor: 'white',
                       icon: 'positive',
                       position: 'top',
                       timeout: 500,
                       message: this.$t('message.address_deleted').toString()
                   })
               }
            })
        })
    }

    public get user(): TUser {
        return this.userStore.user;
    }


    public getAdreseLivrare(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        vueInst.adrese=[];
        this.userStore.set_screencountadrese(0);
        ServiceAdreseLivrare.getAdreseLivrare().then(response=>{
            if(response.status=='success'){
                vueInst.adrese=JSON.parse(JSON.stringify(response.adrese));
                vueInst.$q.loading.hide()
            }
        })
    }

    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        if(vueInst.EventBusStore.event.name=='eventClickAddBtn'){
            if(vueInst.isAdreseLivrareActivated){
                vueInst.onOpenFormAddNewAdresa();
            }
        }
    }

    public activated(): void {
        this.isAdreseLivrareActivated = true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.delivery_addresses').toString());
        }
        this.getAdreseLivrare();
    }

    public deactivated(): void {
        this.isAdreseLivrareActivated = false;
    }

}
