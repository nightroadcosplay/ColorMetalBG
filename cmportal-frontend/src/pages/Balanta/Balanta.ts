import {Component, Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {CONFIG_ENV} from '@/config';
import {ServiceUser} from '@/services/ServiceUser';
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TBalantaNav} from "@/types/TBalantaNav";
import {ServiceBalanta} from "@/services/ServiceBalanta";
import {getCurrentDateAsString, getLastYearFirstDayDateAsString} from "@/modules/utils";

@Options({
    name: "Balanta",
    components: {}
})
export default class Balanta extends Vue {
    public loadingInvoices=false;
    public balantaInNav:TBalantaNav = ServiceBalanta.balantaGoala;
    public existaBalanta=false;
    private downloadingFile = false;
    declare public $refs: any;
    public userStore = getModule(user);
    public pagination ={rowsPerPage: 0};
    private currentDateAsString=getCurrentDateAsString('dd.mm.yyyy');
    private lastYearFirstDayDateAsString=getLastYearFirstDayDateAsString('dd.mm.yyyy');
    public get columns() : any {
        return [
        { name: 'DocumentDate', label: this.$t('message.doc_date').toString(), field: 'DocumentDate', align: 'left', sortable: true },
        { name: 'DueDate', label: this.$t('message.due_date').toString(), field: 'DueDate', align: 'left', sortable: true },
        { name: 'DocumentType', label: this.$t('message.doc_type').toString(), field: 'DocumentType', align: 'left' },
        { name: 'DocumentNo', label: this.$t('message.doc_no').toString(), field: 'DocumentNo', align: 'left' },
        { name: 'CreditAmount',  label: this.$t('message.total_credit').toString(), field: 'CreditAmount', align: 'right', sortable: true },
        { name: 'DebitAmount', label: this.$t('message.total_debit').toString(), field: 'DebitAmount', align: 'right' },
        { name: 'CreditBalance', label: this.$t('message.amount_credit').toString(), field: 'CreditBalance', align: 'right', sortable: true },
        { name: 'DebitBalance', label: this.$t('message.amount_debit').toString(), field: 'DebitBalance', align: 'right' }
    ]}
    public visibleColumns =[ 'DocumentType', 'DocumentNo', 'DocumentDate', 'DueDate', 'DebitAmount', 'CreditAmount','CreditBalance','DebitBalance'];
    get user(): TUser {
        return this.userStore.user;
    }

    public getBalantaFromNav(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        ServiceBalanta.getBalantaFromNav().then(response=>{
            vueInst.$q.loading.hide();
            vueInst.loadingInvoices=false;
            if(response.status=='success'){
                // Handle both single object and array responses
                const balantaData = Array.isArray(response.balantaInNav) 
                    ? response.balantaInNav[0] 
                    : response.balantaInNav;
                vueInst.balantaInNav=JSON.parse(JSON.stringify(balantaData));
                
                // Ensure CustLedgerEntry is always an array for QTable
                if (!Array.isArray(vueInst.balantaInNav.CustLedgerEntry)) {
                    vueInst.balantaInNav.CustLedgerEntry = vueInst.balantaInNav.CustLedgerEntry 
                        ? [vueInst.balantaInNav.CustLedgerEntry] 
                        : [];
                }
                
                vueInst.existaBalanta=true;
            }
            console.log('balantaInNav=%o',vueInst.balantaInNav);
        })
    }

    public downloadPdfMobile(): void {
        ServiceBalanta.getBalancePdfMobile().then(response => {
            console.log(response);
            const fileName = 'balanta.pdf';
            const linkSource = 'data:application/pdf;base64,'+ response.message + '#title='+fileName;
            console.log(linkSource);
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        });
    }

    private downloadBalantaPdf(): void {
        const vueInst=this;
        if(vueInst.$q.platform.is.mobile) {
            vueInst.downloadPdfMobile();
        } else {
            const urlToGetFile=CONFIG_ENV.URL_BALANTA.getPdf;
            vueInst.downloadingFile=true;
            let urlBlobForPreviewFile: any = null;
            fetch(urlToGetFile, {
                credentials: 'include'
            })
                .then(resp => resp.blob())
                .then(blob => {
                    const link = document.createElement('a');
                    urlBlobForPreviewFile = window.URL.createObjectURL(blob);
                    link.href = urlBlobForPreviewFile;
                    link.target = '_self';
                    link.download = "balanta.pdf";
                    (document.body || document.documentElement).appendChild(link);
                    link.click();
                    setTimeout(()=>{
                        window.URL.revokeObjectURL(urlBlobForPreviewFile);
                        link.remove();
                        vueInst.downloadingFile=false;
                    }, 100);
                })
                .catch((err) => {
                    this.$q.notify({
                        color: 'red',
                        textColor: 'white',
                        type: 'negative',
                        message: this.$t('message.eroare_fisierul_nu_poate_fi_descarcat').toString(),
                        position: 'top',
                        timeout: 3500,
                    })
                });
        }
    }

    public activated(): void {
        this.loadingInvoices=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.balance').toString());
        }
        this.getBalantaFromNav();
    }

}
