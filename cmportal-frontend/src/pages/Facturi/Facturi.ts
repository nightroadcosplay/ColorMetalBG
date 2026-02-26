import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TFactura} from "@/types/TFactura";
import {ServiceInvoice} from "@/services/ServiceInvoice";
import VuePdfEmbed from 'vue-pdf-embed';
import {TCertificate} from "@/types/TCertificate";

@Options({
    name: "Facturi",
    components: {VuePdfEmbed}
})
export default class Facturi extends Vue {
[x: string]: any;
    public loadingInvoices=false;
    public invoices:Array<TFactura>=[];
    public existaFacturi=false;
    declare public $refs: any;
    public userStore = getModule(user);
    public pagination ={rowsPerPage: 100};
    public fixed=false;
    public areMoreCertificates=false;
    public pdfBase64='';
    public pdfTitle='';
    public popupTitle='';
    public certificates:Array<TCertificate> = [];
    public isLoadingInvoice=false;
    public widthPdf=300;
    public clicked=false;
    public selectedBillNr='';
    public totalScadenta=0;
    public totalRestDePlata = 0;
    public get columns(): any {
        return [
            { name: 'id', label: this.$t('message.doc_no'), field: 'id', align: 'center', sortable: true },
            { name: 'data', label: this.$t('message.doc_date'), field: 'data', align: 'left', sortable: true },
            { name: 'valoare',  label: this.$t('message.value'), field: 'valoare', align: 'right', sortable: true },
            { name: 'moneda', label: this.$t('message.currency'), field: 'moneda', align: 'left', sortable: true },
            { name: 'dataScadenta', label: this.$t('message.due_date'), field: 'dataScadenta', align: 'right', sortable: true },
            { name: 'restDeAchitat', label: this.$t('message.balance_due'), field: 'restDeAchitat', align: 'right', sortable: true },
            { name: 'nrZileDepasireTermenPlata', label: this.$t('message.payment_overdue_days'), field: 'nrZileDepasireTermenPlata', align: 'right', sortable: true },
            { name: 'vizualizarePDF', label: this.$t('message.invoice'), field: 'vizualizarePDF', align: 'center' },
            { name: 'vizualizarePDFCertificate', label: this.$t('message.certificates'), field: 'vizualizarePDFCertificate', align: 'center' }
        ]
    }
    public visibleColumns =[ 'id', 'data', 'valoare', 'moneda', 'nrZileDepasireTermenPlata','restDeAchitat','vizualizarePDF', 'dataScadenta', 'vizualizarePDFCertificate'];

    public filters = {
        id: { value: '', keys: ['id'] },
        data: { value: '', keys: ['data'] },
        valoare: { value: '', keys: ['valoare'] },
        moneda: { value: '', keys: ['moneda'] },
        dataScadenta: { value: '', keys: ['dataScadenta'] },
        restDeAchitat: { value: '', keys: ['restDeAchitat'] },
        nrZileDepasireTermenPlata: { value: '', keys: ['nrZileDepasireTermenPlata'] },
      };

    get user(): TUser {
        return this.userStore.user;
    }

    public changeWitdhPdf(op: string): void {
        if(op == 'in') {
            if(this.widthPdf > 1500) {return;}
            this.widthPdf *= 1.25; 
        } else {
            if(this.widthPdf < 300) {return;}
            this.widthPdf /= 1.25; 
        }
        this.clicked=true;
        setTimeout(function(){
            this.clicked = false;
        }.bind(this),1000);
    }

    public getInvoicesFromDB(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        ServiceInvoice.getInvoicesFromDB().then(response=>{
            vueInst.$q.loading.hide();
            vueInst.loadingInvoices=false;
            if(response.status=='success'){
                vueInst.invoices=JSON.parse(JSON.stringify(response.invoices));
                vueInst.existaFacturi=true;
                vueInst.totalScadenta = response.totalScadenta;
                vueInst.totalRestDePlata = response.totalRestDePlata;
            }

        })
    }

