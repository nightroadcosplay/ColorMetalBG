<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="q-pa-lg ecran-container" style="font-family: 'Roboto', sans-serif;">
        <div style="display: flex;align-items: left;justify-content: left;">
            <div v-if="$q.platform.is.desktop" class="app__page__title__container">
                <div class="app__page__title" style="white-space:nowrap;"><q-icon name="warning_amber" style="font-size:2rem;position: relative;top: -3px;" color="red" /> {{$t('message.alerts')}}</div>
            </div>
        </div>

        <div class="q-pa-md">
            <q-table
            :grid="$q.platform.is.mobile"
            class="my-sticky-header-table"
            title=""
            :rows-per-page-options="[0]"
            v-model:pagination="pagination"
            :rows="alerts"
            :cols="alerts"
            :columns="columns"
            :visible-columns="visibleColumns"
            row-key="name"
            flat
            bordered
            >
            <template v-slot:body="props">
            <q-tr :props="props">
                <q-td key="data" :props="props">
                {{props.row.date}}
                </q-td>
                <q-td key="descriere" :props="props">
                {{ props.row.description }}
                </q-td>
                <q-td key="action" :props="props">
                <q-btn flat color="black"  align="center" icon="more_vert" style="min-width: 4rem;" @click="openAlert(props.rowIndex)"/>
                </q-td>
            </q-tr>
            </template>

            <template v-slot:item="props">
                <q-card class="my_card" style="background-color: white;">
                    <q-list dense>              
                    <q-item key="data" :props="props">
                        <q-item-section>
                            <q-item-label>{{$t('message.date_time')}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label caption>{{ props.row.date }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item  key="descriere" :props="props">
                        <q-item-section>
                            <q-item-label>{{$t('message.description')}}:</q-item-label>
                            <q-item-label caption class="text-right">{{ props.row.description }} </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item key="action" :props="props">
                        <q-item-section>
                            <q-item-label>{{$t('message.options')}}:</q-item-label>
                        </q-item-section>
                    </q-item>
                    </q-list>
                    <!-- <q-separator></q-separator> -->
                    <q-card-section>
                        <q-btn flat color="black"  align="center" icon="more_vert" style="min-width: 4rem;" @click="openAlert(props.rowIndex)"/>
                    </q-card-section>
                </q-card>
            </template>
            
            </q-table>

            <q-dialog v-model="showAlert" :full-width="$q.platform.is.mobile">
                <invoice-model :bill_nr="bill_nr"></invoice-model>
            </q-dialog>
        </div>
    </div>
</template>

<script lang="ts" src="./Alerte.ts" />

<style scoped lang="scss">
@import "../../assets/mixins";
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

.my_card{
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
}
.my_card_2{
  width: 100%;
  margin-bottom: 1rem;
}

</style>

