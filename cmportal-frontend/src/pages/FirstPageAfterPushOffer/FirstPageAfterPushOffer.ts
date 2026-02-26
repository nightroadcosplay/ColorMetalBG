import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import offers from '@/store/offers';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";

@Options({
    name: "FirstPageAfterPushOffer",
    components: {}
})
export default class FirstPageAfterPushOffer extends Vue {
    @Prop({ default: '0' }) public readonly pidOffer!: string|null;
    public loading=false;
    declare public $refs: any;
    public offersStore = getModule(offers);
    public userStore = getModule(user);

    public onGoToOffers(): void {
        this.$router.push({name: 'Offers'});
    }

    get user(): TUser {
        return this.userStore.user;
    }

    public activated(): void {
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.solicitare_oferta'));
        }
    }
}
