<template>
  <div class="q-pa-lg ecran-container ">
    <div style="display: flex;align-items: center;">
      <div class="app__page__title__container">
        <span class="app__page__title" style="white-space:nowrap"><q-icon name="category" style="font-size:2rem;top: -3px;" color="primary" /> {{ $t('message.administration_types') }}</span>
      </div>
      <div style="justify-content: center;margin-left: 20px;">
        <q-btn no-caps dense color="blue" :label="$t('message.sync_types_categories')" @click="sincronizareTipuri"/>
      </div>
    </div>
    <q-input outlined v-model="filter" :label="$t('message.search_type')" dense >
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>

    <q-tree
        :nodes="treeDataCategories"
        node-key="appid"
        :filter="filter"
        :filter-method="myFilterMethod"
        :default-expand-all="true"
        ref="refTreeGrid"
    >
      <template v-slot:default-header="prop">
        <div style="display: flex;">
        <span class="app__label--large">{{prop.node.name}}</span>
        <span v-if="prop.node.is_tip == 'y'" class="material-icons cursor-pointer" style="margin-left: 10px;" @click="openForModifyCategory(prop.node.appid)">create
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.edit_image') }}</q-tooltip>
          </span>
        </div>
        
      </template>
    </q-tree>


    <q-dialog
        v-model="isOpenDialogCategory"
        persistent
        :maximized="true"
        :transition-show="dialogTransitionShow"
        :transition-hide="dialogTransitionHide"
    >
      <q-card class="bg-white">
        <q-bar style="display: flex;align-items: center;">
          <q-btn dense v-if="$q.platform.is.mobile" flat  color="blue" align="center" v-close-popup >
            <q-icon name="arrow_back_ios" style="font-weight: bold" />
          </q-btn>
          <!-- <div class="app__title--small" v-if="$q.platform.is.desktop">Editeaza poze tip</div>
          <div class="app__title--small" v-if="$q.platform.is.mobile">Editeaza poze tip</div> -->

          <div class="app__title--small" style="margin: auto;">{{ $t('message.edit_image') }}</div>
          <q-btn dense v-if="$q.platform.is.desktop" flat icon="close" color="black" v-close-popup>
            <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section >
          <q-scroll-area style="height: 85vh; max-width: 99vw;">
            <div class="flex__column--center" >

             <q-form
              @submit="onSubmitFormCategory"
              @reset="onResetFormCategory"
              class="q-gutter-md"
          >

              
            <!-- <q-input
                outlined
                v-model="editingCategory.size_type"
                :label="label_editing_category"
                input-style="color:black;font-weight: 900;"
                counter
                style="min-width: 100px;max-width: clamp(100px,90vw, 600px);"
                maxlength="300"
                :rules="[val => !!val || 'Field is required']"
            /> -->
            <div style="display: flex; flex-direction: column;">
              <span style="color:black;font-weight: 900;">{{editingCategory.size_type}}</span>
              <br>
              <div class="flex__column--center">
                <q-uploader
                    ref="inputImgForCategory1"
                    :label="$t('message.upload_image_for_type')"
                    accept=".jpg, .png, image/*"
                    :auto-upload="false"
                    color="grey"
                    flat
                    :hide-upload-button = "true"
                    :multiple="false"
                    style="min-width: 100px;max-width: clamp(100px,90vw, 600px);"
                    @added ="imgForCategoryWasAdded1"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                      <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat :label="$t('message.upload_image') + ' 1'">
                        <q-uploader-add-trigger />
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>
                
                <div style="width: 100%;position: relative;" v-if="ImgCategoryString641.length>0">
                  <q-img
                      v-bind:src="ImgCategoryString641"
                      spinner-color="white"
                      style="min-width: 100px;max-width: clamp(100px,90vw, 600px);top:-50px;margin:auto;"
                  >
                    <template v-slot:loading>
                      <q-spinner-gears color="white" />
                    </template>
                  </q-img>
                  <q-btn style="position: absolute;top: -45px;right: 5px;" dense icon="close" color="primary" @click="deleteImage(1)">
                    <q-tooltip>{{ $t('message.delete_image') }}</q-tooltip>
                  </q-btn>
                </div>
                </div>
                <div class="flex__column--center">
                <q-uploader
                    ref="inputImgForCategory2"
                    :label="$t('message.upload_image_for_type')"
                    accept=".jpg, .png, image/*"
                    :auto-upload="false"
                    color="grey"
                    flat
                    :hide-upload-button = "true"
                    :multiple="false"
                    style="min-width: 100px;max-width: clamp(100px,90vw, 600px);"
                    @added ="imgForCategoryWasAdded2"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                      <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat :label="$t('message.upload_image') + ' 2'">
                        <q-uploader-add-trigger />
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>

                <div style="width: 100%;position: relative;" v-if="ImgCategoryString642.length>0">
                  <q-img
                      v-bind:src="ImgCategoryString642"
                      spinner-color="white"
                      style="min-width: 100px;max-width: clamp(100px,90vw, 600px);top:-50px;margin:auto;"
                  >
                    <template v-slot:loading>
                      <q-spinner-gears color="white" />
                    </template>
                  </q-img>
                  <q-btn style="position: absolute;top: -45px;right: 5px;" dense icon="close" color="primary" @click="deleteImage(2)">
                    <q-tooltip>{{ $t('message.delete_image') }}</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div class="flex__column--center">
                <q-uploader
                    ref="inputImgForCategory3"
                    :label="$t('message.upload_image_for_type')"
                    accept=".jpg, .png, image/*"
                    :auto-upload="false"
                    color="grey"
                    flat
                    :hide-upload-button = "true"
                    :multiple="false"
                    style="min-width: 100px;max-width: clamp(100px,90vw, 600px);"
                    @added ="imgForCategoryWasAdded3"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                      <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat :label="$t('message.upload_image') + ' 3'">
                        <q-uploader-add-trigger />
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>

                <div style="width: 100%;position: relative;" v-if="ImgCategoryString643.length>0">
                  <q-img
                      v-bind:src="ImgCategoryString643"
                      spinner-color="white"
                      style="min-width: 100px;max-width: clamp(100px,90vw, 600px);top:-50px;margin:auto;"
                  >
                    <template v-slot:loading>
                      <q-spinner-gears color="white" />
                    </template>
                  </q-img>
                  <q-btn style="position: absolute;top: -45px;right: 5px;" dense icon="close" color="primary" @click="deleteImage(3)">
                    <q-tooltip>{{ $t('message.delete_image') }}</q-tooltip>
                  </q-btn>
                </div>
              </div>

            </div>


            <div style="display: flex;justify-content: flex-end;">
              <q-btn :label="$t('message.reset')" type="reset" color="primary" flat class="q-ml-sm" />
              <q-btn :label="$t('message.submit')" type="submit" color="primary"/>
            </div>
          </q-form>
            </div>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" src="./AdminTipuri.ts" />

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
  margin: auto;

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

