<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-lg ecran-container " style="font-family: 'Roboto', sans-serif;">

    <div style="display: flex;align-items: center;">
      <div v-if="$q.platform.is.desktop" class="app__page__title__container">
        <div style="white-space:nowrap;font-size:2rem;"><q-icon name="paid" style="font-size:2rem;position: relative;top: -3px;" color="primary" /> {{ $t('message.balance') }}</div>
      </div>
      <q-btn v-if="$q.platform.is.desktop" flat color="blue" :label="$t('message.download_balance_pdf')" no-caps icon="picture_as_pdf" :loading="downloadingFile" style="margin-left: auto;" @click="downloadBalantaPdf" />
    </div>

    <div v-if="existaBalanta" style="font-family: 'Roboto', sans-serif;size: 1.5rem; font-weight: bold;">
      <div>{{ $t('message.interval') }} 01.01.2026  - {{ currentDateAsString }}</div>
      <div>
        {{ $t('message.initial_amount') }} {{ balantaInNav.SoldInit }} EUR
      </div>


      <div class="grid-container">
        <div class="grid-item">{{ $t('message.total_credit') }} {{ balantaInNav.SumCredit }} EUR</div>
        <div class="grid-item">{{ $t('message.amount_credit') }} {{ balantaInNav.SoldCredit }} EUR</div>
        <div class="grid-item">{{ $t('message.total_debit') }} {{ balantaInNav.SumDebit }} EUR</div>
        <div class="grid-item">{{ $t('message.amount_debit') }} {{ balantaInNav.SoldDebit }} EUR</div>
      </div>
    </div>
    <q-btn v-if="$q.platform.is.mobile" flat color="blue" :label="$t('message.download_balance_pdf')" no-caps icon="picture_as_pdf" :loading="downloadingFile" @click="downloadBalantaPdf" />
    <div v-if="existaBalanta" class="q-pa-md">
      <q-table
          :grid="$q.platform.is.mobile"
          class="my-sticky-header-table"
          title=""
          :rows-per-page-options="[0]"
          v-model:pagination="pagination"
          :rows="balantaInNav.CustLedgerEntry"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="name"
          flat
          bordered
      >
      <template v-slot:item="props">
          <q-card class="my_card_3" :style="{'background-color': props.row.isInvoiceOverdue ? '#DAF3F3':'white'}">
            <q-list dense>              
              <q-item :key="col.name"
                      v-for="col in props.cols">
                  <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                      <q-item-label>{{ col.value }}</q-item-label>
                  </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </template>
    </q-table>
      </div>
<!--
    <div class="q-pa-md">
      <div v-for="(document,index) in balantaInNav.CustLedgerEntry" :key="index" class="factura__div" >
        <div class="factura__data" style="grid-area: factura_data; ">{{document.DocumentType}}</div>
        <div class="factura__data" style="grid-area: factura_data; ">{{document.DocumentNo}}</div>
        <div class="factura__data" style="grid-area: factura_data; ">{{document.DocumentDate}}</div>
        <div class="factura__valoare" style="grid-area: factura_valoare;">{{document.DebitAmount}} lei</div>
        <div class="factura__valoare" style="grid-area: factura_valoare;">{{document.CreditAmount}} lei</div>
      </div>
    </div>
-->
  </div>
</template>

<script lang="ts" src="./Balanta.ts" />

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

.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  padding: 0.5rem;
}
.grid-item {
  padding: 0.5rem;
  text-align: center;

  @include media_small {
    font-size: 0.8rem;
  }

  @include media_medium {
    font-size: 1rem;
  }

  @include media_large {
    font-size: 1.1rem;
  }
}

.my_card_3{
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
}
</style>
