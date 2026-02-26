import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import offers from '@/store/offers';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TOffer} from "@/types/TOffer";
import ContacteleMeleColorMetal from "@/components/ContacteleMeleColorMetal.vue";
import HierarchicalChainBrowseHeader from "@/components/HierarchicalChainBrowseHeader/HierarchicalChainBrowseHeader.vue";
import { ServiceInvoice } from '@/services/ServiceInvoice';


@Options({
    name: "Dashboard",
    components: {ContacteleMeleColorMetal, HierarchicalChainBrowseHeader}
})
export default class Dashboard extends Vue {
    public inputSearchArticle='';
    declare public $refs: any;
    public userStore = getModule(user);
    public offersStore = getModule(offers);
    public overdueInvoiceCount = 0;
    public showAlertDepasireTermenFacturi=false;
    public showAlertCount=false;

    get user(): TUser {
        return this.userStore.user;
    }

    get offers():TOffer[]{
        return this.offersStore.offers;
    }
    public closeAlertDepasireTermenFacturi(): void {
        this.showAlertDepasireTermenFacturi=false;
    }

    public onGoArticoleFavorite(): void {
        this.$router.push({name: 'ArticoleFavorite'});
    }

    public onGoCautaArticole(): void {
        this.$router.push({name: 'BrowseCategories',  params: { pid: '0' }});
    }

    public onGoToOffers(): void {
        this.$router.push({name: 'Offers'});
    }

    public onGoNomAdreseLivrare(): void {
        this.$router.push({name: 'AdreseLivrare'});
    }

    public onGoFacturi(): void {
        this.$router.push({name: 'Facturi'});
    }

    public onGoBalanta(): void {
        this.$router.push({name: 'Balanta'});
    }

    public onGoDateCompanie(): void {
        this.$router.push({name: 'DateCompanie'});
    }

    public openTehnipedia(): void {
        window.open("https://color-metal.ro/ro/tehnipedia");
    }

    public openLink(link: string): void {
        window.open(link);
    }

    public onGoAlerte(): void {
        this.$router.push({name: 'Alerte'});
        this.overdueInvoiceCount = 0;
        this.showAlertCount = false;
    }

    public onGoUsersCompany(): void {
        this.$router.push({name: 'UsersCompany'});
    }

    public onGoDocumenteCompany(): void {
        this.$router.push({name: 'Documente'});
    }

    public activated(): void {
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showmenubar(true);
            this.userStore.set_page_transition('fade-in-left');
        }else{
            this.userStore.set_page_transition('fade-in-left');
        }
    }

    public created(): void {
        ServiceInvoice.getInvoicesFromNAV().then(response=>{ 
            if(response.status=='success'){
                this.showAlertDepasireTermenFacturi = response.areInvoicesOverdue;
                this.overdueInvoiceCount = response.overdueInvoiceCount;
                this.showAlertCount = response.areInvoicesOverdue;
            } 
        });
    }

}
