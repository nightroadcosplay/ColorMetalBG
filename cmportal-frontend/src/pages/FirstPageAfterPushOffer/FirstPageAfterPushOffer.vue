<template>
<div>
  <div v-if="pidOffer" class="q-pa-sm ecran-container " style="font-family: 'Roboto', sans-serif;">
    <q-icon name="check" color="blue" style="font-weight: bold;font-size:3rem;"/>
    <h6 class="text-blue">{{ $t('message.request_sent_successfully') }}</h6>
    <p class="app__color--semigray" style="padding-top:2rem;padding-bottom:2rem;">
      {{ $t('message.in_shortest_term') }}
    </p>
    <p class="app__label--large">
      <span>{{ $t('message.request_id') }} {{pidOffer}}</span>
    </p>
    <p class="app__label--medium" style="text-align: center;">
      {{ $t('message.consult_section') }}
    </p>
    <q-btn outline icon="shop" color="amber-9" :label="$t('message.offers_and_orders')" @click="onGoToOffers"/>
    <p class="app__color--gray" style="font-weight: bold;font-size:1.5rem;">
      {{ $t('message.thanks') }}
    </p>
  </div>
</div>
</template>

<script lang="ts" src="./FirstPageAfterPushOffer.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  @include media_small {
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 5vh;
    padding-left: 10vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    max-width: 90vw;
    background-color: white;
    margin:auto;
  }
}
</style>
