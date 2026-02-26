<template>
  <div class="q-pa-lg ecran-container ">
    <div style="display: flex;align-items: center;">
      <div v-if="$q.platform.is.desktop" class="app__page__title__container">
        <span class="app__page__title" style="white-space:nowrap"><q-icon name="qr_code" style="font-size:2rem;top: -3px;" color="primary" /> {{$t('message.manage_items')}}</span>
      </div>
      <div style="margin-left: auto">
        <q-input bottom-slots debounce="300" v-model="filterText" dense>
          <template v-slot:append>
            <q-icon v-if="filterText !== ''" name="close" @click="filterText = ''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-btn v-show="1==2"
             square color="blue" icon="add"
             class="article--add--btn"
             @click="onOpenFormAddNewArticle">
        <q-tooltip
            transition-show="scale"
            transition-hide="scale"
        >
          {{$t('message.add_new_article')}}
        </q-tooltip>
      </q-btn>
    </div>
    <!-- start Header-->
    <div v-if="$q.platform.is.desktop" class="dashboard__document__section app__border__bottom" >
      <div class="dashboard__product__details">
        <span class="app__label--small">{{$t('message.item_code')}}</span>
        <span class="app__label--small">{{$t('message.category')}}</span>
        <span class="app__label--small">{{$t('message.features')}}</span>
        <span class="app__label--small">{{$t('message.measure_units')}}</span>
        <span class="app__label--small">{{$t('message.client_visible')}}</span>
      </div>
      <div class="dashboard__document__icons" ></div>
    </div>
    <!-- end Header-->

    <div v-for="article in arrArticles" :key="article.appid" class="dashboard__document__section app__border__bottom" >
      <div class="dashboard__product__details">
        <span v-if="$q.platform.is.mobile" class="app__label--small" style="font-weight: bold;">{{$t('message.item_code')}}:</span>
        <span class="app__color--label">{{article.code}}</span>
        <span v-if="$q.platform.is.mobile" class="app__label--small" style="font-weight: bold;">{{$t('message.category')}}:</span>
        <div style="display: flex;flex-direction: column;">
          <span v-for="categ in article.categories" :key="categ.pid" class="app__property--small" style="font-weight: lighter;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{$i18n.locale === 'ro' ? categ.lantHierarchyCategoriesRO : $i18n.locale === 'en' ? categ.lantHierarchyCategoriesEN : $i18n.locale === 'bg' ? categ.lantHierarchyCategoriesBG : categ.lantHierarchyCategoriesRO }}</span>
        </div>
        <span v-if="$q.platform.is.mobile" class="app__label--small" style="font-weight: bold;">{{$t('message.features')}}:</span>
        <span class="app__color--semigray" style="font-weight: lighter;">
            <span v-if="article.sizeLength">{{$t('message.length')}} {{article.sizeLength}} mm </span>
            <span v-if="article.sizeWidth">{{$t('message.width')}} {{article.sizeWidth}} mm </span>
            <span v-if="article.sizeThickness">{{$t('message.thickness')}} {{article.sizeThickness}} mm </span>
            <span v-if="article.sizeDiameter">{{$t('message.diameter')}} {{article.sizeDiameter}} mm </span>
            <span v-if="article.sizeHeight">{{$t('message.height')}} {{article.sizeHeight}} mm </span>
            <span v-if="article.sizeAlloy">{{$t('message.aliaj')}} {{article.sizeAlloy}} </span>
            <span v-if="article.sizeType"> {{article.sizeType}}  </span>
          </span>


        <span v-if="$q.platform.is.mobile" class="app__label--small" style="font-weight: bold;">{{$t('message.measure_units')}}:</span>
        <div style="display: flex;flex-direction: column;justify-content: flex-start;">
            <span class="app__property--small">{{article.um1}}</span>
            <span class="app__property--small">{{article.um2}} <span v-if="article.um2 && article.um2.length>0">({{article.um1ToUm2}})</span></span>
        </div>
        <div style="display: flex; align-items: center;">
            <q-checkbox v-model="article.isActive"
                    :label="$q.platform.is.mobile?$t('message.visible'):''"
                    @update:model-value="changeStatus(article)"
                    true-value="y"
                    false-value="n"/>
              <q-btn v-if="$q.platform.is.mobile" color="primary" icon="edit" label="Edit" @click="openProductForEditing(article)" size="xs" style="max-height:1rem;margin-left: 2rem;"/>
        </div>
      </div>

      <div class="dashboard__document__icons" >
        <q-icon v-if="$q.platform.is.desktop" name="edit" style="color:#F7C325; font-size: 1.5rem;cursor:pointer;" @click="openProductForEditing(article)">
          <q-tooltip
              transition-show="scale"
              transition-hide="scale"
              anchor="center left" self="center right" :offset="[10, 10]"
          >
            {{$t('message.edit_item')}}
          </q-tooltip>
        </q-icon>
        <q-icon v-if="1==2" name="delete_forever" style="color:red; font-size: 1.5rem;cursor:pointer;"/>
      </div>

    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="currentPageNumber"
          :max="maxPagesNumber"
          input
          @input="inputPaginator"
      />
    </div>
    <q-dialog
        v-model="isShoDialogEditArticle"
        persistent
        :maximized="true"
        :transition-show="dialogTransitionShow"
        :transition-hide="dialogTransitionHide"
    >
      <q-card class="bg-white">
        <q-bar style="min-height: 40px;">
          <q-icon v-if="$q.platform.is.mobile"  name="arrow_back_ios" class="app__arrow--back" v-close-popup/>
          <div class="app__title--small" v-if="$q.platform.is.desktop" style="position: absolute;left: 50%;margin-left: -100px;">{{$t('message.edit_item')}}</div>
          <div class="app__back__bar--title " v-if="$q.platform.is.mobile" style="position: absolute;left: calc(50% - 100px); top:10px;">{{$t('message.edit_item')}}</div>
          <q-space dense v-if="$q.platform.is.desktop" />

          <q-btn dense v-if="$q.platform.is.desktop" flat icon="close" color="black" v-close-popup>
            <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section >
          <q-scroll-area style="height: 85vh">
            <EditArticle :pid="selectedPidArticle" :closeHandler="closeFormEditArticle"/>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" src="./AdminArticles.ts" />

<style scoped lang="scss">
@import "../../../assets/mixins";

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
    max-width: 80vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    max-width: 80vw;
    background-color: white;
  }
}

.dashboard__document__section{
  padding-top: 1rem;

  @include media_small {
    display: flex;
    justify-content: flex-start;
  }

  @include media_medium {
    display: grid;
    gap: 10px;
    grid-template-columns: 60vw 10vw;
  }

  @include media_large {
    display: grid;
    gap: 10px;
    grid-template-columns: 60vw 10vw;
  }
}

.dashboard__product__details{

  @include media_small {
    display: grid;
    gap: 10px;
  }

  @include media_medium {
    display: grid;
    gap: 10px;
    grid-template-columns: 10vw 15vw 10vw 10vw 10vw 10vw;
  }

  @include media_large {
    display: grid;
    gap: 10px;
    grid-template-columns: 15vw 20vw 15vw 7vw 7vw 5vw;
  }
}

.dashboard__document__icons{
  position: relative;
  display: flex;
  align-content: center;
  @include media_small {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  @include media_medium {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @include media_large {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.article--add--btn{
  height: 2rem;
  width: 2rem;
  margin-left: auto;
  @include media_small {
    position: fixed;
    top:7px;
    right:5px;
  }

  @include media_medium {

  }

  @include media_large {

  }
}

</style>
