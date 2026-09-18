<template>
  <div class="q-pa-lg ecran-container ">

    <div style="display: flex;align-items: center;">
      <div v-if="$q.platform.is.desktop" class="app__page__title__container">
        <span class="app__page__title" style="white-space:nowrap"><q-icon name="description" style="font-size:2rem;top: -3px;" color="primary" /> {{$t('message.documente')}}</span>
      </div>
    </div>
    <div v-for="document in arrDocuments" :key="document.appid" class="dashboard__document__section app__border__bottom" >
      <div class="dashboard__document__details">
        <span class="app__label--small">{{$t('message.document_type')}}</span><span class="app__color--blue">{{document.tipDocument}}</span>
        <span class="app__label--small">{{$t('message.date')}}</span><span class="app__property--small">{{document.dataDocument}}</span>
        <span class="app__label--small">Id</span><span class="app__property--small">{{document.idDocument}}</span>
      </div>
      <div class="dashboard__document__icons" >
        <q-icon name="download" style="color:#2C88D9; font-size: 1.7rem;"/>
        <q-icon name="search" style="color:#F7C325; font-size: 1.7rem;"/>
      </div>
    </div>

  </div>
</template>

<script lang="ts" src="./AdminSystemParameters.ts" />

<style scoped lang="scss">
@import "../../../assets/mixins";
.ecran-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  @include media_small {
    padding-left: 3vw;
    padding-right: 3vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 2vh;
    padding-left: 2vw;
    padding-right: 2vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 2vh;
    padding-left: 2vw;
    padding-right: 2vw;
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

.dashboard__document__icons{
  position: relative;
  display: flex;

  @include media_small {
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-evenly;
  }

  @include media_medium {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-evenly;
  }

  @include media_large {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-evenly;
  }
}

</style>
