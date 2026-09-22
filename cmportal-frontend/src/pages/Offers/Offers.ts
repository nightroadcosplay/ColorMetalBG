import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import offers from '@/store/offers';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {ServiceOffer} from '@/services/ServiceOffer';
import {TOfferHeader} from "@/types/TOfferHeader";
import {TOffer} from "@/types/TOffer";
import StatusOferta from "@/components/StatusOferta.vue";
import {timeUntilNow, timeUntilFutureDate} from '@/modules/utils'
import {timeDateHuman} from '@/modules/utils'
import eventbus from "@/store/eventbus";
import { ServiceDownload } from '@/services/ServiceDownload';
import VuePdfEmbed from 'vue-pdf-embed';
import { TCertificate } from '@/types/TCertificate';
import { TFactura } from '@/types/TFactura';
import { ServiceInvoice } from '@/services/ServiceInvoice';
import { isSet } from '@vue/shared';

@Options({
    name: "Offers",
    components: {StatusOferta, VuePdfEmbed}
})
export default class Offers extends Vue {
    @Prop({ default: '0' }) public readonly pidOffer!: string|null;
    public offersHeaders:TOfferHeader[]=[];
    public loadingOffers = true;
    public selectedOfferSlid = '';
    public appidToBeCancelled='';
    public appidToBeRecalled='';
    public appidToBeDeleted='';
    public inputSearchOffer = '';
    public userStore = getModule(user);
    public offersStore = getModule(offers);
    public EventBusStore = getModule(eventbus);
    
    public pdfTitle='';
    public fixed=false;
    public pdf='';
    public popupTitle='';
    public isLoadingOffer=false;
    public downloadingFile = false;
    public areMoreCertificates=false;
    public areMoreInvoices=false;
    public areMoreInvoicesCertificate=false;
    public certificates:Array<TCertificate> = [];
    public isLoadingInvoice=false;
    public selectedInvoices:Array<TFactura> = [];
    public widthPdf=300;
    public clicked=false;

    get user(

    ): TUser {
        return this.userStore.user;
    }

