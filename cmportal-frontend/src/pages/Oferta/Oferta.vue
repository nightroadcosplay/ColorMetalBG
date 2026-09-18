<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div class="ecran-container">
  <q-bar v-if="$q.platform.is.desktop" class="page__bar">
    <q-btn dense flat icon="arrow_back" color="black" size="md" @click="onBack">
      <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
    </q-btn>
    <q-space />
    <div class="page__bar--title">{{pageTitle}}</div>
    <q-space />
  </q-bar>
  <div v-if="showBrowseArticles">
    <BrowseCategories v-if="!pidForBrowseCategoryHasArticles" :pid="pidForBrowseCategory" :typeOfAccess="'fromOferta'"/>
    <BrowseArticles v-if="pidForBrowseCategoryHasArticles" :pidCategory="pidForBrowseCategory" :typeOfAccess="'fromOferta'" />
  </div>
  <div  v-else >
          <div style="display: flex; flex-direction: row;align-items: center;gap: 1rem;cursor: pointer;">
            <q-btn icon="event_repeat" :label="$t('message.repeat_offer_for_new_request')" color="blue" no-caps @click="repetaCerere" style="margin-top:1rem;" />
          </div>
          <br>
          <div :class="$q.platform.is.mobile ? 'div_card_mobile' : 'div_card_desktop'">
            <q-input outlined  v-model="nrComandaCerere" :label="changedItemsInOffer ? $t('message.request_no') : $t('message.order_no')" counter maxlength="20" :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'"/>
            <q-input v-if="changedItemsInOffer" outlined v-model="termenCerere"  mask="####-##-##"
                     :label="$t('message.delivery_term')"
                     :style="$q.platform.is.mobile ? 'width: 100%;' : 'width:clamp(200px, 40vw, 400px);'"
                     :input-style="{ fontWeight: 'bolder' }"
            >
              <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
                <q-date v-model="termenCerere" mask="YYYY-MM-DD"  @update:model-value="() => $refs.qDateProxy0.hide()" :locale="myLocale" :options="optionsDataViitor" />
              </q-popup-proxy>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer"></q-icon>
              </template>
            </q-input>
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
            
          <q-btn v-if="!changedItemsInOffer" :disable="changedItemsInOffer" flat color="primary" align="center" no-caps :label="$t('message.BG')" icon="picture_as_pdf" :loading="downloadingFile" style="min-width: 4rem; max-width: 4rem;" @click="generareOfertaPDFRO"/>
          <q-btn v-if="!changedItemsInOffer" :disable="changedItemsInOffer" flat color="primary" align="center" no-caps :label="$t('message.ENG')" icon="picture_as_pdf" :loading="downloadingFile" style="min-width: 4rem; max-width: 4rem;" @click="generareOfertaPDFENG" />  
        </div>
        <br>
        <div v-if="changedItemsInOffer" style="display: flex;flex-direction: column;">
          <div style="color:black;font-weight: bold;margin-bottom: 8px;">{{$t('message.remarks')}} :</div>
          <q-input maxlength="250" type="textarea" autogrow counter class="input--desire" outlined v-model="inputFreeTextComments" :placeholder="$t('message.new_request_details')" dense color="blue-grey-7" />
        </div>
        <div v-else style="display: flex;flex-direction: column;">
          <div style="color:black;font-weight: bold;margin-bottom: 8px;">{{$t('message.remarks')}} :</div>
          <q-input maxlength="250" type="textarea" autogrow counter class="input--desire" outlined v-model="inputFreeTextComments" :placeholder="$t('message.order_details')" dense color="blue-grey-7" />
        </div>
        <br>
        <!-- </q-card-section>
        <q-card-section style="display: flex;justify-content: flex-end;">
          <q-btn color="blue" label="Cere oferta" no-caps @click="trySendCerereForAnOffer" />
        </q-card-section>

      </q-card> -->
    <!-- </q-expansion-item> -->
    <br>
    <span v-if="offerHeader.status=='k'" class="app__property--medium" style="display: flex;justify-content: flex-start;">{{$t('message.comanda_trimisa_la_data')}} {{offerHeader.trackDateAccept.substr(0,10)}} {{$t('message.ora')}} {{oraAcceptOffer}} </span>
    <div v-if="!changedItemsInOffer" class="header__container">
      <div style="display: grid;grid-template-columns: 1fr 1fr;" class="header__text">
        <span>{{$t('message.nr_pozitii')}}</span> <span style="text-align: right;">{{productsFromSales.length}}</span>
        <span>{{$t('message.cantitate_totala')}}</span> <span style="text-align: right;">{{ Number(offerHeader.qKg).toFixed(2) }} {{$t('message.kg')}}</span>
        <div v-if="offerHeader.status=='o'"><span>{{$t('message.offer_validity')}}</span> 
              <span v-if="new Date(offerHeader.dateWhenOfferExpire) < new Date()" class="app__text__alert--small app__color--orange" style="padding-left: 1rem;">{{$t('message.oferta_expirata_solicitati_o_oferta_noua')}}</span>
              <span v-else class="app__text__alert--small app__color--orange" style="padding-left: 1rem;">{{$t('message.expira')}} {{timeUntilFutureDate(offerHeader.dateWhenOfferExpire,'YYYY-MM-DD HH:mm')}}</span>
            </div>
        
      </div>
      <div style="display: grid;grid-template-columns: 1fr 1fr;" class="header__text">
        <span>{{$t('message.valoare_fara_tva')}}</span><span style="text-align: right;">{{ valFaraTVA.toFixed(2)}} {{offerHeader.idValuta}}</span>
        <span>{{$t('message.disc_linii')}}</span><span style="text-align: right;">-{{discLinii.toFixed(2)}} {{offerHeader.idValuta}}</span>
        <span>{{$t('message.disc_oferta')}}</span><span style="text-align: right;">-{{discOferta.toFixed(2)}} {{offerHeader.idValuta}}</span>
        <span>{{$t('message.total_fara_tva')}}</span><span style="text-align: right;">{{totalFaraTVA.toFixed(2)}} {{offerHeader.idValuta}}</span>
        <span>{{$t('message.total_tva')}}</span><span style="text-align: right;">{{valTVA.toFixed(2)}} {{offerHeader.idValuta}}</span>
        <span>{{$t('message.total')}}</span><span style="text-align: right;">{{totalVal.toFixed(2)}} {{offerHeader.idValuta}}</span>
      </div>
    </div>

    <div style="display: flex;justify-content: flex-end;padding-bottom:1rem;">
      <q-btn v-if="offerHeader.status=='o' && !isOfferExpired && !changedItemsInOffer" color="blue" size="sm" unelevated  icon-right="send" :label="$t('message.send_order')" @click="sendAcceptForOffer"/>
      <q-btn v-if="changedItemsInOffer" color="blue" :label="$t('message.request_new_offer')" no-caps @click="trySendCerereForAnOffer"/>
    </div>
    <div style="background-color: white;">
      <div v-for="(item,index) in productsFromSales" :key="item.appid" class="product__container">
        <div style="grid-area: img;display: flex;flex-direction: row;">
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
          <span class="app__property--medium">{{item.productName}}</span>
          <!-- <span>{{chainCategories(item.categoryPid)}}</span> -->
          <div style="display: flex;flex-direction: column;">
          <span v-for="categ in chainCategories(item.categoryPid)" :key="categ.pid" class="app__property--small" style="font-weight: lighter;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{categ.lantHierarchyCategories}}</span>
        </div>
          <span class="app__color--semigray" style="font-weight: lighter;">
            <span v-if="item.l">{{$t('message.length')}} {{item.l}} mm </span>
            <span v-if="item.w">{{$t('message.width')}} {{item.w}} mm </span>
            <span v-if="item.t">{{$t('message.thickness')}} {{item.t}} mm </span>
            <span v-if="item.d">{{$t('message.diameter')}} {{item.d}} mm </span>
            <span v-if="item.h">{{$t('message.height')}} {{item.h}} mm </span>
            <span v-if="item.a">{{$t('message.aliaj')}} {{item.a}} </span>
            <span v-if="item.k">{{$t('message.type')}} {{typeLabel(item.k)}}  </span>
          </span>
          <span v-if="item.cuDebitare && item.cuDebitare=='y'" class="app__color--semigray" style="font-weight: lighter;">
            {{item.nrBuc}} {{$t('message.cutted_nr')}} <span v-if="item.sizeLengthFromSales">{{$t('message.length')}} {{item.sizeLengthFromSales}} mm </span> <span v-if="item.sizeWidthFromSales"> {{$t('message.width')}} {{item.sizeWidthFromSales}} mm </span>
          </span>
          <span v-if="item.observatii" style="font-weight: bold; font-style: italic;color: red;">{{$t('message.remarks')}}: {{ item.observatii }}</span>
          <div>
            <div>
              <q-btn icon="edit" :label="$t('message.modificare_cantitate')" outline color="green" no-caps size="sm" style="margin-right: 1em;">
                <q-popup-proxy>
                  <q-banner>
                    <EditQuantityArticleCerere :item="ItemForEdit(item)" :index="index" :onEditItem="onEditItem"/>
                  </q-banner>
                </q-popup-proxy>
              </q-btn>
              <br v-if="$q.platform.is.mobile"/>
              <br v-if="$q.platform.is.mobile"/>
              <q-btn icon="delete_forever" :label="$t('message.sterge_articol')" outline color="red" size="sm" no-caps @click="removeArticle(index)" />
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; grid-area: quantity;">
          <div v-if="showQtyUm1(item)" style="min-width: 110px; min-height: 25px;">{{item.q1.toFixed(2)}} {{$umLabel(item.um1)}}</div>
          <div v-if="item.tip_um == 'um2' || item.tip_um == 'um12'"  style="min-width: 110px; min-height: 25px;">{{item.q2.toFixed(2)}} {{$umLabel(item.um2)}}</div>
          
          <span v-if="$q.platform.is.mobile && !item.itemChanged" style="min-width: 110px; min-height: 25px;">{{$t('message.total_amount')}}</span>
          <span v-if="$q.platform.is.mobile && !item.itemChanged" style="min-width: 110px; min-height: 25px;">{{$t('message.delivery_term')}}</span>
        </div>
        <div v-if="!item.itemChanged"  style="display: flex; flex-direction: column; grid-area: price;">
          <div v-if="item.tip_um == 'um1' || item.tip_um == 'um12'" class="app__money__value--large" style="min-width: 110px; min-height: 25px;">{{offerHeader.idValuta == 'RON' ? Number(item.pretMediuCalculatUM1RON).toFixed(2) 
                  : offerHeader.idValuta == 'EUR' ? Number(item.pretMediuCalculatUM1EUR).toFixed(2)  
                  : Number(item.pretMediuCalculatUM1HUF).toFixed(2) }} {{ offerHeader.idValuta }} / {{$umLabel(item.um1)}}</div>
          <div v-if="item.tip_um == 'um2' || item.tip_um == 'um12'" class="app__money__value--large" style="min-width: 110px; min-height: 25px;">{{offerHeader.idValuta == 'RON' ? Number(item.pretMediuCalculatUM2RON).toFixed(2) 
                  : offerHeader.idValuta == 'EUR' ? Number(item.pretMediuCalculatUM2EUR).toFixed(2) 
                  : Number(item.pretMediuCalculatUM2HUF).toFixed(2)}} {{offerHeader.idValuta}} / {{$umLabel(item.um2)}}</div>
          <div v-if="item.discount_proc > 0 && $q.platform.is.desktop" style="min-width: 110px; min-height: 25px;">-{{ item.discount_proc }} %</div>
          <span v-if="$q.platform.is.mobile && item.appid!='0'" class="app__money__value--large" style="min-width: 110px; min-height: 25px;">{{offerHeader.idValuta == 'RON' ? Number(item.valFinalaFaraTvaRON).toFixed(2) : offerHeader.idValuta == 'EUR' ? Number(item.valFinalaFaraTvaEUR).toFixed(2) : Number(item.valFinalaFaraTvaHUF).toFixed(2)}} {{ offerHeader.idValuta }}</span>
          <span v-if="$q.platform.is.mobile && item.appid!='0'" :class=" item.termenLivrare == offerHeader.termenLivrareSolicitat ? 'app__money__value--large' : 'text_termen_livrare'" style="min-width: 110px; min-height: 25px;">{{item.termenLivrare}}</span>
        </div>
        <div v-if="!$q.platform.is.mobile && item.appid!='0' && !item.itemChanged" style="display: flex; flex-direction: column; grid-area: value;">
          <span class="app__money__value--large">{{offerHeader.idValuta == 'RON' ? Number(item.valFinalaFaraTvaRON).toFixed(2) : offerHeader.idValuta == 'EUR' ? Number(item.valFinalaFaraTvaEUR).toFixed(2) : Number(item.valFinalaFaraTvaHUF).toFixed(2)}} {{ offerHeader.idValuta }}</span>
          <span>{{$t('message.delivery_term2')}}</span>
          <span :class=" item.termenLivrare == offerHeader.termenLivrareSolicitat ? 'app__money__value--medium' : 'text_termen_livrare'">{{item.termenLivrare}}</span>
        </div>
        <div v-if="item.discount_proc > 0 && $q.platform.is.mobile" style="min-width: 110px; min-height: 25px;grid-area: value;">-{{ item.discount_proc }} %</div>
      </div>
      <div class="app-center-content-horizontal">
        <q-btn icon="add_shopping_cart" :label="$t('message.add_item_request')" outline color="primary" no-caps @click="browseArticle" style="margin-top:1rem;" />
      </div>

    </div>
  </div>
  <q-dialog v-model="fixed" full-width>
    <q-card class="my_card" >
      <q-card-section class="row items-center">
        <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{$t('message.offer')}} {{offerHeader.offerSlid}}</div>
        <q-btn v-if="$q.platform.is.desktop" no-caps color="primary" v-ripple @click="downloadPDF" icon="download" style="margin-left: 1rem;cursor: pointer;">{{$t('message.download')}}</q-btn>
        <q-btn v-if="$q.platform.is.mobile" no-caps flat color="primary" icon="download" v-ripple @click="downloadPDF" style="cursor: pointer;"></q-btn>
        <q-space />
        <q-spinner v-if="isLoadingOffer"
              color="black"
              :size="$q.platform.is.mobile ? '1.5em' : '3em'"
            />
            <q-space v-if="isLoadingOffer"/>
            <q-btn v-if="$q.platform.is.desktop" icon="close" flat round dense v-close-popup/>
            <q-btn v-else icon="close" flat round dense v-close-popup @click="widthPdf=300"/>
          </q-card-section>
          <q-card-section v-if="$q.platform.is.mobile" class="my_card_2">
            <q-btn v-if="!isLoadingOffer" @click="changeWitdhPdf('in')" icon="zoom_in" style="margin-bottom: 8px;" :loading="clicked"></q-btn>
            <q-btn v-if="!isLoadingOffer" @click="changeWitdhPdf('out')" icon="zoom_out" style="margin-left: 10px;margin-bottom: 8px;" :loading="clicked"></q-btn>
            <br>
            <vue-pdf-embed :source="pdf" :width="widthPdf"/>
          </q-card-section>
          <q-card-section v-else class="my_card_2">
            <vue-pdf-embed :source="pdf"/>
          </q-card-section>
    </q-card>
  </q-dialog>