.dashboard__document__details{
  @include media_small {
    display: grid;
    gap: 10px;
    grid-template-columns: 25vw 55vw;
  }

  @include media_medium {
    display: grid;
    gap: 10px;
    grid-template-columns: 10vw 10vw 10vw 10vw 10vw 10vw;
  }

  @include media_large {
    display: grid;
    gap: 10px;
    grid-template-columns: 10vw 10vw 10vw 10vw 10vw 10vw;
  }
}

.draggable__list--area{
  margin: auto;
  @include media_small {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  @include media_medium {
    display: grid;
    grid-template-areas:
    'notselected selected'
    'help help';
    grid-gap: 5px;
    min-width:500px;
  }

  @include media_large {
    display: grid;
    grid-template-areas:
    'notselected selected'
    'help help';
    grid-gap: 10px;
    min-width:600px;
  }
}

.draggable__list--element{
  cursor: pointer;
  @include media_small {
    margin:0.4rem;
    background-color: rgba(9,163,8,0.25);
    border-radius: 3px;
    padding:0.2rem;
  }

  @include media_medium {
    margin:0.4rem;
    background-color: rgba(9,163,8,0.25);
    border-radius: 3px;
    padding:0.5rem;
  }

  @include media_large {
    margin:0.4rem;
    background-color: rgba(9,163,8,0.25);
    border-radius: 3px;
    padding:0.5rem;
  }
}
.list-group{
  min-height:200px;
  border: 1px solid #788896;
  border-radius: 3px;
  @include media_small {
    min-width:120px;
  }

  @include media_medium {
    min-width:200px;
  }

  @include media_large {
    min-width:250px;
  }
}

</style>
