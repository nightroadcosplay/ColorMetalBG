<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-lg ecran-container" style="font-family: 'Roboto', sans-serif;">

    <div style="display: flex;align-items: left;justify-content: left;">
      <div v-if="$q.platform.is.desktop" class="app__page__title__container">
        <div style="white-space:nowrap;font-size:2rem;"><q-icon name="paid" style="font-size:2rem;position: relative;top: -3px;" color="primary" /> {{ $t('message.invoices') }}</div>
      </div>
    </div>

    <div style="font-family: 'Roboto', sans-serif;size: 1.5rem; " class="q-pa-md">
      <div style="padding: 5px;">
        {{ $t('message.total_remaining_payment') }}: &nbsp;<b>{{ totalRestDePlata }} EUR</b>
      </div>
      <div style="padding: 5px;">
        {{ $t('message.balance_due') }}: &nbsp;<span style="color:red; "><b>{{ totalScadenta }} EUR</b></span>
      </div>
    </div>

    <div class="q-pa-md" :style="$q.platform.is.mobile ? 'display: flex;flex-direction: column;gap: 2px' : 'display: flex;flex-direction: row;gap: 2px'">
      <q-btn icon="restart_alt" flat @click="refreshFilters()">
        <q-tooltip
                  anchor="top middle" self="bottom middle" :offset="[10, 10]"
                  transition-show="scale"
                  transition-hide="scale"
              >
          {{ $t('message.sterge_filtre') }}
        </q-tooltip>
      </q-btn>
      <q-input outlined v-model="filters.id.value" :label="$t('message.doc_no')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()"/>
      <q-input outlined mask="####-##-##" v-model="filters.data.value" :label="$t('message.doc_date')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()">
        <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
            <q-date v-model="filters.data.value" mask="YYYY-MM-DD"  @update:model-value="(val) => updateData(val)" :locale="myLocale"/>
          </q-popup-proxy>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer"></q-icon>
          </template>
      </q-input>
      <q-input outlined  v-model="filters.valoare.value" :label="$t('message.value')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()"/>
      <q-input outlined  v-model="filters.moneda.value" :label="$t('message.currency')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()"/>
      <q-input outlined mask="####-##-##" v-model="filters.dataScadenta.value" :label="$t('message.due_date')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()">
        <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
            <q-date v-model="filters.dataScadenta.value" mask="YYYY-MM-DD"  @update:model-value="(val) => updateDataScadenta(val)" :locale="myLocale" />
          </q-popup-proxy>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer"></q-icon>
          </template>
      </q-input>
      <q-input outlined  v-model="filters.restDeAchitat.value" :label="$t('message.balance_due')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()"/>
      <q-input outlined  v-model="filters.nrZileDepasireTermenPlata.value" :label="$t('message.payment_overdue_days')" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'" @change="searchInvoices()"/>
    </div>
    <div v-if="existaFacturi" class="q-pa-md">
      <q-table
          :grid="$q.platform.is.mobile"
          class="my-sticky-header-table"
          title=""
          :rows-per-page-options="[0]"
          v-model:pagination="pagination"
          :rows="invoices"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="name"
          flat
          bordered
      >
      
        <template v-slot:body="props">
          <q-tr :props="props" :style="{'background-color': props.row.isInvoiceOverdue ? '#DAF3F3':'white'}">
            <q-td key="id" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{props.row.id}}
            </q-td>
            <q-td key="data" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{ props.row.data }}
            </q-td>
            <q-td key="valoare" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{ props.row.valoare }}
            </q-td>
            <q-td key="moneda" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{ props.row.moneda }}
            </q-td>
            <q-td key="dataScadenta" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{ props.row.dataScadenta }}
            </q-td>
            <q-td key="restDeAchitat" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{ props.row.restDeAchitat }}
            </q-td>
            <q-td key="nrZileDepasireTermenPlata" :props="props" v-bind:class="{'redbold': props.row.isInvoiceOverdue }">
              {{ props.row.nrZileDepasireTermenPlata }}
            </q-td>
            <q-td key="vizualizarePDF" :props="props">
              <q-btn flat color="primary"  align="center" icon="picture_as_pdf" style="min-width: 4rem;" @click="download_invoice(props.row.id)"/>
            </q-td>
            <q-td key="vizualizarePDFCertificate" :props="props">
              <q-btn flat color="primary"  align="center" icon="picture_as_pdf" style="min-width: 4rem;" @click="download_certificate(props.row.id)"/>
            </q-td>
            <!-- <template v-slot:body-cell-actions="props">
              <q-td key="vizualizarePDF" :props="props">
                <q-btn flat color="primary"  align="left" icon="picture_as_pdf" style="min-width: 7rem;" @click="download_invoice(props.row.id)"/>
              </q-td>
            </template> -->
          </q-tr>
        </template>

        <template v-slot:item="props">
          <q-card class="my_card_3" :style="{'background-color': props.row.isInvoiceOverdue ? '#DAF3F3':'white'}">
            <q-list dense>              
              <q-item :key="col.name"
                      v-for="col in props.cols.filter(col => { return !col.name.includes('vizualizare')})">
                  <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                      <q-item-label v-bind:class="{'redbold': props.row.isInvoiceOverdue }">{{ col.value }}</q-item-label>
                  </q-item-section>
              </q-item>
            </q-list>
            <!-- <q-separator></q-separator> -->
            <q-card-actions>
              <q-btn flat color="primary" :label="$t('message.invoice')" icon="picture_as_pdf" @click="download_invoice(props.row.id)"/>
              <q-btn flat color="primary" :label="$t('message.certificates')" icon="picture_as_pdf" @click="download_certificate(props.row.id)"/>
            </q-card-actions>
          </q-card>
        </template>
      </q-table>
    
      <q-dialog v-model="fixed" full-width>
        <q-card class="my_card">
          <q-card-section class="row items-center" >
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

      <q-dialog v-model="areMoreCertificates" maximized>
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
  </div>
