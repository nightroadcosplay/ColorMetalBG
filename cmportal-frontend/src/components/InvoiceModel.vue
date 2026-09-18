<template>
    <div>
    <q-card :class="$q.platform.is.mobile ? 'my_card_2' : 'card_3'">
        <q-card-section class="row items-center">
            <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ $t('message.invoice') }} {{invoice.id}}</div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-list dense>              
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.doc_no') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.id }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.doc_date') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.data}}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.value') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.valoare}}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.currency') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.moneda}}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.due_date') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.dataScadenta}}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.balance_due') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.restDeAchitat}}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label>{{ $t('message.payment_overdue_days') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ invoice.nrZileDepasireTermenPlata}}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <!-- <q-separator></q-separator> -->
        <q-card-section class="row items-center">
            <q-btn flat color="primary" no-caps :label="$t('message.invoice')" icon="picture_as_pdf" @click="download_invoice(bill_nr)"/>
            <q-btn flat color="primary" no-caps :label="$t('message.certificates')" icon="picture_as_pdf" @click="download_certificate(bill_nr)"/>
        </q-card-section>
    </q-card>
    <q-dialog v-model="fixed" full-width>
        <q-card class="my_card">
          <q-card-section class="row items-center">
            <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{popupTitle}}</div>
            <q-btn v-if="$q.platform.is.desktop" no-caps color="primary" v-ripple @click="downloadPDF" icon="download" style="margin-left: 1rem;cursor: pointer;">{{ $t('message.download') }}</q-btn>
            <q-btn v-if="$q.platform.is.mobile" no-caps flat color="primary" icon="download" v-ripple @click="downloadPDF" style="cursor: pointer;"></q-btn>
            <q-space />
            <q-spinner v-if="isLoadingInvoice"
              color="black"
              :size="$q.platform.is.mobile ? '1.5em' : '3em'"
            />
            <q-space v-if="isLoadingInvoice"/>
            <q-btn v-if="$q.platform.is.desktop" icon="close" flat round dense v-close-popup/>
            <q-btn v-else icon="close" flat round dense v-close-popup @click="widthPdf=300"/>
          </q-card-section>
          <q-card-section v-if="$q.platform.is.mobile" class="my_card_2">
            <q-btn v-if="!isLoadingInvoice" @click="changeWitdhPdf('in')" icon="zoom_in" style="margin-bottom: 8px;" :loading="clicked"></q-btn>
            <q-btn v-if="!isLoadingInvoice" @click="changeWitdhPdf('out')" icon="zoom_out" style="margin-left: 10px;margin-bottom: 8px;" :loading="clicked"></q-btn>
            <br>
            <vue-pdf-embed :source="pdfBase64" :width="widthPdf"/>
          </q-card-section>
          <q-card-section v-else class="my_card_2">
            <vue-pdf-embed :source="pdfBase64"/>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="areMoreCertificates" full-width>
        <q-card class="my_card_5">
          <q-card-section class="row items-center">
            
            <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ $t('message.certificates') }} {{ $t('message.invoice') }} {{ selectedBillNr }}</div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <q-list dense>              
                <q-item v-for="(certificat, index) in certificates" :key="certificat.ItemNo">
                  <q-card v-if="$q.platform.is.mobile" class="my_card_4" >
                    <q-item-section>
                        <q-item-label><b>{{$t('message.item_no')}}:</b></q-item-label>
                    </q-item-section>
                    <q-item-section >
                        <q-item-label caption>{{ certificat.ItemNo }}</q-item-label>
                    </q-item-section>
                    <br>
                    <q-item-section>
                        <q-item-label><b>{{$t('message.description')}}:</b></q-item-label>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label caption>{{ certificat.Description }}</q-item-label>
                    </q-item-section>
                    <q-card-actions vertical>
                      <q-btn flat color="primary" icon="picture_as_pdf" @click="download_certificate_2(index)"/>
                    </q-card-actions>
                  </q-card>
                  <q-item-section v-if="$q.platform.is.desktop" no-wrap>
                        <q-item-label><b>{{$t('message.item_no')}}:</b> {{ certificat.ItemNo }}</q-item-label>
                    </q-item-section>
                    
                    <q-item-section v-if="$q.platform.is.desktop" no-wrap>
                        <q-item-label><b>{{$t('message.description')}}:</b> {{ certificat.Description }}</q-item-label>
                    </q-item-section>
                    
                    <q-item-section v-if="$q.platform.is.desktop" class="pdf_icon">
                      <q-btn flat color="primary" icon="picture_as_pdf" @click="download_certificate_2(index)"/>
                    </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
      </q-dialog>
    </div>
  </template>
  
  
  <script lang="ts">
  
    import { ServiceInvoice } from '@/services/ServiceInvoice';
    import { isSet } from '@vue/shared';
    import VuePdfEmbed from 'vue-pdf-embed';
    export default {
        name:'InvoiceModel',
        props: {
            bill_nr: String
        },
        components:{VuePdfEmbed},
        data: function(): any {
            return {
                invoice:{
                    id:'',
                    data:'',
                    valoare:0,
                    moneda:'',
                    dataScadenta:'',
                    restDeAchitat:0,
                    nrZileDepasireTermenPlata:''
                },
                isLoadingInvoice: true,
                fixed: false,
                pdfBase64:'',
                areMoreCertificates:false,
                pdfTitle:'',
                popupTitle:'',
                certificates:[],
                selectedBillNr:'',
                widthPdf:300,
                clicked:false
                
            }
        },

        methods: {
            getInvoice: function(): void {
                const vueInst=this;
                console.log(vueInst.bill_nr);
                vueInst.isLoadingInvoice = true;
                ServiceInvoice.getInvoice(vueInst.bill_nr).then( result => {
                    vueInst.isLoadingInvoice = false;
                    if(result.status == 'success') {
                        vueInst.invoice.id = result.invoice.id;
                        vueInst.invoice.data = result.invoice.data;
                        vueInst.invoice.valoare = result.invoice.valoare;
                        vueInst.invoice.moneda = result.invoice.moneda;
                        vueInst.invoice.dataScadenta = result.invoice.dataScadenta;
                        vueInst.invoice.restDeAchitat = result.invoice.restDeAchitat;
                        vueInst.invoice.nrZileDepasireTermenPlata = result.invoice.nrZileDepasireTermenPlata;
                    }
                })
            },
            download_invoice(bill_nr: string): void {
                const vueInst=this;
                console.log(bill_nr);
                vueInst.fixed = true;  
                vueInst.selectedBillNr = bill_nr;
                vueInst.pdfBase64 = '';
                vueInst.pdfTitle = '';
                vueInst.popupTitle = (vueInst.$t('message.invoice') as string)+' '+ bill_nr;
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
            },

            download_certificate(bill_nr: string): void {
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
                            if(isSet(response.message)) {
                                vueInst.fixed = true;  
                                vueInst.pdfTitle = 'Certificate_'+bill_nr+'.pdf';
                                vueInst.pdfBase64 = 'data:application/pdf;base64,'+ response.message +'#title='+vueInst.pdfTitle;
                                vueInst.popupTitle = (vueInst.$t('message.certificate') as string)+' '+bill_nr;
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
            },

            download_certificate_2(index: number): void {
                const vueInst=this;
                const certificat = vueInst.certificates[index];
                vueInst.pdfBase64 = '';
                vueInst.pdfTitle = '';
                vueInst.popupTitle = '';
                vueInst.isLoadingInvoice = true;     
                vueInst.fixed = true;  
                vueInst.pdfTitle = 'Certificate_'+certificat.ItemNo+'.pdf';
                vueInst.pdfBase64 = 'data:application/pdf;base64,'+ certificat.Certificate+'#title='+vueInst.pdfTitle;
                vueInst.popupTitle = (vueInst.$t('message.certificate') as string)+' '+certificat.ItemNo;
                vueInst.isLoadingInvoice = false;   
            },

            downloadPDF(): void {
                const vueInst = this;
                const linkSource = vueInst.pdfBase64;
                const downloadLink = document.createElement("a");
                const fileName = vueInst.pdfTitle;
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            },
            changeWitdhPdf(op: string): void {
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

        },
        created: function(): void {
            this.getInvoice();
        }
    }
  </script>

  <style scoped lang="scss">
    .my_card{
    width: 90%;
    height: 90%;
    overflow-y: auto;
    }
    /* keep the title / download / close row in view while the PDF scrolls */
    .my_card > :first-child{
    position: sticky;
    top: 0;
    z-index: 2;
    background: white;
    }
    .my_card_2{
    width: 100%;
    height: 100%;
    }
    .my_card_3{
    width: 100%;
    height: 100%;
    margin-bottom: 1rem;
    }
    .my_card_4{
    width: 100%;
    height: 100%;
    margin-bottom: 1rem;
    padding: 8px;
    }
    .my_card_5{
    width: 70%;
    height: 70%;
    }
    .card_3{
        width: 500px;
    }
  </style>
  
  
  