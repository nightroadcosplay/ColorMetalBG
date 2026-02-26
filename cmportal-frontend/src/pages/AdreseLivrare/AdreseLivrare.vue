<template>
  <div class="q-pa-sm ecran-container ">

    <div v-if="$q.platform.is.desktop" style="display: flex;align-items: center; position: relative;">
      <div class="app__page__title__container">
        <span style="white-space:nowrap;font-size:2rem;"><q-icon name="local_shipping" style="font-size:2rem;margin-top: -3px;" color="primary" /> {{$t('message.delivery_addresses')}}</span>
      </div>
      <q-btn v-if="!dialogAdresa" square color="blue" icon="add" class="adresa_livrare--add--btn z-top" @click="onOpenFormAddNewAdresa()"/>
    </div>


    <div  class="dashboard__section" v-for="(adresa,index) in adrese" :key="adresa.appid">
      <div class="dashboard__div__title" :style="adresa.isNewAddress == '1' ? 'color:#C7C7C7' : 'color:black'">{{ $t('message.address2') }} {{ index+1 }} {{ adresa.isNewAddress == '1' ? ' - ' + $t('message.waiting_for_sales_approval') : '' }}</div>
      <div class="dashboard__div__content">
        <div class="dashboard__div__parameter" @click="onOpenFormAdresa(adresa)" :style="adresa.isNewAddress == '1' ? 'color:#C7C7C7;' : 'color:black'">
          {{ adresa.adresaAdresa }}, {{ adresa.adresaLocalitate }}, {{ adresa.denJudet }} {{ adresa.codTara }}
        </div>
      </div>
    </div>

    <q-dialog
        v-model="dialogAdresa"
        persistent
        :maximized="true"
        :transition-show="dialogTransitionShow"
        :transition-hide="dialogTransitionHide"
    >
      <q-card class="bg-white">
        <q-bar class="bg-white">

          <q-btn dense v-if="$q.platform.is.desktop" flat icon="arrow_back" color="black" v-close-popup>
            <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
          </q-btn>
          
          <q-space dense v-if="$q.platform.is.desktop" />
          <q-icon v-if="$q.platform.is.mobile"  name="arrow_back_ios" class="app__arrow--back" v-close-popup/>
          <div class="app__title--small" v-if="$q.platform.is.desktop" style="position: absolute;left: 50%;margin-left: -100px;">{{$t('message.delivery_address_details')}}</div>
          <div class="app__back__bar--title " v-if="$q.platform.is.mobile" style="position: absolute;left: calc(50% - 100px); top:10px;">{{$t('message.delivery_address_details')}}</div>
        </q-bar>

        <q-card-section>
          <NomEditAdresaLivrare :propAdresa="selectedAdresa" :closeHandler="closeFormEditAdresaLivrare"/>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts" src="./AdreseLivrare.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  @include media_small {
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 5vh;
    justify-content: center;
    padding-left: 2vw;
    padding-right: 2vw;
  }

  @include media_large {
    padding-top: 5vh;
    justify-content: center;
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

.dashboard__section{
  @include media_small {
  }

  @include media_medium {
    adding-top: 1rem;
    justify-content: center;
  }

  @include media_large {
    padding-top: 1.5rem;
    justify-content: center;
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
  font-weight: 100;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 0.9rem;
    color: $title-color;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  @include media_medium {
    font-size: 1rem;
    color: $title-color;
  }

  @include media_large {
    font-size: 1.1rem;
    color: $title-color;
  }
}

.dashboard__div__content {
  @include media_small {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  @include media_medium {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }

  @include media_large {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }
}

.adresa_livrare--add--btn{
  height: 2rem;
  width: 2rem;
  margin-left: auto;
  @include media_small {
    position: relative;
    top:-3rem;
    right:0rem;
  }

  @include media_medium {

  }

  @include media_large {

  }
}

.adresa_livrare--remove--btn{

  @include media_small {
    margin-left: auto;
    position: relative;
    top:-3rem;
  }

  @include media_medium {

  }

  @include media_large {

  }
}
</style>