</template>

<script lang="ts" src="./Facturi.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  @include media_small {
    padding-left: 3vw;
    padding-right: 3vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 2vh;
    padding-left: 2vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 2vh;
    padding-left: 2vw;
    padding-right: 2vw;
    background-color: white;
  }
}

.alerta_depasire{
  @include media_small {
    display: flex;
    flex-direction: row;
  }

  @include media_medium {
    display: flex;
    flex-direction: column;
  }

  @include media_large {
    display: flex;
    flex-direction: column;
  }
}

.dashboard__div__title{
  @include media_small {
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
  }

  @include media_medium {
    font-size: 1.1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  @include media_large {
    font-size: 1.2rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

.factura__div {
  @include media_small {
    display: grid;
    align-items: center;
    grid-template-areas:
    'factura_id      factura_data'
    'factura_valoare factura_valoare'
    'factura_rest    factura_rest'
    'factura_alert   factura_alert';
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 2px solid rgba(223, 230, 237, 0.82);
    padding-top: 0.5rem;
    padding-bottom: 1rem;
  }

  @include media_medium {
    background-color: white;
    min-width: 70vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 2px solid rgba(223, 230, 237, 0.82);
  }

  @include media_large {
    background-color: white;
    min-width: 60vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 2px solid rgba(223, 230, 237, 0.82);
  }
}

.factura__id{
  font-weight: 600;
  color: #027BE3;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 1rem;
  }

  @include media_medium {
    font-size: 1rem;
  }

  @include media_large {
    font-size: 1.1rem;
  }
}

.factura__data{
  font-weight: 600;
  color: deepskyblue;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 1rem;
  }

  @include media_medium {
    font-size: 1rem;
  }

  @include media_large {
    font-size: 1.1rem;
  }
}

.factura__valoare{
  font-weight: 600;
  color: black;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 1rem;
  }

  @include media_medium {
    font-size: 1rem;
  }

  @include media_large {
    font-size: 1.1rem;
  }
}

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
.my_card_6{
  width: 300%;
  height: 300%;
}


.redbold{
  color: red;
  font-weight: bold;
}

.pdf_icon {
  width: 40px;
}
</style>
