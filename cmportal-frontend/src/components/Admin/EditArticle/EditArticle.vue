<template>
  <div style="margin-top: 1vh;">
    <div class="row">
      <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="form__edit__article"
      >
        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only">{{$t('message.code_article_nav')}}</div>
          <div class="col-9 app__property--medium">
            <q-input
                outlined
                dense
                v-model="article.code"
                class="form__input"
                label=""
                @keydown.enter.prevent="focusOnArticleName"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.please_type_something')]"
            >
              <template v-slot:label v-if="$q.platform.is.mobile">
                {{$t('message.code_article_nav')}}
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only">{{$t('message.name')}} RO</div>
          <div class="col-9 app__property--medium">
            <q-input
                outlined
                dense
                v-model="article.name_ro"
                class="form__input"
                ref="refArticleName"
                label=""
                @keydown.enter.prevent="focusOnCategorySelection"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.camp_obligatoriu')]"
            >
              <template v-slot:label v-if="$q.platform.is.mobile">
                {{$t('message.name')}} RO
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only">{{$t('message.name')}} EN</div>
          <div class="col-9 app__property--medium">
            <q-input
                outlined
                dense
                v-model="article.name_en"
                class="form__input"
                ref="refArticleName"
                label=""
                @keydown.enter.prevent="focusOnCategorySelection"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.camp_obligatoriu')]"
            >
              <template v-slot:label v-if="$q.platform.is.mobile">
                {{$t('message.name')}} EN
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only">{{$t('message.name')}} BG</div>
          <div class="col-9 app__property--medium">
            <q-input
                outlined
                dense
                v-model="article.name_bg"
                class="form__input"
                ref="refArticleName"
                label=""
                @keydown.enter.prevent="focusOnCategorySelection"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.camp_obligatoriu')]"
            >
              <template v-slot:label v-if="$q.platform.is.mobile">
                {{$t('message.name')}} BG
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only" >{{$t('message.category')}}</div>
          <div class="col-9 app__property--medium" style="display: flex;flex-direction: column; gap: 8px;">
            <div v-if="article.categories.length > 0" style="display: flex;flex-direction: column; gap: 8px;">
              <div v-for="(categ, index) in article.categories" :key="categ.pid" style="display: flex;flex-direction: row;width: 100%;align-items: center;">
                <q-select
                    outlined
                    dense
                    ref="refArticleCategorySelection"
                    v-model="categ.pid"
                    :fill-input="true"
                    :emit-value="true"
                    :map-options="true"
                    option-value="pid"
                    :option-label="'lantHierarchyCategories' + $i18n.locale.toUpperCase()"
                    label=""
                    @update:model-value="value => replaceCategoryDetailsAndSetSizes(value, index)"
                    :options="filteredOptionsCategories"
                    @filter="filterFnCategories"
                    style="flex: 1;"
                >
                  <template v-slot:label v-if="$q.platform.is.mobile">
                    {{$t('message.category')}}
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{$t('message.no_results')}}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-btn icon="delete" color="red" dense flat style="margin-left: 8px;" @click="removeCategory(index)">
                  <q-tooltip>
                    {{$t('message.delete_category')}}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <div style="display: flex;flex-direction: row;width: 100%;align-items: center;margin-bottom: 8px;">
              <q-select
                    outlined
                    dense
                    ref="refArticleCategorySelection"
                    v-model="categoryToAdd.pid"
                    :fill-input="true"
                    :emit-value="true"
                    :map-options="true"
                    option-value="pid"
                    :option-label="'lantHierarchyCategories' + $i18n.locale.toUpperCase()"
                    label=""
                    @update:model-value="getCategoryDetailsAndSetSizes"
                    :options="filteredOptionsCategories"
                    @filter="filterFnCategories"
                    style="flex: 1;"
                >
                  <template v-slot:label v-if="$q.platform.is.mobile">
                    {{$t('message.category')}}
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{$t('message.no_results')}}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <!-- <q-btn icon="add" color="blue" dense style="margin-left: 8px;" @click="adaugaCategorie()">
                  <q-tooltip>
                    Adauga categorie
                  </q-tooltip>
                </q-btn> -->
              </div>
          </div>
        </div>

        <div class="row justify-start">
          <div class="col-12 app__label--medium mobile-only" style="padding-top: 1rem;">{{$t('message.measure_units')}}</div>
          <div class="col-3 app__label--medium desktop-only">{{$t('message.measure_units')}}</div>
          <div class="col-9 ">
            <div class="row justify-start">
                <q-select outlined v-model="article.um1" :options="optionsUM" label="UM1" style="width:100px;" />
                <q-select outlined class="q-mx-sm" v-model="article.um2" :options="optionsUM" label="UM2" style="width:100px;" />
              <q-input
                  outlined
                  :disable="!article.um2"
                  ref="refThickness"
                  v-model="article.um1ToUm2"
                  :label="$t('message.indice_transformare')"
                  class="form__input--sizes"
              />

             <!-- <div class="col-3" style="margin-left: 1rem;">
                <q-radio dense v-model="article.UMBase" val="kg" label="kg" class="app__property--medium"/>
              </div>
              <div class="col-3" style="margin-left: 1rem;">
                <q-radio dense v-model="article.UMBase" val="mm" label="mm" class="app__property--medium"/>
              </div>
              <div class="col-3" style="margin-left: 1rem;">
                <q-radio dense v-model="article.UMBase" val="mp" label="mp" class="app__property--medium"/>
              </div>
              -->
            </div>
          </div>
        </div>

        <div class="row justify-start">
          <div class="col-12 app__label--medium mobile-only" style="padding-top: 1rem;"></div>
          <div class="col-3 app__label--medium desktop-only">{{$t('message.configuration')}}</div>
          <div class="col-9 ">
            <div class="row justify-start" style="gap: 8px;">
              <div class="col-auto">
                <q-input
                    outlined
                    dense
                    ref="refLength"
                    :disable="!article.withLength"
                    v-model="article.sizeLength"
                    :label="$t('message.length') + ' (mm)'"
                    class="form__input--sizes"
                />
              </div>
              <div class="col-auto">
                <q-input
                    outlined
                    dense
                    :disable="!article.withWidth"
                    ref="refWidth"
                    v-model="article.sizeWidth"
                    :label="$t('message.width') + ' (mm)'"
                    class="form__input--sizes"
                />
              </div>
              <div class="col-auto">
                <q-input
                    outlined
                    dense
                    :disable="!article.withThickness"
                    ref="refThickness"
                    v-model="article.sizeThickness"
                    :label="$t('message.thickness') + ' (mm)'"
                    class="form__input--sizes"
                />
              </div>
              <div class="col-auto">
                <q-input
                    outlined
                    dense
                    :disable="!article.withDiameter"
                    ref="refDiameter"
                    v-model="article.sizeDiameter"
                    :label="$t('message.diameter') + ' (mm)'"
                    class="form__input--sizes"
                />
              </div>
              <div class="col-auto">
                <q-input
                    outlined
                    dense
                    :disable="!article.withHeight"
                    ref="refHeight"
                    v-model="article.sizeHeight"
                    :label="$t('message.height') + ' (mm)'"
                    class="form__input--sizes"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only">{{$t('message.aliaj')}}</div>
          <div class="col-9 app__property--medium">
            <q-input
                outlined
                dense
                v-model="article.sizeAlloy"
                class="form__input"
                ref="refArticleAliaj"
                label=""
                :disable="!article.withAlloy"
                @keydown.enter.prevent="focusOnArticleType"
                lazy-rules
                :rules="[ val => val && val.length && article.withAlloy > 0 || $t('message.enter_alloy')]"
            >
              <template v-slot:label v-if="$q.platform.is.mobile">
                {{$t('message.aliaj')}}
              </template>
            </q-input>
          </div>
        </div>


        <div class="row justify-start">
          <div class="col-3 app__label--medium desktop-only">{{$t('message.type')}}</div>
          <div class="col-9 app__property--medium">
            <q-input
                outlined
                dense
                v-model="article.sizeType"
                class="form__input"
                ref="refArticleType"
                label=""
                :disable="!article.withType"
                lazy-rules
                :rules="[ val => val && val.length > 0 && article.withType|| $t('message.enter_type')]"
            >
              <template v-slot:label v-if="$q.platform.is.mobile">
                {{$t('message.type')}}
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-start">
          <div class="col-3 app__label--medium">{{$t('message.client_visible')}}</div>
          <div class="col-9 app__property--medium">
            <q-toggle
                v-model="article.isActive"
                :true-value="true"
                :false-value="false"
            />
          </div>
        </div>

        <div style="display: flex;justify-content: flex-end;">
          <q-btn :label="$t('message.reset')" type="reset" color="primary" flat disable class="q-ml-sm" no-caps/>
          <q-btn :label="$t('message.save')" type="submit" color="primary"  no-caps text-color="black"/>
        </div>
      </q-form>

    </div>
  </div>
</template>


<script lang="ts" src="./EditArticle.ts" />

<style scoped lang="scss">
@import "../../../assets/mixins";
.form__edit__article{
  display: flex;
  flex-direction: column;
  margin: auto;
  justify-content: space-around;
  font-family: 'Roboto', sans-serif; font-weight: bold;
  @include media_small {
    font-size: 1.2rem;
    min-width: 90vw;
    max-width: 90vw;
  }

  @include media_medium {
    min-width: 90vw;
    max-width: 90vw;
    font-size: 1.5rem;
    min-height: 70vh;
  }

  @include media_large {
    min-width: 70vw;
    max-width: 70vw;
    padding-top: 2rem;
    font-size: 2rem;
    min-height: 70vh;
  }
}

.form__input--sizes{
  font-family: 'Roboto', sans-serif;
  font-size:1.2rem;
  margin-bottom: 1rem;
  @include media_small {
    max-width:70vw;
  }

  @include media_medium {
    min-width:8rem;
    max-width:8rem;
  }

  @include media_large {
    min-width:10rem;
    max-width:10rem;
  }
}


</style>
