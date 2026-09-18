<template>
<div class="q-pa-md q-gutter-sm" style="display: flex;">
  <q-icon v-if="showBrowseCategoriesIcon"  name="category" @click="onGoToBrowseCategories(0)" class="cursor-pointer" color="primary" style="font-size:2.2rem; font-weight: bold;">
    <q-tooltip
        transition-show="scale"
        transition-hide="scale"
        anchor="center left" self="center right" :offset="[10, 10]"
    >
      {{$t('message.go_to_categories')}}
    </q-tooltip>
  </q-icon>
  <!-- <q-input v-if="showInputFastSearch" outlined   v-model="inputFastSearch" dense style="flex-grow: 1;padding: 5px;"   ref="refInputFastSearch" >
    <template v-slot:append>
      <q-icon v-if="inputFastSearch !== ''" name="close" @click="inputFastSearch = ''" class="cursor-pointer" />
      <q-icon name="search" />
    </template>
  </q-input> -->
  <div>
    <div v-for="category in hierarchicalChain" :key="category.categoryPid" @click="onGoToBrowseCategories(category.categoryPid)" class="breadcrumb__category">
      <q-icon name="arrow_right_alt" />
      <span class="breadcrumb__category">{{ $i18n.locale === 'ro' ? (category.categoryNameRO || category.categoryName) : $i18n.locale === 'en' ? (category.categoryNameEN || category.categoryName) : (category.categoryNameBG || category.categoryName) }}</span>
    </div>
  </div>

</div>
</template>

<script lang="ts" src="./HierarchicalChainBrowseHeader.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.breadcrumb__category{
  cursor: pointer;
  color: #F7C325;
  font-weight: bold;

  @include media_small {
    font-size: 1.1rem;
  }

  @include media_medium {
    font-size: 1.2rem;
  }

  @include media_large {
    font-size: 1.3rem;
  }
}

</style>