    get offers():TOffer[]{
        return this.offersStore.offers;
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

    public humanStatusOffer(pstatus:string): string {
        let result='';
        switch (pstatus) {
            case 'o':
                result = this.$t('message.offer_received');
                break;
            case 'c':
                result = this.$t('message.cancelled');
                break;
            case 'p':
                result = this.$t('message.request_sent');
                break;
            case 'k':
                result = this.$t('message.order_sent');
                break;
            case 'm':
                result = this.$t('message.order_modified');
                break;
            case 'r':
                result = this.$t('message.order_rejected');
                break;
            default:
                result = "error";
        }
    
        return result;
    }


    public timeDateHuman(pdate:string,pformat:string): string {
        return timeDateHuman?timeDateHuman(pdate,pformat,this.$i18n.locale):'';
    }

    public getOffersFromDB(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        ServiceOffer.getOffersFromDB().then(response=>{
            vueInst.$q.loading.hide();
            vueInst.loadingOffers=false;
            if(response.status=='success'){
                vueInst.offersHeaders=JSON.parse(JSON.stringify(response.offers));
            }

        })
    }

    public getOfferByIdFromDB(offerId:string): void {
        const vueInst=this;
        vueInst.appidToBeRecalled=offerId;
        ServiceOffer.getOffer(offerId).then(response=>{
            if(response.status=='success'){
                const idxInArr=vueInst.offersHeaders.findIndex(offer=>{
                   return offer.offerId==offerId
                })
                const newOffer={
                            dateWhenOfferExpire: response.offerHeader.dateWhenOfferExpire,
                            offerId: response.offerHeader.offerId,
                            offerSlid: response.offerHeader.offerSlid,
                            status: response.offerHeader.status,
                            trackCreationDate: response.offerHeader.trackCreationDate,
                            trackDateAccept: response.offerHeader.trackDateAccept,
                            trackDateOfertare: response.offerHeader.trackDateOfertare

                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                vueInst.offersHeaders[idxInArr]=newOffer;
                vueInst.appidToBeRecalled='';
            }
        })
    }

    public timeUntilNow(pStringDate: string, pformat:string): string {
        return timeUntilNow(pStringDate,pformat,this.$i18n.locale)
    }

    public timeUntilFutureDate(pStringDate: string, pformat:string): string {
        return timeUntilFutureDate(pStringDate,pformat,this.$i18n.locale)
    }

    askCancelOffer(pOfferId:string): void {
        const vueInst=this;
        vueInst.$q.dialog({
            title: vueInst.$t('message.confirm'),
            message: `${vueInst.$t('message.cancel_offer')} ${pOfferId}?`,
            ok: {
                flat:true,
                label: vueInst.$t('message.cancel_offer'),
            },
            cancel: {
                label: vueInst.$t('message.renunt'),
                flat:true
            },
            persistent: true
        }).onOk(() => {
            vueInst.appidToBeCancelled=pOfferId;
            ServiceOffer.cancelOffer(pOfferId).then(response=>{
                vueInst.appidToBeCancelled='';
                vueInst.appidToBeDeleted=pOfferId;
                if(response.status=='success'){
                    vueInst.$q.notify({
                        color: 'teal',
                        textColor: 'white',
                        icon: 'positive',
                        position: 'top',
                        timeout: 500,
                        message: response.message
                    })
                   setTimeout(function(){ vueInst.eliminaDePeEcranOfertaAnulata(pOfferId);}, 1000);
                }
            })
        })
    }

    public onOpenOferta(pOfferId:string|null, pofferSlid:string|null , pofferDate:string|null, pNumeUtilizator:string|null): void {
        if(pOfferId && pofferSlid && pofferDate) {
            this.$router.push({
                name: 'Oferta',
                params: {pidOffer: pOfferId},
                query: {slid: pofferSlid, d: pofferDate, u: pNumeUtilizator || ''}
            });
        }
    }

    public onOpenCerere(pOfferId:string|null, pofferDate:string|null, pNumeUtilizator:string|null): void {
        if(pOfferId && pofferDate) {
            this.$router.push({
                name: 'Cerere',
                params: {pidOffer: pOfferId},
                query: {d: pofferDate, u: pNumeUtilizator || ''}
            });
        }
    }

    public eliminaDePeEcranOfertaAnulata(pOfferId:string): void {
        const vueInst=this;
        let indexToDelete=-1;
        vueInst.offersHeaders.forEach((offer,pindex) => {
            if(offer.offerId == pOfferId){
                indexToDelete=pindex;
            }
        })
        vueInst.offersHeaders.splice(indexToDelete,1);
        vueInst.appidToBeDeleted='';
    }

    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        console.log('in Offers eventId is changed, vueInst.EventBusStore.event=%o',vueInst.EventBusStore.event)
        if(vueInst.EventBusStore.event.name=='eventNewOfferFromSales'){
            if(this.$route.name=='Offers') {
                if(vueInst.EventBusStore.event.params && vueInst.EventBusStore.event.params.offerId){
                    vueInst.getOfferByIdFromDB(vueInst.EventBusStore.event.params.offerId)
                }
            }
        }
    }

    public downloadPDF(): void {
        const vueInst = this;
        const linkSource = vueInst.pdf;
        const downloadLink = document.createElement("a");
        const fileName = vueInst.pdfTitle;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    public generareOfertaPDFRO(offerSlid: string): void {
        const vueInst = this;
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = '';
        vueInst.isLoadingOffer= true;  
        vueInst.fixed = true;  
        ServiceDownload.generareOfertaPdfLink('confirmare', offerSlid, 'bg').then(response => {
            vueInst.isLoadingOffer = false;
            if(response.status == 'success') {
                const pathPdf = response.message;
                vueInst.pdfTitle = 'Confirmare_'+offerSlid+'_'+this.userStore.user.companyName+'.pdf'
                vueInst.pdf = 'data:application/pdf;base64,'+ pathPdf +'#title='+ vueInst.pdfTitle;
                vueInst.popupTitle = this.$t('message.confirmation') + ' ' + offerSlid;
            }
        });
        
    }

    public generareOfertaPDFENG(offerSlid: string): void {
        const vueInst = this;
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = '';
        vueInst.isLoadingOffer= true;   
        vueInst.fixed = true;
        ServiceDownload.generareOfertaPdfLink('confirmare',offerSlid, 'eng').then(response => {
            vueInst.isLoadingOffer = false;
            if(response.status == 'success') {
                const pathPdf = response.message;
                vueInst.pdfTitle = 'Confirmation_'+offerSlid+'_'+this.userStore.user.companyName+'.pdf'
                vueInst.pdf = 'data:application/pdf;base64,'+ pathPdf +'#title='+ vueInst.pdfTitle;
                vueInst.popupTitle = this.$t('message.confirmation') + ' ' + offerSlid;
            }
        });
        
    }

    public download_certificate(bill_nr: string): void {
        const vueInst=this;
        console.log(bill_nr);
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = '';     
        ServiceInvoice.downloadCertificate(bill_nr).then(response=>{
            
            if(response.status=='success') { 
                console.log(response);
                if(response.countCertificates > 0) {
                    vueInst.areMoreCertificates = true;
                    console.log(response.articles);
                    vueInst.certificates = response.articles;
                    vueInst.popupTitle = this.$t('message.certificates') + ' ' + this.$t('message.invoice') + ' ' + bill_nr;
                } else {
                    if(isSet(response.message)) {    
                        vueInst.fixed = true;  
                        vueInst.pdfTitle = 'Certificate_'+bill_nr+'.pdf';
                        vueInst.pdf = 'data:application/pdf;base64,'+ response.message +'#title='+vueInst.pdfTitle;
                        vueInst.popupTitle = this.$t('message.certificate') + ' ' + bill_nr;
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
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = '';
        vueInst.isLoadingInvoice = true;     
        vueInst.fixed = true;  
        vueInst.pdfTitle = 'Certificate_'+certificat.ItemNo+'.pdf';
        vueInst.pdf = 'data:application/pdf;base64,'+ certificat.Certificate+'#title='+vueInst.pdfTitle;
        vueInst.popupTitle = this.$t('message.certificate') + ' ' + certificat.ItemNo;
        vueInst.isLoadingInvoice = false;   
    }

    public generareCertificate(offer: TOfferHeader): void {
        const vueInst = this;
        vueInst.selectedOfferSlid = '';
        if(offer.invoices != null && offer.invoices.length > 0) {
            if(offer.invoices.length == 1) {
                vueInst.download_certificate(offer.invoices[0].id);
            } else {
                vueInst.areMoreInvoicesCertificate = true;
                vueInst.selectedInvoices = offer.invoices;
                vueInst.selectedOfferSlid = offer.offerSlid;
            }
        } else {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                icon: 'error',
                position: 'top',
                timeout: 1000,
                message: vueInst.$t('message.no_certificates_offer')
            })
        } 
    }

    public generateFacturi(offer: TOfferHeader): void {
        const vueInst = this;
        if(offer.invoices != null && offer.invoices.length > 0) {
            vueInst.pdf = '';
            vueInst.pdfTitle = '';
            vueInst.popupTitle = '';
            vueInst.isLoadingOffer= true;
            vueInst.selectedInvoices = offer.invoices;
            if(offer.invoices.length > 1) {
                vueInst.areMoreInvoices = true;
                vueInst.popupTitle = vueInst.$t('message.invoices') + ' ' + vueInst.$t('message.offer') +' ' + offer.offerSlid; 
            } else {
                vueInst.fixed = true;
                const bill_nr = offer.invoices[0].id;
                vueInst.popupTitle = vueInst.$t('message.invoice') + ' '+ bill_nr;  
                ServiceInvoice.downloadInvoice(bill_nr).then(response=>{
                    vueInst.isLoadingOffer = false; 
                    if(response.status=='success') { 
                            vueInst.pdfTitle = 'Invoice_'+bill_nr+'.pdf';
                            vueInst.pdf = 'data:application/pdf;base64,'+ response.message +'#title='+vueInst.pdfTitle;
                    }

                });
            }
        } else {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                icon: 'error',
                position: 'top',
                timeout: 1000,
                message: vueInst.$t('message.no_invoices_offer')
            })
        }

    }

    public download_invoice(bill_nr: string): void {
        const vueInst=this;
        console.log(bill_nr);
        vueInst.fixed = true;
        vueInst.pdf = '';
        vueInst.pdfTitle = '';
        vueInst.popupTitle = this.$t('message.invoice') + ' '+ bill_nr;
        vueInst.isLoadingOffer = true;      
        ServiceInvoice.downloadInvoice(bill_nr).then(response=>{
            vueInst.isLoadingOffer = false; 
            if(response.status=='success') { 
                    vueInst.pdfTitle = 'Invoice_'+bill_nr+'.pdf';
                    vueInst.pdf = 'data:application/pdf;base64,'+ response.message +'#title='+vueInst.pdfTitle;
            }

        })
    }


    public activated(): void {
        this.loadingOffers=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.offers_and_orders'));
        }
        this.getOffersFromDB();
    }

}
