<template>
  <div>
    <q-item clickable v-ripple  @click="goToView('Dashboard')">
      <q-item-section avatar>
        <q-icon color="primary" name="dashboard" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{$t('message.main_page')}}
          <!-- <q-badge color="blue" transparent style="position: relative;top:-5px;">
            77
          </q-badge>
          <q-badge v-if="nrOfPendingToRegister>0" color="orange" transparent style="position: relative;top:-5px;left:5px;">
            55
          </q-badge> -->
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple  @click="onGoToBrowseCategories">
      <q-item-section avatar>
        <q-icon color="primary" name="category" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{$t('message.items')}}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple  @click="openTehnipedia">
      <q-item-section avatar>
        <q-icon color="primary"><img src="@/assets/tehnipedia.png"/></q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{$t('message.tehnipedia')}}
        </q-item-label>
      </q-item-section>
    </q-item>


    <q-separator inset  v-if="user.isAdmin=='y'" />
    <q-item-label v-if="user.isAdmin=='y'" header>{{$t('message.manage')}}</q-item-label>

    <q-item  clickable v-ripple v-if="user.isAdmin=='y'" @click="goToView('AdminSystemParameters')">
      <q-item-section avatar>
        <q-icon color="primary" name="settings" />
      </q-item-section>
      <q-item-section>{{$t('message.system_parameters')}}</q-item-section>
    </q-item>

    <q-item  clickable v-ripple v-if="user.isAdmin=='y'" @click="goToView('AdminCompanies')">
      <q-item-section avatar>
        <q-icon color="primary" name="apartment" />
      </q-item-section>
      <q-item-section>{{$t('message.companies')}}</q-item-section>
    </q-item>

    <q-item  clickable v-ripple v-if="user.isAdmin=='y'" @click="goToView('AdminUsers')">
      <q-item-section avatar>
        <q-icon color="primary" name="group_add" />
      </q-item-section>
      <q-item-section>{{$t('message.users')}}</q-item-section>
    </q-item>

    <q-item  clickable v-ripple v-if="user.isAdmin=='y'" @click="goToView('AdminCategory')">
      <q-item-section avatar>
        <q-icon color="primary" name="qr_code" />
      </q-item-section>
      <q-item-section>{{$t('message.categories')}}</q-item-section>
    </q-item>

    <q-item  clickable v-ripple v-if="user.isAdmin=='y'" @click="goToView('AdminArticles')">
      <q-item-section avatar>
        <q-icon color="primary" name="qr_code" />
      </q-item-section>
      <q-item-section>{{$t('message.items')}}</q-item-section>
    </q-item>

    <q-item  clickable v-ripple v-if="user.isAdmin=='y'" @click="goToView('AdminTipuri')">
      <q-item-section avatar>
        <q-icon color="primary" name="qr_code" />
      </q-item-section>
      <q-item-section>{{$t('message.types')}}</q-item-section>
    </q-item>

    <q-separator inset   />

    <q-item clickable v-ripple  @click="goToMyProfile">
      <q-item-section avatar>
        <q-icon color="primary" name="sentiment_satisfied_alt" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{$t('message.my_profile')}}
        </q-item-label>
      </q-item-section>
    </q-item>

    
    <q-item clickable v-ripple  @click="logout">
      <q-item-section avatar>
        <q-icon color="primary" name="logout" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{$t('message.log_out')}}
        </q-item-label>
      </q-item-section>
    </q-item>

    <!--
    <div class="absolute-bottom flex__row--center">
        <img src="/images/logo_mediu_ro.png" style="margin-bottom: 10px;">
    </div>
    -->
  </div>
</template>

<script lang="ts" src="./MenuApp.ts" />

<style scoped>

</style>
