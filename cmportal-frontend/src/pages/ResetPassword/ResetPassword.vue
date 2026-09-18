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
  
      <div style="padding:2rem;" v-if="isUserAvailable">
        <br />
        <p v-if="type == '1'" class="input-container title_autentificare" >{{ $t('message.set_password') }}</p>
        <p v-if="type == '2'" class="input-container title_autentificare" >{{ $t('message.reset_password') }}</p>
        <div class="input-container">
          <br />
          <span style="font-family: 'Roboto', sans-serif;font-size:1.2rem;">{{ $t('message.user') }}</span>
          <q-input
              :placeholder="$t('message.user')"
              outlined
              style="max-height: 7vh;font-family: 'Roboto', sans-serif;font-size:1.2rem;"
              v-model="user"
              @keydown.enter.prevent="focusOnPassword"
              lazy-rules
              dense
              disable
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
          >
            <template v-slot:append>
              <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <br/>
          <span style="font-family: 'Roboto', sans-serif;font-size:1.2rem;">{{ $t('message.confirm_password') }}</span>
          <q-input
              :placeholder="$t('message.confirm_password')"
              outlined
              style="max-height: 7vh;font-family: 'Roboto', sans-serif;font-size:1.2rem;"
              v-model="confirmPassword"
              :type="isPwd ? 'password' : 'text'"
              @keydown.enter.prevent="focusOnBtnLogin"
              ref="refPassword"
              lazy-rules
              dense
              :rules="[val => !!val || $t('message.camp_obligatoriu')]"
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
        <div class="btn-container">
          <q-btn v-if="type == '1'" no-caps :label="$t('message.set_password')" color="primary" :loading="ajaxIsLoading" text-color="black" ref="refBtnLogin" @click="onSubmitLoginData" />
          <q-btn v-if="type == '2'" no-caps :label="$t('message.reset_password')" color="primary" :loading="ajaxIsLoading" text-color="black" ref="refBtnLogin" @click="onSubmitLoginData" />
        </div>
      </div>
      <div v-else>
        <p v-if="type == '1'" class="app-center-content-horizontal">{{ $t('message.invalid_token_set_password') }}</p>
        <p v-if="type == '2'" class="app-center-content-horizontal">{{ $t('message.invalid_token_reset_password') }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts" src="./ResetPassword.ts" />
  
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
  </style>
  