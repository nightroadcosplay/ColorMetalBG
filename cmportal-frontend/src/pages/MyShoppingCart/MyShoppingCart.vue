<template>
  <div class="q-pa-sm ecran-container " style="font-family: 'Roboto', sans-serif;">
    <div>
    <div style="display: flex;">
      <div v-if="$q.platform.is.desktop" class="app__color--label q-ma-md " >
        <span style="white-space:nowrap;font-size:2rem;"><q-icon name="shopping_cart" style="font-size:2rem;top: -3px;" color="primary" /> {{ $t('message.my_basket') }}</span>
      </div>
      
    </div>
    <div v-if="basket.length ==0" class="app__label--medium app__color--semigray" style="padding-top:5rem;">
      {{ $t('message.no_basket') }}
    </div>
    <div class="q-pa-md" v-else>
      <span style="color:black;font-weight: bold;">{{ $t('message.items_in_basket') }}: {{ basket.length }}<br></span>
      <br>
      <div v-for="(item, index) in basket" :key="item.appid" class="produs_div" >
        <q-linear-progress v-if="item.appid==appidToBeRemovedFromBasket" indeterminate color="secondary" style="position:absolute;" />
        <q-linear-progress v-if="item.appid==appidToBeTogglesWithFavorites" indeterminate color="secondary" style="position:absolute;" />
        
            
        <div class="produs_img" style="display: flex;flex-direction: row;">
          <div style="display: flex;align-items: center;flex-direction: column;gap: 2px;">
            <q-btn flat icon="arrow_drop_up" @click="moveUP(index)"></q-btn>
            <q-item-label>{{index+1}}</q-item-label>
            <q-btn flat icon="arrow_drop_down" @click="moveDown(index)"></q-btn>
          </div>
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
        <div class="produs_detalii" >
          <span class="app__property--medium">{{$i18n.locale === 'ro' ? item.productNameRO : $i18n.locale === 'en' ? item.productNameEN : item.productNameBG}}</span>
          <!--<span class="app__color--blue" style="font-weight: bold;">Cod:{{item.productCode}}</span>-->
          <span class="app__color--semigray" style="font-weight: lighter;">
            <span v-if="item.l">{{$t('message.length')}} {{item.l}} mm </span>
            <span v-if="item.w">{{$t('message.width')}} {{item.w}} mm </span>
            <span v-if="item.t">{{$t('message.thickness')}} {{item.t}} mm </span>
            <span v-if="item.d">{{$t('message.diameter')}} {{item.d}} mm </span>
            <span v-if="item.h">{{$t('message.height')}} {{item.h}} mm </span>
            <span v-if="item.a">{{$t('message.aliaj')}} {{item.a}} </span>
            <span v-if="item.k">{{$t('message.type')}} {{typeLabel(item.k)}}  </span>
          </span>
          <span v-if="item.dorescDebitare" class="app__color--semigray" style="font-weight: lighter;">
            {{item.qBuc}} {{$t('message.cutted_nr')}} <span v-if="item.cuttingLength">{{$t('message.length')}} {{item.cuttingLength}} mm </span><span v-if="item.cuttingWidth"> {{$t('message.width')}} {{item.cuttingWidth}} mm </span>
          </span>
          <span v-if="item.observatii" class="app__color--semigray" style="font-weight: lighter; font-style: italic;">{{ $t('message.remarks') }}: {{ item.observatii }}</span>
        </div>
        <div class="app__property--medium">
          <div v-if="showQtyUm1(item)">{{item.qUm1}} {{$umLabel(item.um1)}}</div>
          <div v-if="item.um2 && item.um2.length>0 && (item.tip_um == 'um12' || item.tip_um == 'um2')">{{item.qUm2}} {{$umLabel(item.um2)}}</div>
        </div>
        <!--<div >{{item.q_um_base}} Kg</div>-->
        <div  class="shopping_cart__container--btns" >
          <q-btn color="red" flat  @click="removeArticleFromShoppingCart(item)" no-caps no-wrap dense  >
            <q-icon left name="delete_forever" />
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              {{ $t('message.delete_basket') }}
            </q-tooltip>
          </q-btn>

          <!-- <q-btn icon="edit" color="green" flat no-caps dense style="margin-right: 1em;">
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              Editeaza articolul in coș
            </q-tooltip>
            <q-popup-proxy>
              <q-banner>
                <EditQuantityArticleCerere :item="item" :index="index" :onEditItem="onEditItem"/>
              </q-banner>
            </q-popup-proxy>
          </q-btn> -->

          <q-btn flat color="blue"  no-caps no-wrap dense @click="toggleArticleInFavorites(item)">
            <q-icon v-if="item.isInFavorite" left name="favorite" color="primary"/><q-icon v-else left name="favorite_border" color="blue"/>
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              <span v-if="item.isInFavorite">{{ $t('message.item_in_favorite_remove') }}</span><span v-else>{{ $t('message.add_to_favorite') }}</span>
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <br>
      <span style="color:black;font-weight: bold;">{{ $t('message.delivery_details') }}:<br></span>
      <br>
      <div :class="$q.platform.is.mobile ? 'div_card_mobile' : 'div_card_desktop'">
        <q-input outlined  v-model="nrComandaCerere" :label="$t('message.request_no')" counter maxlength="20" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width: 200px;'"/>
        <q-input outlined v-model="termenCerere"  mask="##.##.####"
                :label="$t('message.delivery_term')"
                :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'"
                :input-style="{ fontWeight: 'bolder' }"
        >
          <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
            <q-date v-model="termenCerere" mask="DD.MM.YYYY"  @update:model-value="() => $refs.qDateProxy0.hide()" :locale="myLocale" :options="optionsDataViitor" />
          </q-popup-proxy>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer"></q-icon>
          </template>
        </q-input>
        <div style="display: flex;flex-direction: row;">
          <q-select
              outlined
              :label="$t('message.delivery_address')"
              v-model="slidAdresaLivrare"
              option-value="slid"
              option-label="adresaAdresa"
              :options="adrese"
              emit-value
              map-options
              options-selected-class="text-deep-orange"
              :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label :caption="scope.opt.isNewAddress == '1'">{{ scope.opt.adresaLocalitate }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.adresaAdresa }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- <q-btn v-if="!dialogAdresa" square color="blue" icon="add" style="height: 1rem;width: 1rem;margin-left: 4px;margin-top: 8px;" @click="onOpenFormAddNewAdresa()"/> -->
        </div>
      </div>
      <br>
      <div style="display: flex;flex-direction: column;">
        <div style="color:black;font-weight: bold;margin-bottom: 8px;">{{$t('message.remarks')}} :</div>
        <q-input maxlength="250" type="textarea" autogrow counter class="input--desire" outlined v-model="inputFreeTextComments" :placeholder="$t('message.new_request_details')" dense color="blue-grey-7" />
      </div>
      <br>
      <q-btn v-if=" basket.length>0" color="blue" :label="$t('message.send_offer_request')" no-caps @click="trySendBasketForAnOffer" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width: 200px;float:right;'"/>
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

<script lang="ts" src="./MyShoppingCart.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  @include media_small {
    padding-left: 2vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 5vh;
    padding-left: 2vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    padding-left: 2vw;
    padding-right: 2vw;
    background-color: white;
  }
}

.produs_div {
  position: relative;
  @include media_small {
    display: grid;
    grid-template-columns: 1fr 5fr;
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr 1fr;
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr 1fr;
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
    font-size: 0.7rem;
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

.shopping_cart--img{

  @include media_small {
    width: 4rem;
  }

  @include media_medium {
    width: 5rem;
  }

  @include media_large {
    width: 7rem;
  }
}

.div_card_mobile {
  display:flex;
  justify-content: space-between; 
  width:100%; 
  flex-direction: column;
  gap: 1rem;
}

.div_card_desktop {
  display:flex;
  justify-content: space-between; 
  width:100%; 
  gap: 1rem;
}

</style>
