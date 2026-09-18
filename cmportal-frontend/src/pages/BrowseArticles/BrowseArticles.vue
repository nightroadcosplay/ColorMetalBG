<template>
<div>
  <HierarchicalChainBrowseHeader :hierarchicalChain="paramArticles.hierarchicalChain" />
  <div class="flex__column--center">
  <div class="ecran-container " >
    <div class="div__product--img" >
      <span class="app__title--medium">{{ $i18n.locale === 'ro' ? paramArticles.categoryNameRO : $i18n.locale === 'en' ? paramArticles.categoryNameEN : paramArticles.categoryNameBG }}</span>
      <q-img :src="urlToJPG+'/'+pidCategory" class="category__img" fit="scale-down" ratio="1"/>
      <q-btn v-if="existaArticole" outline dense color="blue"  no-caps  style="max-width: 12rem; margin:1rem auto 0 auto" @click="toggleArticleInFavorites">
        <q-icon v-if="articleIsOnFavorites" left size="1.3rem" name="favorite" color="red"/><q-icon v-else left size="1.2rem" name="favorite_border" color="red"/>
        <span v-if="articleIsOnFavorites">{{$t('message.added_to_favorites')}}</span><span v-else>{{$t('message.add_to_favorite')}}</span>
      </q-btn>
      <br>
      <span style="max-width: 12rem;align-items: center;justify-content: center;margin:1rem auto 0 auto">{{$t('message.article_not_found')}}</span>
    </div>

    <div v-if="existaArticole" class="ecran__details" style="position:relative;">
      <div class="ecran__sizes">
        <div v-if="paramArticles.withWidth=='y' "  style="padding-top:1rem;" :style="{ order: paramArticles.positionWidth }">
          <div class="app__label--medium text-weight-bold">{{$t('message.width')}}</div>
          <div class="card__dimensiuni">
            <div v-for="size in paramArticles.arrWidth" v-bind:key="size" class="card__dimensiuni--item" v-bind:class="{ 'card__dimensiuni--item--available': isWidthAvailable(size),'card__dimensiuni--item--selected':selectedWidth==size  }" @click="setSize('w',size)">{{size}}</div>
          </div>
        </div>

        <div v-if="paramArticles.withThickness=='y'"  style="padding-top:1rem;"  :style="{ order: paramArticles.positionThickness }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.thickness')}}</div>
          <div class="card__dimensiuni">
            <div v-for="size in paramArticles.arrThickness" v-bind:key="size" class="card__dimensiuni--item" v-bind:class="{ 'card__dimensiuni--item--available': isThicknessAvailable(size),'card__dimensiuni--item--selected':selectedThickness==size  }" @click="setSize('t',size)">{{size}}</div>
          </div>
        </div>

        <div v-if="paramArticles.withDiameter=='y'"  style="padding-top:1rem;"  :style="{ order: paramArticles.positionDiameter }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.diameter')}} (mm)</div>
          <div class="card__dimensiuni">
            <div v-for="size in paramArticles.arrDiameter" v-bind:key="size" class="card__dimensiuni--item" v-bind:class="{ 'card__dimensiuni--item--available': isDiameterAvailable(size),'card__dimensiuni--item--selected':selectedDiameter==size  }" @click="setSize('d',size)">{{size}}</div>
          </div>
        </div>

        <div v-if="paramArticles.withHeight=='y'"  style="padding-top:1rem;"  :style="{ order: paramArticles.positionHeight }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.height')}}</div>
          <div class="card__dimensiuni">
            <div v-for="size in paramArticles.arrHeight" v-bind:key="size" class="card__dimensiuni--item" v-bind:class="{ 'card__dimensiuni--item--available': isHeightAvailable(size),'card__dimensiuni--item--selected':selectedHeight==size  }" @click="setSize('h',size)">{{size}}</div>
          </div>
        </div>

        <div v-if="paramArticles.withAlloy=='y'"  style="padding-top:1rem;"  :style="{ order: paramArticles.positionAlloy }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.aliaj')}}</div>
          <div class="card__dimensiuni">
            <div v-for="size in paramArticles.arrAlloy" v-bind:key="size" class="card__dimensiuni--item" v-bind:class="{ 'card__dimensiuni--item--available': isAlloyAvailable(size),'card__dimensiuni--item--selected':selectedAlloy==size  }" @click="setSize('a',size)">{{size}}</div>
          </div>
        </div>

        <div v-if="paramArticles.withLength=='y'" style="padding-top:1rem; "  :style="{ order: paramArticles.positionLength }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.length')}}</div>
          <div class="card__dimensiuni" >
            <div v-for="size in paramArticles.arrLength" v-bind:key="size" class="card__dimensiuni--item"  v-bind:class="{ 'card__dimensiuni--item--available': isLengthAvailable(size),'card__dimensiuni--item--selected':selectedLength==size }" @click="setSize('l',size)">{{size}}</div>
          </div>
        </div>

        <div v-if="paramArticles.withType=='y'" style="padding-top:1rem; "  :style="{ order: paramArticles.positionType }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.type')}}</div>
          <div class="card__dimensiuni" >
            <div v-for="(size, index) in paramArticles.arrType" v-bind:key="size" class="card__dimensiuni--item hover-div"  v-bind:class="{ 'card__dimensiuni--item--available': isTypeAvailable(size),'card__dimensiuni--item--selected':selectedType==size }" @click="setSize('k',size); showTipImages(paramArticles.categoryPid, index, size)">{{typeLabel(size)}}
            <q-tooltip>{{$t('message.available_pictures')}}</q-tooltip>
            </div>
          </div>
        </div>

        <div v-if="paramArticles.withRollWeight=='y'" style="padding-top:1rem; "  :style="{ order: paramArticles.positionRollWeight }">
          <div  class="app__label--medium text-weight-bold">{{$t('message.roll_weight')}}</div>
          <div class="card__dimensiuni" >
            <div v-for="size in paramArticles.arrRollWeight" v-bind:key="size" class="card__dimensiuni--item"  v-bind:class="{ 'card__dimensiuni--item--available': isRollWeightAvailable(size),'card__dimensiuni--item--selected':selectedRollWeight==size }" @click="setSize('g',size)">{{size}}</div>
          </div>
        </div>
      </div>
      <div v-if="selectedSize.cuDebitare" :class="$q.platform.is.mobile ? 'card__debitare__options_mobile' : typeOfArticle==='placa' ? 'card__debitare__options_placa' : 'card__debitare__options'" >
        <div style="grid-area:toggledebit">
          <q-toggle
              v-model="dorescDebitare"
              :label="$t('message.want_cutting')"
              @update:model-value="punePeZeroDimensiuni"
          />
        </div>

        <div  v-if="selectedSize.cuDebitare && dorescDebitare" class="cutting-length-width"  style="grid-area:lungimelatime;">
          <q-input
              v-if="typeOfArticle==='placa'"
              v-model.number="cuttingWidth"
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
              <span>{{$t('message.latimea_admisa_intre')}} {{ minLengthPlaci }}mm {{$t('message.si')}} {{maxLengthPlaci }}mm</span>
            </template>
          </q-input>
          <q-input
              v-model.number="cuttingLength"
              type="number"
              min="0" max="3020"
              outlined
              label-slot
              :style="$q.platform.is.mobile ? 'min-width:15rem; max-width: 15rem;' : 'min-width:15rem; max-width: 15rem;margin-left:1rem;'"
              @update:model-value="coreleazaUm1Um2CuDebitare"
              :error="ErrorRuleLengthDebitarePlaca"
          >
            <template v-slot:label>
              <span style="font-weight: bold;font-size:1.2rem;">{{$t('message.length')}}(mm)</span>
            </template>
            <template v-slot:error>
              <span v-if="typeOfArticle==='placa'">{{$t('message.lungimea_adminsa_intre')}} {{ minLengthPlaci }}mm {{$t('message.si')}} {{ maxLengthPlaci }}mm</span>
              <span v-else>{{$t('message.lungimea_adminsa_intre')}} {{ minLengthBare }}mm {{$t('message.si')}} {{maxLengthBare }}mm</span>
            </template>
          </q-input>
        </div>
        <div style="grid-area:nrbuc;">
          <q-input v-model.number="nrBucati"
                   type="number"
                   outlined
                   label-slot
                   min="0" max="10000"
                   style="max-width: 7rem;"
                   @update:model-value="coreleazaUm1Um2CuDebitare"
                   v-if="selectedSize.cuDebitare && dorescDebitare"
          >
            <template v-slot:label>
              <span style="font-weight: bold;font-size:1.2rem;">{{$t('message.nr_buc')}}</span>
            </template>
          </q-input>
        </div>
      </div>

      <div style="display: flex;justify-content: flex-start; padding-top:2rem;padding-bottom:2rem;padding-right: 2rem;min-height:7rem; ">
        <q-input
            v-if="selectedSize.um1 && selectedSize.um1.length>0 && !HideUm1IfBucDebit"
            v-model.number="qUm1Input"
            type="number"
            :readonly="(selectedSize.cuDebitare && dorescDebitare) || ReadonlyKgForPlacaBara"
            outlined
            label-slot
            min="0"
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
            min="0"
            style="max-width: 7rem;margin-left:1rem;"
            @update:model-value="coreleazaUm1Um2('um2')"
            :error="ErrorRuleIntegerNumberBuc || ErrorRuleMultipleOfLength"
                >
          <template v-slot:label>
            <span style="font-weight: bold;font-size:1.2rem;">{{$umLabel(selectedSize.um2)}}</span>
          </template>
          <template v-slot:error>
              <span v-if="!ErrorRuleMultipleOfLength">{{ msjErrorRuleIntegerNumberBuc }}</span>
            </template>
        </q-input>

        <div v-if="(selectedSize.um1 || selectedSize.um2)" style="margin-left: 24px;margin-top: -20px;">
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
      
      <!-- Full width, not the M field's error slot: that slot is as narrow as the
           field, so a sentence this long wrapped over the status and basket button. -->
      <div v-if="ErrorRuleMultipleOfLength" class="text-negative" style="padding-bottom: 1rem;">
        {{ $t('message.cantitatea_multiplu_de_lungime', { length: SelectedLengthInMetres + ' ' + $umLabel(selectedSize.um2) }) }}
      </div>
      <div v-if="(selectedSize.um1 || selectedSize.um2)" style="display: flex;align-items: center;gap: 8px;">
        <span style="font-size: 1rem;">{{$t('message.status')}}: <b>{{ labelStock }}.</b></span>
        <q-circular-progress
          indeterminate
          rounded
          size="24px"
          color="black"
          v-if="loadingStock"
        />
      </div>
      <div v-if="isPlacaAluminiu=='1'">
        <span style="color: red">{{$t('message.remarks_cutting')}}</span>
      </div>
       
      <div style="display: flex;justify-content: center; padding-top:2rem;padding-bottom:2rem;">
        <q-btn v-if="labelBtnAdaugaBasket==='Adauga in cos'" :color="(articleCouldBePutInBasket?'amber-8':'amber-4')" icon="shopping_cart" no-caps :label="$t('message.add_in_basket')"
               @click="addProductToBasket" />
        <q-btn v-if="labelBtnAdaugaBasket==='Adauga in cerere'" :color="(articleCouldBePutInBasket?'amber-8':'amber-4')" icon="shopping_cart" no-caps :label="$t('message.add_in_request')"
               @click="addProductToCerere" />
      </div>

      <div style="display: flex;flex-direction: column; padding-top:2rem;padding-bottom:2rem;padding-right: 2rem;">
        <div class="app__label--medium ">{{$t('message.remarks')}} </div>
        <q-input :maxlength="selectedSize.cuDebitare && dorescDebitare ? '20' : '200'" type="textarea" autogrow counter class="input--desire" outlined v-model="inputFreeTextComments" :placeholder="$t('message.write_something')" dense color="blue-grey-7" />
      </div>

    </div>
    <div v-else class="app__label--medium">
      <p>{{$t('message.we_are_sorry')}}</p>
      <p>{{$t('message.contact_sales_manager')}}</p>
      <p>{{$t('message.thanks')}}</p>
    </div>
  </div>

  
  <q-dialog
        v-model="isOpenDialogCategory"
        transition-show="fade-in"
        transition-hide="fade-out"
        
    >
      <q-card class="bg-white">
        <q-bar style="height: 46px;background-color: #D8DCDF;">
          <q-btn dense v-if="$q.platform.is.mobile" flat  color="blue" align="center" v-close-popup >
            <q-icon name="arrow_back_ios" style="font-weight: bold" />
          </q-btn>
          <div class="app__title--small" v-if="$q.platform.is.desktop" ><span style="color:black;font-weight: 900;">{{typeLabel(labelTitle)}}</span></div>
          <div class="app__title--small" v-if="$q.platform.is.mobile" ><span style="color:black;font-weight: 900;">{{typeLabel(labelTitle)}}</span></div>
          <q-space dense v-if="$q.platform.is.desktop" />

          <q-btn dense v-if="$q.platform.is.desktop" flat icon="close" color="black" v-close-popup>
            <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section >
          <q-scroll-area style="height: 50vh;min-width: 300px; max-width: clamp(100px,90vw, 600px);" visible :thumb-style="thumbStyle" :bar-style="barStyle">

            <div style="display: flex; flex-direction: column;">
                <q-img
                    v-if="ImgCategoryString641.length>0"
                    v-bind:src="ImgCategoryString641"
                    spinner-color="primary"
                    style="min-width: 100px;max-width: clamp(100px,90vw, 600px);margin:auto;"
                >
                  <template v-slot:loading>
                    <q-spinner-gears color="primary" />
                  </template>
                </q-img>

                <q-img
                    v-if="ImgCategoryString642.length>0"
                    v-bind:src="ImgCategoryString642"
                    spinner-color="primary"
                    style="min-width: 100px;max-width: clamp(100px,90vw, 600px); margin:auto;"
                >
                  <template v-slot:loading>
                    <q-spinner-gears color="primary" />
                  </template>
                </q-img>
                <q-img
                    v-if="ImgCategoryString643.length>0"
                    v-bind:src="ImgCategoryString643"
                    spinner-color="primary"
                    style="min-width: 100px;max-width: clamp(100px,90vw, 600px);margin:auto;"
                >
                  <template v-slot:loading>
                    <q-spinner-gears color="primary" />
                  </template>
                </q-img>
              </div>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
