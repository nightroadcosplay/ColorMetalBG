<template>
  <div class="q-pa-lg ecran-container ">
    <div style="display: flex;align-items: center;">
      <div class="app__page__title__container">
        <span class="app__page__title" style="white-space:nowrap"><q-icon name="category" style="font-size:2rem;top: -3px;" color="primary" /> {{ $t('message.manage_categories') }}</span>
      </div>
      <div style="margin-left: auto">
        <q-btn
            v-if="$q.platform.is.desktop"
            style="margin-top: 1rem;margin-right: 1rem;"
            padding="xs"
            color="blue"
            icon="add"
            @click="openFormAddNewCategory('','')"
        >
          <q-tooltip
              transition-show="scale"
              transition-hide="scale"
              anchor="top middle" self="bottom middle" :offset="[10, 10]"
          >
           {{ $t('message.add_new_category') }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-input outlined v-model="filter" :label="$t('message.search')" dense >
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

        <div v-if="prop.node.category_level=='1'" style="display: flex;">
          <span class="app__label--large">{{$i18n.locale === 'ro' ? prop.node.name_ro : $i18n.locale === 'en' ? prop.node.name_en : $i18n.locale === 'bg' ? prop.node.name_bg : prop.node.name_ro}}</span>
          <span v-if="prop.node.children.length==0" class="material-icons cursor-pointer" style="margin-left: 10px;color:red; font-weight: bolder;" @click="deleteCategory(prop.node.pid,prop.node.name)">
            clear
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.delete') }}</q-tooltip>
          </span>
          <span class="material-icons cursor-pointer" style="margin-left: 10px;" @click="openForModifyCategory(prop.node.pid)">create
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.modify') }}</q-tooltip>
          </span>
        </div>


        <div v-if="prop.node.category_level=='2'" style="display: flex;">
          <span class="app__label--medium" >{{ $i18n.locale === 'ro' ? prop.node.name_ro : $i18n.locale === 'en' ? prop.node.name_en : $i18n.locale === 'bg' ? prop.node.name_bg : prop.node.name_ro}}</span>
          <span v-if="prop.node.children.length==0" class="material-icons cursor-pointer" style="margin-left: 10px;color:red; font-weight: bolder;"  @click="deleteCategory(prop.node.pid,prop.node.name)">
            clear
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]">{{ $t('message.delete') }}</q-tooltip>
          </span>
          <span class="material-icons cursor-pointer" style="margin-left: 10px;"  @click="openForModifyCategory(prop.node.pid)">create
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.modify') }}</q-tooltip>
          </span>
        </div>

        <div v-if="prop.node.category_level=='3'" style="display: flex;">
          <span class="app__label--small" >{{ $i18n.locale === 'ro' ? prop.node.name_ro : $i18n.locale === 'en' ? prop.node.name_en : $i18n.locale === 'bg' ? prop.node.name_bg : prop.node.name_ro}}</span>
          <span v-if="prop.node.children.length==0" class="material-icons cursor-pointer" style="margin-left: 10px;color:red; font-weight: bolder;"  @click="deleteCategory(prop.node.pid,prop.node.name)">
            clear
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.delete') }}</q-tooltip>
          </span>
          <span class="material-icons cursor-pointer" style="margin-left: 10px;"  @click="openForModifyCategory(prop.node.pid)">create
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.modify') }}</q-tooltip>
          </span>
        </div>
        <div v-if="prop.node.category_level=='4'" style="display: flex;">
          <span class="app__label--small" >{{ $i18n.locale === 'ro' ? prop.node.name_ro : $i18n.locale === 'en' ? prop.node.name_en : $i18n.locale === 'bg' ? prop.node.name_bg : prop.node.name_ro}}</span>
          <span v-if="prop.node.children.length==0" class="material-icons cursor-pointer" style="margin-left: 10px;color:red; font-weight: bolder;"  @click="deleteCategory(prop.node.pid,prop.node.name)">
            clear
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.delete') }}</q-tooltip>
          </span>
          <span class="material-icons cursor-pointer" style="margin-left: 10px;"  @click="openForModifyCategory(prop.node.pid)">create
            <q-tooltip transition-show="scale" transition-hide="scale" anchor="top middle" self="bottom middle" :offset="[10, 10]" >{{ $t('message.modify') }}</q-tooltip>
          </span>
        </div>

      </template>

      <template v-slot:default-body="prop">
        <div v-if="prop.node.is_parent_for_articles=='n'">
          <q-btn outline color="primary" icon="add" :label="$t('message.new_subcategory')" size="sm" no-caps @click="openFormAddNewCategory(prop.node.pid,prop.node.name)"/>
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
        <q-bar>
          <q-btn dense v-if="$q.platform.is.mobile" flat  color="blue" align="center" v-close-popup >
            <q-icon name="arrow_back_ios" style="font-weight: bold" />
          </q-btn>
          <div class="app__title--small" v-if="$q.platform.is.desktop" style="position: absolute;left: 50%;margin-left: -100px;">{{ $t('message.edit_category') }}</div>
          <div class="app__title--small" v-if="$q.platform.is.mobile" style="position: absolute;left: calc(50% - 100px);">{{ $t('message.edit_category') }}</div>
          <q-space dense v-if="$q.platform.is.desktop" />

          <q-btn dense v-if="$q.platform.is.desktop" flat icon="close" color="black" v-close-popup>
            <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section >
          <q-scroll-area style="height: 85vh; max-width: 99vw;">
            <div class="flex__column--center">

             <q-form
              @submit="onSubmitFormCategory"
              @reset="onResetFormCategory"
              class="q-gutter-md"
          >
            <q-input
                outlined
                v-model="editingCategory.name_ro"
                :label="label_editing_category + ' (RO)'"
                input-style="text-transform: uppercase;color:black;font-weight: 900;"
                counter
                style="min-width: 100px;max-width: clamp(100px,70vw, 600px);"
                maxlength="100"
                :rules="[val => !!val || $t('message.camp_obligatoriu')]"
            />
            <q-input
                outlined
                v-model="editingCategory.name_en"
                :label="label_editing_category + ' (EN)'"
                input-style="text-transform: uppercase;color:black;font-weight: 900;"
                counter
                style="min-width: 100px;max-width: clamp(100px,70vw, 600px);"
                maxlength="100"
                :rules="[val => !!val || $t('message.camp_obligatoriu')]"
            />
            <q-input
                outlined
                v-model="editingCategory.name_bg"
                :label="label_editing_category + ' (BG)'"
                input-style="text-transform: uppercase;color:black;font-weight: 900;"
                counter
                style="min-width: 100px;max-width: clamp(100px,70vw, 600px);"
                maxlength="100"
                :rules="[val => !!val || $t('message.camp_obligatoriu')]"
            />
            <p v-if="editingCategory.parent_pid && editingCategory.parent_pid.toString().length>0" class="app__color--gray">{{ $t('message.parent_category') }}: <span class="app__property--medium">{{ $i18n.locale === 'ro' ? editingCategory.parent_name_ro : $i18n.locale === 'en' ? editingCategory.parent_name_en : $i18n.locale === 'bg' ? editingCategory.parent_name_bg : editingCategory.parent_name_ro }}</span></p>
            <q-checkbox v-if="editingCategory.hasChilds=='n'" v-model="editingCategory.is_parent_for_articles" :label="$t('message.contains_items') as string" color="teal" true-value="y" false-value="n" />
            <div v-else class="app__label--medium">{{ $t('message.subcategory_exists') }}</div>

            <div class="flex__column--center">
              <q-uploader
                  ref="inputImgForCategory"
                  :label="$t('message.upload_category_image')"
                  accept=".jpg, .png, image/*"
                  :auto-upload="false"
                  color="grey"
                  flat
                  :hide-upload-button = "true"
                  :multiple="false"
                  style="min-width: 100px;max-width: clamp(100px,70vw, 600px);"
                  @added ="imgForCategoryWasAdded"
              >
                <template v-slot:header="scope">
                  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                    <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat :label="$t('message.upload_category_image')">
                      <q-uploader-add-trigger />
                    </q-btn>
                  </div>
                </template>
              </q-uploader>

              <q-img
                  v-if="ImgCategoryString64.length>0 && editingCategory.img==null"
                  v-bind:src="ImgCategoryString64"
                  spinner-color="white"
                  style="min-width: 100px;max-width: clamp(100px,50vw, 300px);top:-50px;margin:auto;"
              >
                <template v-slot:loading>
                  <q-spinner-gears color="white" />
                </template>
              </q-img>
          </div>

            <div v-if="editingCategory.is_parent_for_articles=='y'" style="display: flex;flex-direction: column;">
              <div v-if="1==2" style="display: flex; justify-content: center; padding-bottom: 1rem;">
                <span class="app__label--large q-mx-sm" >{{ $t('message.unit_of_measure') }}</span>
                <q-select outlined class="q-mx-sm" v-model="editingCategory.um1" :options="optionsUM" label="UM1" style="width:100px;" />
                <q-select outlined  v-model="editingCategory.um2" :options="optionsUM" label="UM2" style="width:100px;" />
              </div>
              <div class="draggable__list--area">
              <div style="grid-area: notselected">
                <span class="app__title--small" >{{ $t('message.inactive_features') }}</span>
                <draggable
                    class="list-group"
                    :list="listDimensionsNotUsed"
                    group="people"
                    itemKey="value"
                >
                  <template #item="{ element}">
                    <div class="draggable__list--element" style="background-color:rgba(167,151,42,0.13)"><span class="app__property--medium" >{{ element.label }}</span></div>
                  </template>
                </draggable>
              </div>
              <div style="grid-area: selected">
                <span class="app__title--small" >{{ $t('message.active_features') }}</span>
                <draggable
                    class="list-group"
                    :list="listDimensionsUsed"
                    group="people"
                    itemKey="value"
                >
                  <template #item="{ element, index }">
                    <div class="draggable__list--element"><span class="app__property--medium">{{ element.label }}</span> <span class="app__details--medium">{{ $t('message.on_position') }} {{ index+1 }}</span></div>
                  </template>
                </draggable>
              </div>
                <p class="app__color--gray" style="grid-area: help; text-align: center;padding:0.5rem;">{{ $t('message.hold_and_pull') }}</p>
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

<script lang="ts" src="./AdminCategory.ts" />

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
