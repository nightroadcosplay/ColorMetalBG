<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="ecran-container " style="font-family: 'Roboto', sans-serif;">
    <div style="display: flex;align-items: center;">
      <div v-if="$q.platform.is.desktop" class="app__color--label q-ma-md " >
        <span style="white-space:nowrap;font-size:2rem;"><q-icon name="shop" style="font-size:2rem;top: -3px" color="primary" /> {{ $t('message.requests_and_offers') }}</span>
      </div>
      <q-input v-if="offersHeaders.length >300" bottom-slots v-model="inputSearchOffer" dense style="margin-left: auto;">
        <template v-slot:append>
          <q-icon v-if="inputSearchOffer !== ''" name="close" @click="inputSearchOffer = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div v-if="offersHeaders.length ==0 && !loadingOffers" class="app__label--medium app__color--semigray" style="padding-top:5rem;">
      {{ $t('message.no_offers') }}
    </div>
    <div>
      <div v-for="offer in offersHeaders" :key="offer.offerId" class="offer_div"  v-bind:class="{ 'is--deleting': (offer.offerId==appidToBeDeleted) }">
        <q-linear-progress v-if="offer.offerId==appidToBeCancelled || offer.offerId==appidToBeRecalled" indeterminate color="secondary" style="position:absolute;" />
        <div class="first_line">
          <div class="app__property--medium" style="display:flex;flex-direction: column;">
            <span>{{ $t('message.id_offer') }} {{offer.offerId}}</span>
            <span class="app__human__time__period--small"  style="color: #7D7D7D;">{{offer.trackCreationDate}}</span>
            <span style="color: #7D7D7D;font-size: small;">{{offer.nume_utilizator}}</span>
          </div>
          <q-btn outline color="blue" size="sm" no-caps :label="$t('message.request_details')" @click="onOpenCerere(offer.offerId, offer.trackCreationDate, offer.nume_utilizator)" >
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              {{ $t('message.open_request') }}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="second_line">
          <div style="display:flex;align-items: center;">
            <div style="min-width: 2rem">
              <q-icon name="check_circle_outline" class="text-amber" style="font-size: 1.5rem;" v-if="offer.offerSlid && offer.status=='o'" />
              <q-icon name="check_circle_outline" class="text-green" style="font-size: 1.5rem;" v-if="offer.offerSlid && offer.status=='k'" />
            </div>
            <div class="app__property--medium">{{humanStatusOffer(offer.status)}}
              <span  v-if="offer.status=='p'" class="app__human__time__period--small" style="color: #7D7D7D;">- {{offer.trackCreationDate}}</span>
              <span  v-if="offer.offerSlid && offer.status=='o'" class="app__human__time__period--small" style="color: #7D7D7D;">- {{offer.trackDateOfertare}}</span>
              <span  v-if="offer.offerSlid && offer.status=='k'" class="app__human__time__period--small" style="color: #7D7D7D;">- {{offer.trackDateAccept}}</span>
            </div>

          </div>
          <div style="padding-left: 2rem; display:flex;">
            <span  v-if="offer.status=='p'" class="app__human__time__period--small" style="color: #7D7D7D;">{{ $t('message.requested_term') }}-{{timeDateHuman(offer.termenLivrareSolicitat,'YYYY-MM-DD')}}</span>
            <q-btn v-if="offer.offerSlid" outline no-caps color="blue" size="sm" :label="$t('message.offer') + ' ' + offer.offerSlid" @click="onOpenOferta(offer.offerId, offer.offerSlid, offer.trackDateOfertare, offer.nume_utilizator)" >
                                                          <q-tooltip
                                                              anchor="top middle" self="bottom middle" :offset="[10, 10]"
                                                              transition-show="scale"
                                                              transition-hide="scale"
                                                          >
                                                      {{ $t('message.open_offer') }}
                                                    </q-tooltip>
            </q-btn>
            <div  class="third_line" v-if="offer.offerSlid && offer.dateWhenOfferExpire && offer.status=='o'">
              <span v-if="new Date(offer.dateWhenOfferExpire) < new Date()" class="app__text__alert--small app__color--orange" style="padding-left: 1rem;">{{ $t('message.offer_expired') }}</span>
              <span v-else class="app__text__alert--small app__color--orange" style="padding-left: 1rem;">{{$t('message.expira')}} {{timeUntilFutureDate(offer.dateWhenOfferExpire,'YYYY-MM-DD HH:mm')}}</span>
            </div>
          </div>
        </div>
        <div :class="$q.platform.is.desktop ? 'fourth_line' : 'fifth_line'">
          <div style="display:flex;align-items: center;flex-direction: column;max-width: 35%;">
            <div style="display:flex;align-items: center;">
              <q-btn :disable="offer.status=='p' || offer.status=='c'" flat align="center" no-caps @click="generareOfertaPDFRO(offer.offerSlid)">
                <q-icon name="picture_as_pdf" color="primary" />
                <div class="text" style="color:grey">{{ $t('message.confirmation') }} BG</div>
              </q-btn>
            </div>
          </div>
          <div style="display:flex;align-items: center;flex-direction: column;max-width: 35%;">
            <div style="display:flex;align-items: center;">
              <q-btn :disable="offer.status=='p' || offer.status=='c'" flat align="center" no-caps @click="generareOfertaPDFENG(offer.offerSlid)">
                <q-icon name="picture_as_pdf" color="primary" />
                <div class="text" style="color:grey">{{ $t('message.confirmation') }} ENG</div>
              </q-btn> 
            </div>
          </div>
          <div style="display:flex;align-items: center;flex-direction: column;max-width: 35%;">
            <div style="display:flex;align-items: center;">
              <q-btn :disable="offer.status=='p' || offer.status=='c'" flat align="center" no-caps style="min-width: 4rem; max-width: 4rem;" @click="generateFacturi(offer)">
                <q-icon name="picture_as_pdf" color="primary" />
                <div class="text" style="color:grey">{{ $t('message.invoices') }}</div>
              </q-btn>
            </div>
          </div>
          <div style="display:flex;align-items: center;flex-direction: column;max-width: 35%;">
            <div style="display:flex;align-items: center;">
              <q-btn :disable="offer.status=='p' || offer.status=='c'" flat align="center" no-caps style="min-width: 4rem; max-width: 4rem;" @click="generareCertificate(offer)">
                <q-icon name="picture_as_pdf" color="primary" />
                <div class="text" style="color:grey">{{ $t('message.certificates') }}</div>
              </q-btn>
            </div>
          </div>
        </div>
        <div  class="shopping_cart__container--btns btns_line">
          <!--<q-icon style="cursor: pointer;font-size: 1.5rem;margin-right:2rem;" name="rule" color="amber"  >
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              Accepta oferta
            </q-tooltip>
          </q-icon>
          -->
          <q-icon v-if="offer.status!='k'" style="cursor: pointer;font-size: 1.5rem;color:red;" name="delete_forever" @click="askCancelOffer(offer.offerId)" >
            <q-tooltip
                anchor="top middle" self="bottom middle" :offset="[10, 10]"
                transition-show="scale"
                transition-hide="scale"
            >
              {{ $t('message.cancel_request') }}
            </q-tooltip>
          </q-icon>
        </div>
      </div>
    </div>

    <q-dialog v-model="fixed" full-width>
      <q-card class="my_card" >
        <q-card-section class="row items-center">
          <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ popupTitle }}</div>
          <q-btn v-if="$q.platform.is.desktop" no-caps color="primary" v-ripple @click="downloadPDF" icon="download" style="margin-left: 1rem;cursor: pointer;">{{ $t('message.download') }}</q-btn>
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

    <q-dialog v-model="areMoreCertificates" maximized>
        <q-card class="my_card_5">
          <q-card-section class="row items-center">
            
            <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ popupTitle }}</div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <q-list dense>              
                <q-item v-for="(certificat, index) in certificates" :key="certificat.ItemNo">
                  <q-card v-if="$q.platform.is.mobile" class="my_card_4" >
                    <q-item-section>
                        <q-item-label><b>{{$t('message.item_no')}}: </b></q-item-label>
                    </q-item-section>
                    <q-item-section >
                        <q-item-label caption>{{ certificat.ItemNo }}</q-item-label>
                    </q-item-section>
                    <br>
                    <q-item-section>
                        <q-item-label><b>{{$t('message.description')}}: </b></q-item-label>
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

      <q-dialog v-model="areMoreInvoices" maximized>
        <q-card :class="$q.platform.is.mobile ? 'my_card_5' : 'my_card_6'">
          <q-card-section class="row items-center">
            
            <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ popupTitle }}</div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <q-list dense>              
                <q-item v-for="invoice in selectedInvoices" :key="invoice.id">
                  <q-card v-if="$q.platform.is.mobile" class="my_card_4" >
                    <q-item-section>
                        <q-item-label><b>{{ $t('message.invoice') }}: </b></q-item-label>
                    </q-item-section>
                    <q-item-section >
                        <q-item-label caption>{{ invoice.id }}</q-item-label>
                    </q-item-section>
                    <q-card-actions vertical>
                      <q-btn flat color="primary" icon="picture_as_pdf" @click="download_invoice(invoice.id)"/>
                    </q-card-actions>
                  </q-card>
                  <q-item-section v-if="$q.platform.is.desktop" no-wrap>
                        <q-item-label><b>{{ $t('message.invoice') }}:</b> {{ invoice.id }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="$q.platform.is.desktop" class="pdf_icon">
                      <q-btn flat color="primary" icon="picture_as_pdf" @click="download_invoice(invoice.id)"/>
                    </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
      </q-dialog>

      <q-dialog v-model="areMoreInvoicesCertificate" maximized>
        <q-card :class="$q.platform.is.mobile ? 'my_card_5' : 'my_card_6'">
          <q-card-section class="row items-center">
            
            <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ $t('message.certificates') }} {{ $t('message.offer') }} {{ selectedOfferSlid }}</div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <q-list dense>              
                <q-item v-for="invoice in selectedInvoices" :key="invoice.id">
                  <q-card v-if="$q.platform.is.mobile" class="my_card_4" >
                    <q-item-section>
                        <q-item-label><b>{{ $t('message.certificates') }}  {{ $t('message.invoice') }}: </b></q-item-label>
                    </q-item-section>
                    <q-item-section >
                        <q-item-label caption>{{ invoice.id }}</q-item-label>
                    </q-item-section>
                    <q-card-actions vertical>
                      <q-btn flat color="primary" icon="picture_as_pdf" @click="download_certificate(invoice.id)"/>
                    </q-card-actions>
                  </q-card>
                  <q-item-section v-if="$q.platform.is.desktop" no-wrap>
                        <q-item-label><b>{{ $t('message.certificates') }} {{ $t('message.invoice') }}:</b> {{ invoice.id }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="$q.platform.is.desktop" class="pdf_icon">
                      <q-btn flat color="primary" icon="picture_as_pdf" @click="download_certificate(invoice.id)"/>
                    </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
      </q-dialog>
      
  </div>
</template>

<script lang="ts" src="./Offers.ts" />

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

.first_line{
  max-width: 80%;
  @include media_small {
    grid-column: 1 / 3;
    grid-row: 1;
  }
  @include media_medium {
  }
  @include media_large {
  }
}

.second_line{
  min-width: 50px;
  @include media_small {
    display: flex;
    flex-direction: column;
  }
  @include media_medium {
    display: flex;
    flex-direction: column;
  }
  @include media_large {
  }
}

.third_line{
  @include media_small {
    display: flex;
    flex-direction: column;
  }
  @include media_medium {
    display: flex;
    flex-direction: column;
  }
  @include media_large {
  }
}

.fourth_line{
  @include media_small {
    display: flex;
    flex-direction: row;
  }
  @include media_medium {
    display: flex;
    flex-direction: row;
  }
  @include media_large {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
}

.fifth_line{
  
  grid-row: 3;
  grid-column: 1;
  max-width: 90%;
  @include media_small {
    display: flex;
    flex-direction: row;
  }
  @include media_medium {
    display: flex;
    flex-direction: row;
  }
  @include media_large {
    display: flex;
    flex-direction: row;
  }
}

.btns_line{
  @include media_small {
    grid-column: 1 ;
    grid-row: 1 / 2;
  }
  @include media_medium {
  }
  @include media_large {
  }
}
.offer_div {
  max-width: 100%;
  position: relative;
  border-top: 1px solid #DFE6ED;
  border-bottom: 1px solid #DFE6ED;
  padding-top:1rem;
  padding-bottom:1rem;
  @include media_small {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: auto auto;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    grid-gap: 10px;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 2fr;
    grid-gap: 10px;
  }
}


.shopping_cart__container--btns{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  @include media_small {

  }

  @include media_medium {

  }

  @include media_large {

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

.is--deleting{
  opacity: 0.3;
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

.my_card_4{
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
  padding: 8px;
}
.my_card_5 {
  width: 70%;
  height: 70%;
}

.my_card_6 {
  width: 40%;
  height: 60%;
}

.custom-btn .q-btn__icon {
  color: red;
}

.custom-btn .q-btn__label {
  color: black;
}

</style>
