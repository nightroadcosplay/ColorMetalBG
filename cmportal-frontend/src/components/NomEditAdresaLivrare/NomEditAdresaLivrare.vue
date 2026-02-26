<template>
  <div class="q-pa-sm ecran-container ">
    <div class="q-pa-md flex__column--center" style="max-width: 30rem;margin:auto;">

      <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
      >
        
        
        <q-select
            outlined
            :readonly="adresa.slid != '0'"
            v-model="adresa.codTara"
            :options="countryOptions"
            :label="$t('message.country')"
            option-value="code"
            option-label="name"
            class="form__input"
            lazy-rules
            emit-value
            map-options
            :rules="[ val => val && val.length > 0 || $t('message.enter_field')]"
        />

        <q-select
            v-if="adresa.codTara == 'RO'"
            outlined
            :readonly="adresa.slid != '0'"
            use-input
            v-model="adresa.adresaCodJudet"
            :options="judeteOptions"
            :label="$t('message.county')"
            option-value="code"
            option-label="name"
            class="form__input"
            lazy-rules
            emit-value
            map-options
            :rules="[ val => val && val.length > 0 || $t('message.enter_field')]"
        />

        <q-input
            v-else
            outlined
            :readonly="adresa.slid != '0'"
            v-model="adresa.denJudet"
            :label="$t('message.county')"
            class="form__input"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.enter_field')]"
        />

        <q-input
            outlined
            :readonly="adresa.slid != '0'"
            v-model="adresa.adresaLocalitate"
            :label="$t('message.city')"
            class="form__input"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.enter_field')]"
        />

        <q-input
            outlined
            :readonly="adresa.slid != '0'"
            v-model="adresa.adresaAdresa"
            :label="$t('message.address')"
            class="form__input"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.enter_field')]"
        />


        <div v-if="adresa.slid == '0'" style="display: flex;justify-content: flex-end;">
          <q-btn :label="$t('message.reset')" type="reset" color="primary" flat class="q-ml-sm" />
          <q-btn :label="$t('message.save')" type="submit" color="primary"/>
        </div>
      </q-form>

    </div>

  </div>
</template>

<script lang="ts" src="./NomEditAdresaLivrare.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
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
    padding-left: 10vw;
    padding-right: 10vw;
    background-color: white;
  }

  @include media_large {
    padding-top: 5vh;
    max-width: 90vw;
    background-color: white;
  }
}

.dashboard__section{
  @include media_small {
  }

  @include media_medium {
    adding-top: 1rem;
  }

  @include media_large {
    padding-top: 1.5rem;
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

.dashboard__div__parameter{
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 100;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 0.9rem;
    color: $title-color;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  @include media_medium {
    font-size: 1rem;
    color: $title-color;
  }

  @include media_large {
    font-size: 1.1rem;
    color: $title-color;
  }
}

.dashboard__div__content {
  @include media_small {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  @include media_medium {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  @include media_large {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
}

.adresa_livrare--remove--btn{

  @include media_small {
    margin-left: auto;
    position: relative;
    top:-3rem;
  }

  @include media_medium {

  }

  @include media_large {

  }
}

.form__input{
  @include media_small {
    min-width:80vw;
  }

  @include media_medium {
    min-width:30rem;
  }

  @include media_large {
    min-width:37rem;
  }
}
</style>
