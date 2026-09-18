<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-sm ecran-container ">
    <div style="display: flex;align-items: center;">
        <div v-if="$q.platform.is.desktop" class="app__page__title__container">
          <span class="app__company__title">{{$t('message.dashboard_admin')}}</span>
          <span class=" app__page__title" style="white-space:nowrap"><q-icon name="group_add" style="font-size:2rem;top: -3px;" color="primary" /> {{ $t('message.users') }} {{company.name}}</span>
        </div>

        <div style="margin-left: auto">
          <q-btn
              v-if="$q.platform.is.desktop"
              style="margin-top: 1rem;margin-right: 1rem;"
              padding="xs"
              color="blue"
              icon="add"
              @click="openFormAddNewUser"
          />
        </div>
      </div>
      <q-table
          v-if="$q.platform.is.mobile"
          grid
          :rows-per-page-options="[10, 20]"
          :rows="users"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="appid"
          :filter="filter"
          :loading="loadingData"
          :pagination="myPagination"
      >
        <template  v-slot:top>
          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card>
              <q-card-section style="display: flex;">
                <q-avatar  size="52px" v-close-popup  >
                  <img :src="props.row.urlUserImgProfileByAppid">
                </q-avatar>
                <div style="display: flex; flex-direction: column;margin-left:1rem;">
                  <span class="app__property--medium">{{ props.row.firstName }}</span>
                  <span class="app__property--medium">{{ props.row.lastName }}</span>
                </div>
                <q-icon name="manage_accounts" class="text-blue cursor-pointer" style="font-size: 1.5rem; margin-left: auto;" @click="openUserDetails(props.row.appid)" />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div style="display: flex; flex-direction: column; margin-left: 10px;">
                  <table>
                    <tr><td style="text-align: right"><span class="app__label--small">{{ $t('message.user_id') }}:</span></td><td><span>{{ props.row.userid }}</span></td></tr>
                    <tr><td style="text-align: right"><span class="app__label--small">{{ $t('message.company') }}:</span></td><td><span>{{ props.row.companyName }}</span></td></tr>
                    <tr><td style="text-align: right"><span class="app__label--small">{{ $t('message.phone') }}:</span></td><td><span>{{ props.row.phoneNr }}</span></td></tr>
                    <tr><td style="text-align: right"><span class="app__label--small">{{ $t('message.email') }}:</span></td><td><span>{{ props.row.emailAddress }}</span></td></tr>
                  </table>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
      <q-table
          v-else
          dense
          flat
          :rows-per-page-options="[0]"
          hide-bottom
          :rows="users"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="appid"
          :filter="filter"
          :loading="loadingData"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="userid" :props="props">
              <q-icon name="manage_accounts" class="text-blue cursor-pointer" style="font-size: 1.5rem;" @click="openUserDetails(props.row.appid)" />
              <span class="app__property--medium">{{ props.row.userid }}</span>
            </q-td>
            <q-td key="firstName" :props="props">
              {{ props.row.firstName }}
            </q-td>
            <q-td key="lastName" :props="props">
              {{ props.row.lastName }}
            </q-td>
            <q-td key="phoneNr" :props="props">
              {{ props.row.phoneNr }}
            </q-td>
            <q-td key="emailAddress" :props="props">
              {{ props.row.emailAddress }}
            </q-td>
            <q-td key="isDisabled" :props="props">
              {{ props.row.isDisabled }}
            </q-td>
            <q-td key="Company" :props="props">
              {{ props.row.companyCode }} {{ props.row.companyName }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

    <q-dialog
        v-model="dialogUser"
        persistent
        :maximized="true"
        :transition-show="dialogTransitionShow"
        :transition-hide="dialogTransitionHide"
    >
      <q-card class="bg-white">
        <q-bar>
          <q-btn dense v-if="$q.platform.is.mobile" flat  color="blue" align="center" v-close-popup >
            <q-icon name="arrow_back_ios" style="font-weight: bold" />
          </q-btn>
          <div class="app__title--small" v-if="$q.platform.is.desktop" style="position: absolute;left: 50%;margin-left: -100px;">{{titleComponent}}</div>
          <div class="app__title--small" v-if="$q.platform.is.mobile" style="position: absolute;left: calc(50% - 100px);">{{titleComponent}}</div>
          <q-space dense v-if="$q.platform.is.desktop" />

          <q-btn dense v-if="$q.platform.is.desktop" flat icon="close" color="black" v-close-popup>
            <q-tooltip content-class="bg-grey text-white">{{$t('message.close')}}</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <component v-bind:is="dynamicComponent" :userappid="selectedUser.appid" :companyAppid="companyAppid" :fnOnSaveData="fnOnSaveData" ></component>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" src="./Users.ts" />

<style scoped>

</style>