</div>
</div>
</template>

<script lang="ts" src="./BrowseArticles.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;

  @include media_small {
    flex-direction: column;
    background-color: white;
  }

  @include media_medium {
    flex-direction: row;
    padding-top: 5vh;
    margin-left: 2vw;
    margin-right: 2vw;
  }

  @include media_large {
    flex-direction: row;
    padding-top: 5vh;
    margin-left: 2vw;
    margin-right: 2vw;
  }
}

.ecran__details{
  @include media_small {
    min-width:90vw;
    max-width:90vw;
  }

  @include media_medium {

  }

  @include media_large {

  }
}

.ecran__sizes{
  display: flex;
  flex-direction: column;
  @include media_small {

  }

  @include media_medium {

  }

  @include media_large {

  }
}
.input--desire{
  @include media_small {
    min-width:80vw;
  }

  @include media_medium {
    min-width:30rem;
  }

  @include media_large {
    min-width:50rem;
  }
}

.div__product--img{
  @include media_small {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @include media_medium {
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
  }

  @include media_large {
    display: flex;
    flex-direction: column;
    padding-right: 3rem;
  }
}

.card__dimensiuni{
  @include media_small {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  @include media_medium {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  @include media_large {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

.card__dimensiuni--item{
  font-family: 'Roboto', sans-serif;
  font-weight: 100;
  color: #B1B9BF;
  @include media_small {
    min-width: 5rem;
    // max-width: 5rem;
    background-color: #EDF1F4;
    padding:0.5rem;
    margin:0.5rem;
    border-radius: 3px;
    text-align:center;
  }

  @include media_medium {
    min-width: 3rem;
    background-color: #EDF1F4;
    padding:0.5rem;
    margin:0.5rem;
    border-radius: 3px;
    text-align:center;
  }

  @include media_large {
    min-width: 3rem;
    background-color: #EDF1F4;
    padding:0.5rem;
    margin:0.5rem;
    border-radius: 3px;
    text-align:center;
  }
}

.card__dimensiuni--item--available{
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  color: #293844;
  @include media_small {
    font-weight: 500;
  }

  @include media_medium {
    font-weight: 500;
  }

  @include media_large {
    font-weight: 500;
  }
}

.card__dimensiuni--item--selected{
  background-color:#F7C325;
}

.category__img{
  font-family: 'Roboto', sans-serif;
  font-weight: 100;
  cursor: pointer;

  @include media_small {
    max-width: 80vw;
    min-width: 80vw;
    width: auto;
    height: auto;
    border-radius: 3px;
  }

  @include media_medium {
    max-height: 15vh;
    min-height: 15vh;
    width: auto;
    height: auto;
    border-radius: 3px;
  }

  @include media_large {
    max-height: 15vh;
    min-height: 15vh;
    width: auto;
    height: auto;
    border-radius: 3px;
  }
}


.cutting-length-width{
  display: inline-flex;
  // margin-left:1rem;
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
  padding-right: 2rem;
  min-height:8rem;
  @include media_small {
    display: grid;
    grid-template-columns: 8rem 8rem 8rem;
    grid-template-areas:
    'toggledebit lungimelatime lungimelatime lungimelatime'
    'nrbuc nrbuc';
    gap: 10px;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 8rem 8rem 8rem;
    grid-template-areas:
    'toggledebit lungimelatime lungimelatime lungimelatime'
    'nrbuc nrbuc';
    gap: 10px;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 8rem 18rem;
    grid-template-areas:
    'toggledebit lungimelatime nrbuc';
    gap: 5px;
  }
}

.card__debitare__options_mobil{
  min-height:8rem;
  @include media_small {
    display: grid;
    grid-template-areas:
    'nrbuc nrbuc'
    'toggledebit lungimelatime lungimelatime lungimelatime';
  }

  @include media_medium {
    display: grid;
    grid-template-areas:
    'nrbuc nrbuc'
    'toggledebit lungimelatime lungimelatime lungimelatime';
  }

  @include media_large {
    display: grid;
    grid-template-areas:
    'toggledebit nrbuc lungimelatime';
  }
}

.card__debitare__options_placa{
  padding-top:2rem;
  padding-bottom:2rem;
  padding-right: 2rem;
  min-height:8rem;
  @include media_small {
    display: grid;
    grid-template-columns: 8rem 8rem 8rem;
    grid-template-areas:
    'toggledebit lungimelatime lungimelatime lungimelatime'
    'nrbuc nrbuc';
    gap: 10px;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 8rem 8rem 8rem;
    grid-template-areas:
    'toggledebit lungimelatime lungimelatime lungimelatime'
    'nrbuc nrbuc';
    gap: 10px;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 8rem 8rem 24rem;
    grid-template-areas:
    'toggledebit lungimelatime lungimelatime nrbuc';
    gap: 5px;
  }
}
.scroll-container {
  height: 50vh; /* Adjust the height as needed */
  overflow: hidden; /* Ensure that content overflow is hidden */
}

</style>
