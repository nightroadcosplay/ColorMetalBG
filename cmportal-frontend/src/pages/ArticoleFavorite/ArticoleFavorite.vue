<template>
  <div class="q-pa-sm ecran-container " style="font-family: 'Roboto', sans-serif;">
  <div>
    <div style="display: flex;margin-right:auto; align-items: center;">
      <div v-if="$q.platform.is.desktop" class="app__color--label q-ma-md " >
        <span style="white-space:nowrap;font-size:2rem;"><q-icon name="favorite_border" style="font-size:2rem;top: -3px;" color="red" />{{$t('message.favorite_items')}}</span>
        &nbsp;&nbsp;&nbsp;
        <span style="color: #e8833a;">{{ favorites.length }} {{$t('message.items')}}</span>
      </div>
    </div>
    <div v-if="favorites.length ==0" class="app__label--medium app__color--semigray" style="padding-top:5rem;">
      {{$t('message.no_favorites')}}
    </div>

    <div class="q-pa-md container__all__products">
      <div v-for="item in favorites" :key="item.appid" class="produs_div" >
        <q-linear-progress v-if="item.appid==appidToBeRemovedFromFavorites" indeterminate color="secondary" style="position:absolute;" />
        <div class="produs_img" style="grid-area: image">
          <q-img
              transition="fade"
              :src="urlToJPG+'/'+getFirstCategory(item.categoryPid)"
              ratio="1"
              fit="scale-down"
              spinner-color="light-blue"
              class="rounded-borders shopping_cart--img shadow-1"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                {{$t('message.cannot_load_image')}}
              </div>
            </template>
          </q-img>
        </div>
        <div class="produs_detalii" style="grid-area: description">
          <span class="app__property--medium">{{$i18n.locale === 'ro' ? item.productNameRO : $i18n.locale === 'en' ? item.productNameEN : item.productNameBG}}</span>
          <span class="app__color--semigray" style="font-weight: bold;">
            <span v-if="item.l">{{$t('message.length')}} {{item.l}} mm </span>
            <span v-if="item.w">{{$t('message.width')}} {{item.w}} mm </span>
            <span v-if="item.t">{{$t('message.thickness')}} {{item.t}} mm </span>
            <span v-if="item.d">{{$t('message.diameter')}} {{item.d}} mm </span>
            <span v-if="item.h">{{$t('message.height')}} {{item.h}} mm </span>
            <span v-if="item.a">{{$t('message.aliaj')}} {{item.a}} </span>
            <span v-if="item.k">{{typeLabel(item.k)}} </span>
          </span>
          <div>
            <span v-if="item.um1 && item.qUm1>0" class="app__color--semigray" style="font-weight: lighter;">{{$t('message.my_quantity')}}: {{item.qUm1}} {{$umLabel(item.um1)}}</span>
            <span v-if="item.um2 && item.qUm2>0" class="app__color--semigray" style="font-weight: lighter;padding-left: 1rem;">{{item.qUm2}} {{$umLabel(item.um2)}}</span>
          </div>
          <span v-if="item.dorescDebitare" class="app__color--semigray" style="font-weight: lighter;">
            {{item.qBuc}} {{$t('message.cutted_nr')}} <span v-if="item.cuttingLength">{{$t('message.length')}} {{item.cuttingLength}} mm </span><span v-if="item.cuttingWidth"> {{$t('message.width')}} {{item.cuttingWidth}} mm </span>
          </span>
          <span v-if="item.observatii" class="app__color--semigray" style="font-weight: lighter; font-style: italic;">{{$t('message.remarks')}}: {{ item.observatii }}</span>
        </div>
        <!--<div >{{item.q_um_base}} Kg</div>-->
        <div  class="shopping_cart__container--btns" style="grid-area: btns;">
          <q-btn color="red" flat  @click="removeArticleFromFavorites(item)" no-caps no-wrap dense  >
            <q-icon left name="delete_forever" />
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              {{ $t('message.delete_favorite') }}
            </q-tooltip>
          </q-btn>
          <q-btn color="amber" flat  @click="addProductToBasket(item)" no-caps no-wrap dense  >
            <q-icon name="shopping_cart" color="amber">
              <q-tooltip
                  anchor="top middle" self="bottom middle" :offset="[10, 10]"
                  transition-show="scale"
                  transition-hide="scale"
              >
                {{ $t('message.add_in_basket') }}
              </q-tooltip>
            </q-icon>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" src="./ArticoleFavorite.ts" />

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
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }
}

.container__all__products {
  display: flex;
  flex-direction: column;
  margin:auto;

  @include media_small {
    background-color: white;
  }

  @include media_medium {

  }

  @include media_large {

    max-width:70vw;
  }
}

.produs_div {
  position: relative;
  @include media_small {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
    "image description description description description"
    "btns  btns        btns        btns        btns";
    grid-gap: 2px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas:
    "image description description description description btns";
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}


.produs_detalii{
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;

  @include media_small {
    justify-content: flex-start;
    font-size: 0.7rem;
    align-items: flex-start;
  }

  @include media_medium {
    font-size: 0.8rem;
  }

  @include media_large {
    font-size: 0.9rem;
  }
}

.shopping_cart__container--btns{
  display: flex;
  align-items: center;
  gap: 1rem;

  @include media_small {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
  }

  @include media_medium {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
  }

  @include media_large {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}
</style>
