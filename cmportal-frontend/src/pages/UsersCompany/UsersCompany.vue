<template>
  <div class="ecran-container " style="min-height:75vh;">
    <div v-if="$q.platform.is.desktop" style="display: flex;align-items: center;">
      <div class="app__color--label q-ma-md" >
        <span style="white-space:nowrap;font-size:2rem;"><q-icon name="people" style="font-size:2rem;margin-top: -5px;" color="primary" /> {{ $t('message.users') }}</span>
      </div>
    </div>

    <div  class="dashboard__section" v-for="user in users" :key="user.appid">
      <div class="dashboard__div__content app__border__bottom" >
        <q-avatar  size="7rem" style="grid-area: avatar; margin-right: 1rem;" >
          <q-img
              :src="user.urlUserImgProfileByAppid"
              style="height: 7rem; max-width: 7rem"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white text-subtitle2">
                {{$t('message.no_image')}}
              </div>
            </template>
          </q-img>
        </q-avatar>
        <div class="dashboard__div__parameter" style="grid-area: nume;">
          <span class="app__property--medium">{{ user.firstName }}</span>
        </div>
        <div class="dashboard__div__parameter" style="grid-area: prenume">
          <span class="app__property--medium">{{ user.lastName }}</span>
        </div>
        <div class="dashboard__div__parameter" style="grid-area: functie">
          {{ user.functie }}
        </div>
        <div class="dashboard__div__parameter" style="grid-area: telefon">
          {{ user.phoneNr }}
        </div>
        <div class="dashboard__div__parameter email" style="grid-area: email">
          {{ user.email }}
        </div>
      </div>
    </div>

    <!--
    <div  class="dashboard__section" style="margin: auto;">
      <ContacteleMeleColorMetal />
    </div>
    -->
  </div>
</template>

<script lang="ts" src="./UsersCompany.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.ecran-container {
  display: flex;
  justify-content: flex-start  !important;
  flex-direction: column;
  margin: 0 auto;

  @include media_small {
    padding-left: 5vw;
    padding-right: 5vw;
    background-color: white;
  }

  @include media_medium {
    padding-top: 5vh;
    justify-content: center;
    padding-left: 2vw;
    padding-right: 2vw;
  }

  @include media_large {
    padding-top: 5vh;
    justify-content: center;
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

.dashboard__section{
  @include media_small {
  }

  @include media_medium {
    padding-top: 1rem;
    justify-content: center;
  }

  @include media_large {
    padding-top: 1.5rem;
    justify-content: center;
  }
}

.dashboard__div__parameter{
  font-family: 'Roboto', sans-serif;
  font-weight: 100;

  @include media_small {
    font-size: 0.9rem;
    color: $title-color;
  }

  @include media_medium {
    font-size: 1rem;
    color: $title-color;
    align-self:center;
  }

  @include media_large {
    font-size: 1rem;
    color: $title-color;
    align-self:center;
  }
}

.dashboard__div__content {
  display: grid;
  align-items: start;
  padding-top:1rem;
  padding-bottom: 1rem;
  @include media_small {
    grid-template-areas:
    'avatar      nume nume'
    'avatar      prenume prenume'
    'avatar      functie functie'
    'avatar      telefon telefon'
    'avatar      email email';
    justify-items: start;
    justify-content: start;
  }

  @include media_medium {
    grid-column-gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'avatar nume prenume functie telefon email';
  }

  @include media_large {
    grid-column-gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
    grid-template-areas: 'avatar nume prenume functie telefon email';
  }
}

.email{

  @include media_small {
    font-size: 0.8rem;
    font-family: 'PT Sans Narrow', sans-serif;
  }

  @include media_medium {

  }

  @include media_large {

  }
}
</style>
