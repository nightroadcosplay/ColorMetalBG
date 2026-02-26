<template>
  <div>
    <HierarchicalChainBrowseHeader :hierarchicalChain="hierarchicalChain" />
    <div :class="'ecran-container'">

    <!--<div v-if="pid!='0'" class="app__color--label app__page__title" >{{ selectedCategory.name }}</div>-->

      <div  v-for="mainCateg in categories" v-bind:key="mainCateg.pid" v-bind:class="{ content__category__with__articles: mainCateg.isParentForArticles=='y'}">
        <div v-if="mainCateg.isParentForArticles=='n'" class="dashboard__div__title">{{ $i18n.locale === 'ro' ? mainCateg.name_ro : $i18n.locale === 'en' ? mainCateg.name_en : mainCateg.name_bg }}</div>
        <div  class="category__div__content">
          <div v-if="mainCateg.isParentForArticles=='y'" >
            <CategoryImg :category="mainCateg" @click="browseCategory(mainCateg)" />
          </div>
          <div v-else class="subcategories">
            <div  v-for="subcategory in mainCateg.children" v-bind:key="subcategory.pid" >
              <CategoryImg :category="subcategory"  @click="browseCategory(subcategory)"/>
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
</template>

<script lang="ts" src="./BrowseCategories.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {

  @include media_small {
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 5vh;
    padding-left: 5vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    background-color: white;
  }
}
.ecran-container-row {

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  @include media_small {
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 5vh;
    padding-left: 5vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    background-color: white;
  }
}



.dashboard__div__title{
  @include media_small {
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
  }

  @include media_medium {
    font-size: 1.1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  @include media_large {
    font-size: 1.2rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

.category__div__content {
  @include media_small {
    margin-bottom: 1rem;
  }

  @include media_medium {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  @include media_large {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
}

.subcategories{
  font-family: 'Roboto', sans-serif;
  font-weight: 100;

  @include media_small {
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: $title-color;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  @include media_medium {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 1rem;
    color: $title-color;
  }

  @include media_large {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 1.1rem;
    color: $title-color;
  }
}

.content__category__with__articles{

  @include media_small {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  @include media_medium {
    display: inline-block;
    padding: 0.5rem;
  }

  @include media_large {
    display: inline-block;
    padding: 0.5rem;
  }
}
</style>