</div>
</template>

<script lang="ts" src="./Oferta.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  flex-direction: column;

  @include media_small {
    padding-left: 5vw;
    padding-right: 5vw;
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

.header__container{
  @include media_small {
    min-width:90vw;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 45vw 40vw;
  }

  @include media_medium {
    display: flex;
    justify-content: space-around;
    color:$property-color;
    font-size:0.9rem;
    font-weight: 600;
  }

  @include media_large {
    display: flex;
    justify-content: space-between;
    color:$property-color;
    font-size:0.9rem;
    font-weight: 600;
  }
}

.product__container{
  font-family: 'Roboto', sans-serif;
  border-top:1px solid #dddddd;
  border-bottom: 1px solid #DFE6ED;
  padding-top:1rem;
  padding-bottom:1rem;
  position: relative;
  @include media_small {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr 1fr 1ft;
    grid-template-areas: "img details details"
                         "quantity price value";
  }

  @include media_medium {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 10vw 40vw 10vw 10vw 10vw;
    grid-template-rows: 150px;
    grid-template-areas: "img details quantity price value";
  }

  @include media_large {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 150px 500px 150px 150px 150px;
    grid-template-areas: "img details quantity price value";
    grid-template-rows: 150px;
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
    grid-template-areas: "img details quantity price value";
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr 1fr;
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template-areas: "img details quantity price value";
  }

  @include media_large {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr 1fr;
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template-areas: "img details quantity price value";
  }
}

.header__text{

  @include media_small {
    font-family: 'PT Sans Narrow', sans-serif;
    color:$title-color;
    font-size:0.8rem;
    font-weight: 500;
  }

  @include media_medium {
    font-family: 'Roboto', sans-serif;
    color:$title-color;
    font-size:0.9rem;
    font-weight: 600;
  }

  @include media_large {
    font-family: 'Roboto', sans-serif;
    color:$title-color;
    font-size:1.1rem;
    font-weight: 600;
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
  gap: 1rem;
  width:100%; 
}

.page__bar{
  background: transparent;
  margin-bottom: 1rem;
}

.page__bar--title{
  color: #788896;
  font-size: 1.2rem;
  font-weight: 800;
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

.text_termen_livrare{
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 1rem;
  color: blue;
}
</style>

