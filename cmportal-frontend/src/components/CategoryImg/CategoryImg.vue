<template>
<div style="padding: 0.5rem;">
  <q-card class="inline shadow-box"  v-ripple flat bordered>
    <q-card-section>
      <!--<img :src="urlToJPG+'/'+category.pid" class="category__img" >-->
      <q-img
          transition="fade"
          :src="urlToJPG+'/'+category.pid"
          ratio="1"
          fit="scale-down"
          spinner-color="light-blue"
          class="rounded-borders category__img"
      >
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">
            Cannot load image
          </div>
        </template>
      </q-img>
    </q-card-section>
    <q-card-actions>
      <div class="flex__column--center"><span class="app__title--small">{{ $i18n.locale === 'ro' ? category.name_ro : $i18n.locale === 'en' ? category.name_en : category.name_bg }}</span></div>
    </q-card-actions>
  </q-card>
</div>
</template>

<script lang="ts" src="./CategoryImg.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.category__img{
  font-family: 'Roboto', sans-serif;
  font-weight: 100;
  cursor: pointer;

  @include media_small {
    max-width: 30vw;
    min-width: 30vw;
    width: auto;
    height: auto;
    border-radius: 3px;
  }

  @include media_medium {
    max-width: 15vw;
    min-width: 15vw;
    width: auto;
    height: auto;
    border-radius: 3px;
  }

  @include media_large {
    max-width: 15vw;
    min-width: 15vw;
    width: auto;
    height: auto;
    border-radius: 3px;
  }
}
</style>

