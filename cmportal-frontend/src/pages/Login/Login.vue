<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-form-container">
    <div class="app-center-content-horizontal">
      <img class="logo-container" src="@/assets/color-metal-nobackground.png">
    </div>
    <p class="app-center-content-horizontal title_portal">{{ $t('message.portal_partners') }}</p>

    <div style="display: flex;align-items: center;max-height: 36px;min-height: 36px;width: 100%;justify-content: center;" class="q-px-sm">
      <q-select
        outlined
        v-model="selectedLang"
        :options="languages"
        option-value="id"
        option-label="name"
        class="form__input"
        emit-value
        dense
        map-options
        @update:model-value="val => changeLanguage(val)"
      />
    </div>
    <div style="padding:2rem;">
      <p class="input-container title_autentificare" >{{ $t('message.auth') }}</p>
      <div class="input-container">
        <span style="font-family: 'Roboto', sans-serif;font-size:1.2rem;">{{ $t('message.user') }}</span>
        <q-input
            :placeholder="$t('message.user')"
            outlined
            style="max-height: 7vh;font-family: 'Roboto', sans-serif;font-size:1.2rem;"
            v-model="user"
            @keydown.enter.prevent="focusOnPassword"
            lazy-rules
            dense
            autofocus
            autocomplete
        />
      </div>
      <br />
      <div class="input-container">
        <span style="font-family: 'Roboto', sans-serif;font-size:1.2rem;">{{ $t('message.password') }}</span>
        <q-input
            :placeholder="$t('message.password')"
            outlined
            style="max-height: 7vh;font-family: 'Roboto', sans-serif;font-size:1.2rem;"
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            @keydown.enter.prevent="focusOnBtnLogin"
            ref="refPassword"
            lazy-rules
            dense
            :rules="[val => !!val || $t('message.camp_obligatoriu')]"
            autofocus
            autocomplete
        >
          <template v-slot:append>
            <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="input-container">
        <span style="font-family: 'Roboto'; sans-serif;font-size:1.2rem;font-weight: bold;margin-bottom: 16px;">{{ $t('message.agree_with') }}:</span>
        <div>
          <q-checkbox v-model="terms"/> <span style="color: black; text-decoration: none;cursor: pointer;" @click="generarePdfGDPR('conditii')">{{ $t('message.terms') }}</span>
        </div>
        <div>
          <q-checkbox v-model="gdpr" /> <span style="color: black; text-decoration: none;cursor: pointer;" @click="generarePdfGDPR('gdpr')">{{ $t('message.gdpr') }}</span>
        </div>

        <!-- <vue-hcaptcha 
          :sitekey="sitekey"
          @verify="onVerify"
          @expired="onExpire"
          @challenge-expired="onChallengeExpire"
          @error="onError">
        </vue-hcaptcha> -->
      </div>
      <div class="btn-container">
        <q-btn :disable="!terms || !gdpr" no-caps :label="$t('message.login')" color="primary" :loading="ajaxIsLoading" text-color="black" ref="refBtnLogin" @click="onSubmit" />
      </div>
    </div>
    <q-dialog v-model="fixed" full-width>
    <q-card class="my_card" >
      <q-card-section class="row items-center">
        <div :class="$q.platform.is.mobile ? 'text-h8' : 'text-h6'">{{ pdfTitle }}</div>
        <q-btn v-if="$q.platform.is.desktop" no-caps color="primary" v-ripple @click="downloadPDF" icon="download" style="margin-left: 1rem;cursor: pointer;">{{ $t('message.download') }}</q-btn>
        <q-btn v-if="$q.platform.is.mobile" no-caps flat color="primary" icon="download" v-ripple @click="downloadPDF" style="cursor: pointer;"></q-btn>
        <q-space />
        <q-spinner v-if="isLoadingDocument"
            color="black"
            :size="$q.platform.is.mobile ? '1.5em' : '3em'"
          />
          <q-space v-if="isLoadingDocument"/>
          <q-btn v-if="$q.platform.is.desktop" icon="close" flat round dense v-close-popup/>
          <q-btn v-else icon="close" flat round dense v-close-popup @click="widthPdf=300"/>
        </q-card-section>
        <q-card-section v-if="$q.platform.is.mobile" class="my_card_2">
          <q-btn v-if="!isLoadingDocument" @click="changeWitdhPdf('in')" icon="zoom_in" style="margin-bottom: 8px;" :loading="clicked"></q-btn>
          <q-btn v-if="!isLoadingDocument" @click="changeWitdhPdf('out')" icon="zoom_out" style="margin-left: 10px;margin-bottom: 8px;" :loading="clicked"></q-btn>
          <br>
          <vue-pdf-embed :source="pdf" :width="widthPdf"/>
        </q-card-section>
        <q-card-section v-else class="my_card_2">
          <vue-pdf-embed :source="pdf"/>
        </q-card-section>
      </q-card>
  </q-dialog>
  </div>
</template>

<script lang="ts" src="./Login.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
.title_portal{
  color: #C3CFD9;
  font-family: 'Roboto', sans-serif; font-weight: bold;
  @include media_small {
    padding-top: 1rem;
    font-size: 1.2rem;
  }

  @include media_medium {
    padding-top: 1rem;
    font-size: 1.5rem;
  }

  @include media_large {
    padding-top: 2rem;
    font-size: 2rem;
  }
}

.title_autentificare{
  margin-top: 7vh;
  color:rgba(33,2,0,0.89);
  font-family: 'Roboto', sans-serif; font-weight: bold;
  @include media_small {
    font-size: 1.2rem;
  }

  @include media_medium {
    font-size: 1.5rem;
  }

  @include media_large {
    font-size: 2rem;
  }
}

.input-container {
  display: flex;
  flex-direction: column;

  @include media_small {

  }

  @include media_medium {

  }

  @include media_large {

  }
}

.btn-container{
  text-align: right;
  padding-top: 1rem;
  @include media_small {
  }

  @include media_medium {
  }

  @include media_large {

  }
}

.logo-container{
  height: auto;
  @include media_small {
    padding-top: 2rem;
    width: 90vw;
  }

  @include media_medium {
    padding-top: 2rem;
    width: 70vw;
  }

  @include media_large {
    padding-top: 2rem;
    width: 50vw;
  }
}

.login-form-container{
  margin: auto;
  @include media_small {
  }

  @include media_medium {
    max-width: clamp(300px, 30vw, 600px);
  }

  @include media_large {
    max-width: clamp(300px, 30vw, 600px);
  }
}

.my_card{
  width: 90%;
  height: 90%;
}
.my_card_2{
  width: 100%;
  height: 100%;
}
</style>
