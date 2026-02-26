<template>
  <div class="q-pa-sm ecran-container ">
    <div style="display: flex;align-items: center;">
      <div v-if="$q.platform.is.desktop" class="app__page__title__container">
        <span class="app__page__title" style="white-space:nowrap"><q-icon name="apartment" style="font-size:2rem;top: -3px;" color="primary" /> {{ $t('message.companies') }}</span>
      </div>
        <div style="margin-left: auto">
          <q-input bottom-slots debounce="300" v-model="filterText" dense>
            <template v-slot:append>
              <q-icon v-if="filterText !== ''" name="close" @click="filterText = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
    </div>
      <q-table
          v-if="$q.platform.is.mobile"
          grid
          :rows-per-page-options="[10, 20]"
          :rows="companies"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="appid"
          :loading="loadingData"
          :pagination="myPagination"
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card>
              <q-card-section style="display: flex;">
                <div style="display: flex; flex-direction: column;margin-left:1rem;">
                  <span class="app__property--medium">{{ $t('message.fiscal_code') }}: {{ props.row.cif }}</span>
                  <span class="app__property--medium">{{ props.row.denumire }}</span>
                  <span class="app__property--medium">{{ $t('message.company_id') }}: {{ props.row.navisionid }}</span>
                </div>
                <q-icon name="manage_accounts" class="text-blue cursor-pointer" style="font-size: 1.5rem; margin-left: auto;" @click="openUserAdminForCompany(props.row.appid)" />
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
          :rows="companies"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="appid"
          :loading="loadingData"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="cif" :props="props">
              <q-icon name="manage_accounts" class="text-blue cursor-pointer" style="font-size: 1.5rem;" @click="openUserAdminForCompany(props.row.appid)" />
              {{ props.row.cif }}
            </q-td>
            <q-td key="navisionid" :props="props">
              {{ props.row.navisionid }}
            </q-td>
            <q-td key="denumire" :props="props">
              {{ props.row.denumire }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="currentPage"
          :max="totalNumberOfPages"
          input
      />
    </div>


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
          <component v-bind:is="dynamicComponent" :userappid="selectedUser.appid" :fnOnSaveData="fnOnSaveData" ></component>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" src="./AdminCompanies.ts" />

<style scoped>

</style>
