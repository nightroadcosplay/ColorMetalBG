<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div class="q-pa-lg ecran-container ">
  <q-banner v-if="showAlertDepasireTermenFacturi" dense inline-actions class="text-white bg-red q-ma-md" style="width: 100%; margin: 0 auto;cursor: pointer;" @click="onGoFacturi">
    {{$t('message.alerta_aveti_facturi_depasite')}} <b>{{$t('message.click_aici_pentru_vizualizare')}}</b>
    <template v-slot:action>
      <q-icon color="white" name="close" @click="closeAlertDepasireTermenFacturi" style="cursor: pointer;"/>
    </template>
  </q-banner>

  <div v-if="$q.platform.is.desktop" class="app__page__title__container">
    <div style="white-space:nowrap;font-size:2rem;"><q-icon name="dashboard" style="font-size:2rem;position: relative;top: -3px;" color="primary" /> {{$t('message.main_page')}}</div>
  </div>

  <div  class="dashboard__section">
    <div  class="dashboard__div__title">{{$t('message.activity')}}</div>
    <div class="dashboard__div__content">

      <div class="dashboard__div__parameter" v-ripple  @click="onGoCautaArticole">
        <q-icon name="category" color="primary" style="font-size:1.4rem;padding-right: 0.3rem;"/>
       {{$t('message.search_items')}}
      </div>

      <div class="dashboard__div__parameter" v-ripple @click="onGoArticoleFavorite">
        <q-icon name="favorite_border" color="red" style="font-size:1.4rem;padding-right: 0.3rem;"/>
        {{$t('message.favorite_items')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="onGoToOffers">
        <q-icon name="shop" style="font-size:1.4rem;padding-right: 0.3rem;"  />
        {{$t('message.offers')}}
        <q-badge color="red" class="badge__superscript--top" style="height: 1rem;margin-left: 8px;" v-if="userStore.countOferte>0">
          {{ userStore.countOferte }}
        </q-badge>
      </div>
    </div>
  </div>

  <div  class="dashboard__section">
    <div  class="dashboard__div__title">{{$t('message.financial_data')}}</div>
    <div class="dashboard__div__content">
      <div class="dashboard__div__parameter" v-ripple @click="onGoBalanta">
        <q-icon name="star_rate" color="primary" style="font-size:1.4rem;padding-right: 0.3rem;"/>
        {{$t('message.balance')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="onGoFacturi">
        <q-icon name="paid" style="font-size:1.4rem;padding-right: 0.3rem;"  />
        {{$t('message.invoices')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="onGoAlerte">
        <q-badge color="red-3" transparent class="badge__superscript--top" v-if="showAlertCount">
          {{ overdueInvoiceCount }}
        </q-badge>
        <q-icon name="warning_amber" color="red" style="font-size:1.4rem;padding-right: 0.3rem;" />
        {{$t('message.alerts')}}
      </div>
    </div>
  </div>

  <div  class="dashboard__section">
    <div  class="dashboard__div__title">{{$t('message.my_account')}}</div>
    <div class="dashboard__div__content">
      <div class="dashboard__div__parameter" v-ripple  @click="onGoDateCompanie">
        <q-icon name="account_balance" color="primary" style="font-size:1.4rem;padding-right:0.3rem;"/>
        {{$t('message.company_data')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="onGoUsersCompany">
        <q-icon name="people" style="font-size:1.4rem;padding-right: 0.3rem;"/>
        {{$t('message.users')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="onGoNomAdreseLivrare">
        <q-icon name="local_shipping" style="font-size:1.4rem;padding-right:0.3rem;"  />
        {{$t('message.delivery_addresses')}}
        <q-badge color="red" class="badge__superscript--top" style="height: 1rem;margin-left: 8px;" v-if="userStore.countAdrese>0">
          {{ userStore.countAdrese }}
        </q-badge>
      </div>
      <!-- <div class="dashboard__div__parameter" v-ripple @click="onGoDocumenteCompany">
        <q-icon name="description" color="primary" style="font-size:1.4rem;padding-right: 0.3rem;"/>
        DOCUMENTE
      </div> -->
    </div>
  </div>
  <div  class="dashboard__section">
    <div  class="dashboard__div__title">{{$t('message.info_util')}}</div>
    <div class="dashboard__div__content">
      <div class="dashboard__div__parameter" v-ripple @click="openLink('https://color-metal.ro/ro/tehnipedia')">
        <q-icon color="primary" style="font-size:1.4rem;padding-right: 0.3rem;"><img src="@/assets/tehnipedia.png"/></q-icon>
        {{$t('message.tehnipedia')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="openLink('https://color-metal.ro/ro/service-center')">
        <q-icon name="call" style="font-size:1.4rem;padding-right: 0.3rem;"/>
        {{$t('message.service_center')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="openLink('https://color-metal.ro/ro/calculator-greutate')">
        <q-icon style="font-size:1.4rem;padding-right:0.3rem;"><img src="@/assets/calculator.png"/></q-icon>
        {{$t('message.specific_weight_calculator')}}
      </div>
      <div class="dashboard__div__parameter" v-ripple @click="openLink('https://color-metal.ro/ro/harta-rute-de-distributie')">
        <q-icon color="primary" style="font-size:1.4rem;padding-right: 0.3rem;"><img src="@/assets/rute.png"/></q-icon>
        {{$t('message.rute_distributie')}}
      </div>
    </div>
  </div>

  <!--
  <div  class="dashboard__section">
    <ContacteleMeleColorMetal />
  </div>
  -->
</div>
</template>

<script lang="ts" src="./Dashboard.ts" />

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

.dashboard__section{
  @include media_small {
    padding-left: 7vw;
  }

  @include media_medium {
    padding-top: 1rem;
  }

  @include media_large {
    padding-top: 1.5rem;
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

.dashboard__div__parameter{
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  cursor: pointer;

  @include media_small {
    font-size: 0.9rem;
    color: $title-color;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
  }

  @include media_medium {
    font-size: 1rem;
    color: $title-color;
    padding-right: 3rem;
    min-width: 300px;
  }

  @include media_large {
    font-size: 1.1rem;
    color: $title-color;
    padding-right: 5rem;
    min-width: 300px;
  }
}

.dashboard__div__content {
  @include media_small {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  @include media_medium {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  @include media_large {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
}
</style>
