import { Vue, Options } from 'vue-class-component'
import { TAlerta } from '@/types/TAlerta';
import {TUser} from "@/types/TUser";
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import { ServiceAlerts } from '@/services/ServiceAlerts';
import InvoiceModel from "@/components/InvoiceModel.vue";

@Options({
    name: "Alerte",
    components: {InvoiceModel}
})
export default class Alerte extends Vue {
    public loadingAlerts=false;
    public pagination ={rowsPerPage: 100};
    public alerts:Array<TAlerta>=[];
    public showAlert = false;
    public bill_nr='';
    public userStore = getModule(user);
    public get columns(): any {
            return [
            { name: 'data', label: this.$t('message.date_and_time'), field: 'data', align: 'left' },
            { name: 'descriere',  label: this.$t('message.description'), field: 'descriere', align: 'left' },
            { name: 'action', label: '', field: 'action', align: 'center' }
        ]
    }
    
    public visibleColumns =[ 'data', 'descriere', 'action'];

    get user(): TUser {
        return this.userStore.user;
    }

    public getAlertsFromDB(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        ServiceAlerts.getAlertsFromDB().then(response=>{
            vueInst.$q.loading.hide();
            vueInst.loadingAlerts=false;
            if(response.status=='success'){
                vueInst.alerts=JSON.parse(JSON.stringify(response.alerts));
            }

        })
    }

    public openAlert(index: number): void {
        const alert = this.alerts[index];
        this.showAlert = true;
        if(alert.type == 'i') {
            this.bill_nr = alert.custom_id;
        }
    }

    public splitText(text: string): string {
        const splittedText = text.split(' ');
        splittedText[2] += "\n";
        return splittedText.join(' ');
    }

    public activated(): void {
        this.loadingAlerts=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.alerts').toString());
        }
        this.getAlertsFromDB();
    }
}