<template>
<div style="margin-top: 1vh;">
  <div class="row">
    <div class="col-12 text-center">
      <q-avatar  size="7rem" >
        <q-img
            :src="urlUserImgProfileByAppid"
            style="height: 7rem; max-width: 7rem"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white text-subtitle2">
              {{$t('message.no_image')}}
            </div>
          </template>
        </q-img>
      </q-avatar>
    </div>
  </div>
  <div class="row app-center-content-horizontal" style="margin-top: 1rem;">
      <q-btn flat color="primary" :label="$t('message.reset_password')" @click="resetPassword"/>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
      {{ $t('message.user_id') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.userid }}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
      {{ $t('message.company') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.companyName }}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
      {{ $t('message.company_id') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.companyCode }}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
      {{ $t('message.first_name') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.firstName }}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
      {{ $t('message.last_name') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.lastName }}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
     {{ $t('message.email') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.emailAddress }}
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 col-md-3 app__label--small text-right q-pa-sm">
      {{ $t('message.phone') }}
    </div>
    <div class="col-sm-10 col-md-9 app__property--medium text-left q-pa-sm">
      {{ user.phoneNr }}
    </div>
  </div>
</div>
</template>


<script lang="ts" src="./UserProfile.ts" />

<style scoped>

</style>
