<template>
  <div >
    <div class="flex__column--center">
      <span class="app__property--medium">{{$i18n.locale === 'ro' ? productNameRO : $i18n.locale === 'en' ? productNameEN : productNameBG}}</span>
      <div class="ecran-container " >
        <div v-if="ArticolIdentificatInBazaDate" class="ecran__details" style="position:relative; ">
          <div v-if="selectedSize.cuDebitare" class="card__debitare__options" >
            <div style="grid-area:toggledebit">
              <q-toggle
                  v-model="dorescDebitare"
                  :label="$t('message.want_cutting')"
                  @update:model-value="punePeZeroDimensiuni"
              />
            </div>

            <div style="grid-area:nrbuc">
              <q-input v-model.number="nrBucati"
                       type="number"
                       outlined
                       label-slot
                       min="0" max="10000"
                       style="max-width: 200px;padding-left:1rem;"
                       @update:model-value="coreleazaUm1Um2CuDebitare"
                       v-if="selectedSize.cuDebitare && dorescDebitare"
              >
                <template v-slot:label>
                  <span style="font-weight: bold;font-size:1.2rem;">{{$t('message.nr_buc')}}</span>
                </template>
              </q-input>
            </div>

            <div  v-if="selectedSize.cuDebitare && dorescDebitare" class="cutting-length-width"  style="grid-area:lungimelatime;">
              <q-input  
              v-model.number="cuttingLength"
                  type="number"
                  min="0" max="3020"
                  outlined
                  label-slot
                  style="min-width:15rem; max-width: 15rem;"
                  @update:model-value="coreleazaUm1Um2CuDebitare"
                  :error="ErrorRuleLengthDebitarePlaca"
              >
                <template v-slot:label>
                  <span style="font-weight: bold;font-size:1.2rem;">{{$t('message.length')}}(mm)</span>
                </template>
                <template v-slot:error>
                  <span v-if="typeOfArticle==='placa'">{{$t('message.lungimea_adminsa_intre')}} {{ minLengthPlaci }}mm {{$t('message.si')}} {{maxLengthPlaci }}mm</span>
                  <span v-else>{{$t('message.latimea_admisa_intre')}} {{ minLengthBare }}mm {{$t('message.si')}} {{maxLengthBare }}mm</span>
                </template>
              </q-input>

              <q-input  v-model.number="cuttingWidth"
                  v-if="typeOfArticle==='placa'"
                  type="number"
                  min="0"
                  max="3020"
                  outlined
                  label-slot
                  style="min-width:15rem; max-width: 15rem;"
                  @update:model-value="coreleazaUm1Um2CuDebitare"
                  :error="ErrorRuleWidthDebitarePlaca"
              >
                <template v-slot:label>
                  <span style="font-weight: bold;font-size:1.2rem;">{{$t('message.width')}}(mm)</span>
                </template>
                <template v-slot:error>
                  <span>{{$t('message.width_allowed_between')}} {{ minLengthPlaci }}mm {{$t('message.si')}} {{maxLengthPlaci }}mm</span>
                </template>
              </q-input>
            </div>

          </div>

          <div style="display: flex;justify-content: flex-start; padding-top:2rem;padding-bottom:2rem;padding-right: 2px;min-height:7rem; ">
            <q-input
                v-if="selectedSize.um1 && selectedSize.um1.length>0 && !HideUm1IfBucDebit"
                v-model.number="qUm1Input"
                type="number"
                :readonly="(selectedSize.cuDebitare && dorescDebitare) || ReadonlyKgForUm2Category"
                outlined
                label-slot
                style="max-width: 7rem;"
                @update:model-value="coreleazaUm1Um2('um1')"
            >
              <template v-slot:label>
                <span style="font-weight: bold;font-size:1.2rem;">{{$umLabel(selectedSize.um1)}}</span>
              </template>
            </q-input>

            <q-input
                v-if="selectedSize.um2 && selectedSize.um2.length>0 && !HideUm2IfBucDebit"
                v-model.number="qUm2"
                type="number"
                :readonly="selectedSize.cuDebitare && dorescDebitare"
                outlined
                label-slot
                style="max-width: 7rem;margin-left:1rem;"
                @update:model-value="coreleazaUm1Um2('um2')"
            >
              <template v-slot:label>
                <span style="font-weight: bold;font-size:1.2rem;">{{$umLabel(selectedSize.um2)}}</span>
              </template>
            </q-input>
            <div v-if="(selectedSize.um1 || selectedSize.um2) && $q.platform.is.desktop" style="margin-left: 24px;margin-top: -20px;">
              <span style="text-align: center;display: flex;align-items: center;">{{$t('message.tip_um_dorit_la_ofertare')}}</span>
              <div style="display: flex; flex-direction: row;">
                <div v-if="(!HideUm1IfBucDebit || dorescDebitare) && (selectedSize.um1 != '' && selectedSize.um1 != null)" style="display: flex; flex-direction: column;align-items: center;">
                  {{$umLabel(selectedSize.um1)}}
                  <q-checkbox size="xl" v-model="selectedUM1"  @update:model-value="val => changeTipUm(val, 1)"/>
                </div>
                <div v-if="(!HideUm2IfBucDebit || dorescDebitare) && (selectedSize.um2 != '' && selectedSize.um2 != null)" style="display: flex; flex-direction: column;align-items: center;">
                  {{$umLabel(selectedSize.um2)}}
                  <q-checkbox size="xl" v-model="selectedUM2" @update:model-value="val => changeTipUm(val, 2)" />
                </div>
              </div>
            </div>
          </div>

          
          <div v-if="(selectedSize.um1 || selectedSize.um2) && $q.platform.is.mobile" style="margin-left: 24px;margin-top: -20px;">
              <span style="text-align: center;display: flex;align-items: center;">{{$t('message.tip_um_dorit_la_ofertare')}}</span>
              <div style="display: flex; flex-direction: row;">
                <div v-if="(!HideUm1IfBucDebit || dorescDebitare) && (selectedSize.um1 != '' && selectedSize.um1 != null)" style="display: flex; flex-direction: column;align-items: center;">
                  {{$umLabel(selectedSize.um1)}}
                  <q-checkbox size="xl" v-model="selectedUM1"  @update:model-value="val => changeTipUm(val, 1)"/>
                </div>
                <div v-if="(!HideUm2IfBucDebit || dorescDebitare) && (selectedSize.um2 != '' && selectedSize.um2 != null)" style="display: flex; flex-direction: column;align-items: center;">
                  {{$umLabel(selectedSize.um2)}}
                  <q-checkbox size="xl" v-model="selectedUM2" @update:model-value="val => changeTipUm(val, 2)" />
                </div>
              </div>
            </div>

          
          <div style="display: flex;flex-direction: column; padding-top:2rem;padding-bottom:2rem;padding-right: 2rem;">
            <div class="app__label--medium ">{{$t('message.remarks')}} :</div>
            <q-input :maxlength="selectedSize.cuDebitare && dorescDebitare ? '20' : '200'" type="textarea" autogrow counter class="input--desire" outlined v-model="inputFreeTextComments" :placeholder="$t('message.write_something')" dense color="blue-grey-7"/>
          </div>
          <br>
          <br>
          <div class="div__btn" >
            <q-btn v-close-popup  no-caps :label="$t('message.close')" />
            <q-btn v-close-popup :color="'amber-4'" icon="shopping_cart" no-caps :label="$t('message.save')" style="margin-left:5px;"
                   @click="editProductInOffer" />
          </div>

        </div>
        <div v-else class="app__label--medium">
          <p>{{$t('message.sorry_contact_area_sales_manager')}}</p>
          <p>{{$t('message.thanks')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./EditQuantityArticleCerere.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  @include media_small {
    flex-direction: column;
    align-items: flex-start;
  }

  @include media_medium {
    min-height: 350px;
    min-width:550px;
    flex-direction: row;
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @include media_large {
    flex-direction: row;
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    min-height: 350px;
    min-width:700px;
  }
}

.ecran__details{
  @include media_small {

  }

  @include media_medium {
    min-width:550px;
  }

  @include media_large {
    min-width:750px;
  }
}

.div__btn{

  @include media_small {
    display: flex;
    justify-content: center;
  }

  @include media_medium {
    display: flex;
    justify-content: flex-start;
    position: absolute;
    bottom: 1rem;
    right:1rem;
  }

  @include media_large {
    display: flex;
    justify-content: flex-start;
    position: absolute;
    bottom: 1rem;
    right:1rem;
  }
}

.cutting-length-width{
  display: inline-flex;
  margin-left:1rem;
  @include media_small {
    flex-direction: column;
  }

  @include media_medium {
    justify-content: flex-start;
    flex-direction: row;
  }

  @include media_large {
    justify-content: flex-start;
    flex-direction: row;
  }
}


.card__debitare__options{
  padding-top:2rem;
  padding-bottom:2rem;
  min-height:8rem;
  @include media_small {
    display: grid;
    grid-template-columns: 6rem 4rem 4rem;
    grid-template-areas:
    'toggledebit nrbuc nrbuc'
    'lungimelatime lungimelatime lungimelatime';
    gap: 5px;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 8rem 8rem 8rem;
    grid-template-areas:
    'toggledebit nrbuc nrbuc'
    'lungimelatime lungimelatime lungimelatime';
    gap: 10px;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 8rem 8rem 20rem;
    grid-template-areas:
    'toggledebit nrbuc lungimelatime';
    gap: 5px;
  }
}

</style>