    public downloadPDF(): void {
        const vueInst = this;
        const linkSource = vueInst.pdfBase64;
        const downloadLink = document.createElement("a");
        const fileName = vueInst.pdfTitle;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    public download_invoice(bill_nr: string): void {
        const vueInst=this;
        console.log(bill_nr);
        vueInst.fixed = true;  
        vueInst.selectedBillNr = bill_nr;
        vueInst.pdfBase64 = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = 'Factura '+ bill_nr;
        vueInst.isLoadingInvoice = true;      
        ServiceInvoice.downloadInvoice(bill_nr).then(response=>{
            // vueInst.$q.loading.hide();
            // vueInst.loadingInvoices=false;
            
            vueInst.isLoadingInvoice = false; 
            if(response.status=='success') { 
                    vueInst.pdfTitle = 'Invoice_'+bill_nr+'.pdf';
                    vueInst.pdfBase64 = 'data:application/pdf;base64,'+ response.message +'#title='+vueInst.pdfTitle;
            }

        })
    }

    public download_certificate(bill_nr: string): void {
        const vueInst=this;
        console.log(bill_nr);
        vueInst.selectedBillNr = bill_nr;
        vueInst.pdfBase64 = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = '';
        vueInst.isLoadingInvoice = true;      
        ServiceInvoice.downloadCertificate(bill_nr).then(response=>{
            // vueInst.$q.loading.hide();
            // vueInst.loadingInvoices=false;
            
            vueInst.isLoadingInvoice = false; 
            if(response.status=='success') { 
                console.log(response);
                if(response.countCertificates > 0) {
                    vueInst.areMoreCertificates = true;
                    console.log(response.articles);
                    vueInst.certificates = response.articles;
                } else {  
                    if(response.message.length > 0) {
                        vueInst.fixed = true;  
                        vueInst.pdfTitle = 'Certificate_'+bill_nr+'.pdf';
                        vueInst.pdfBase64 = 'data:application/pdf;base64,'+ response.message +'#title='+vueInst.pdfTitle;
                        vueInst.popupTitle = 'Certificat '+bill_nr;
                    } else {
                        vueInst.$q.notify({
                            color: 'red',
                            textColor: 'white',
                            type: 'negative',
                            icon: 'error',
                            position: 'top',
                            timeout: 1000,
                            message: vueInst.$t('message.no_certificates')
                        })
                    }
                }
            }

        })
    }

    public download_certificate_2(index: number): void {
        const vueInst=this;
        const certificat = vueInst.certificates[index];
        vueInst.pdfBase64 = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = '';
        vueInst.isLoadingInvoice = true;     
        vueInst.fixed = true;
        vueInst.pdfTitle = 'Certificate_'+certificat.ItemNo+'.pdf';  
        vueInst.pdfBase64 = 'data:application/pdf;base64,'+ certificat.Certificate+'#title='+vueInst.pdfTitle;
        vueInst.popupTitle = 'Certificat '+certificat.ItemNo;
        vueInst.isLoadingInvoice = false;   
    }

    public searchInvoices(): void {
        const vueInst = this;
        vueInst.$q.loading.show();
        ServiceInvoice.getFilteredInvoices(vueInst.filters.id.value, vueInst.filters.data.value, vueInst.filters.valoare.value,vueInst.filters.moneda.value,
            vueInst.filters.nrZileDepasireTermenPlata.value,vueInst.filters.restDeAchitat.value,vueInst.filters.dataScadenta.value).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                vueInst.invoices=JSON.parse(JSON.stringify(response.invoices));
                vueInst.existaFacturi=true;
                vueInst.totalScadenta = response.totalScadenta;
                vueInst.totalRestDePlata = response.totalRestDePlata;
            }
        });
    }

    public refreshFilters(): void {
        const vueInst = this;
        vueInst.filters.id.value = '';
        vueInst.filters.data.value = '';
        vueInst.filters.valoare.value = '';
        vueInst.filters.moneda.value = '';
        vueInst.filters.dataScadenta.value = '';
        vueInst.filters.restDeAchitat.value = '';
        vueInst.filters.nrZileDepasireTermenPlata.value = '';
        vueInst.getInvoicesFromDB();
    }

    public updateData(val: string): void {
        this.filters.data.value = val;
        this.$refs.qDateProxy0.hide();
        this.searchInvoices();
    }

    public updateDataScadenta(val: string): void {
        this.filters.dataScadenta.value = val;
        this.$refs.qDateProxy0.hide();
        this.searchInvoices();
    }


    public activated(): void {
        this.loadingInvoices=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.invoices'));
        }
        this.getInvoicesFromDB();
    }

}
