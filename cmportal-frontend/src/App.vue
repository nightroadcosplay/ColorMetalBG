<template>
  <q-layout view="hHh lpR fFf">

    <q-header v-if="sessionIsValid" bordered style="background-color: #FFFFFF;color:black;">
      <q-toolbar v-if="$q.platform.is.desktop">
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <img src="@/assets/color-metal-nobackground.png" style="width:15rem;cursor: pointer;" @click="goToDashboard">

        <q-toolbar-title v-if="$q.screen.width > 1900" class="app__color--gray">
          {{$t('message.portal')}}
        </q-toolbar-title>

        <q-toolbar-title style="text-align:center;">
          <span class="title__current__page">{{currentPageTitle}}</span>
        </q-toolbar-title>

        <div v-if="userIsAuthenticated" class="q-px-sm">
          <div style="display: flex; align-items: center; min-width: 15rem;" >
            <div>
            <q-btn flat no-caps @click="goToDashboard"><q-icon name="dashboard" style="font-size:1.6rem;position: relative;" color="primary" /> {{$t('message.main_page')}}</q-btn>
            <q-btn flat no-caps @click="onGoCautaArticole"><q-icon name="category" style="font-size:1.6rem;position: relative;" color="primary" /> {{$t('message.search_items')}}</q-btn>
            <q-btn flat no-caps @click="onGoToOffers"><q-icon name="shop" style="font-size:1.6rem;position: relative;" color="primary" />{{$t('message.offers')}}
              <q-badge color="red" class="badge__superscript--top" style="height: 1rem;margin-left: 4px;" v-if="userStore.countOferte>0">
                {{ userStore.countOferte }}
              </q-badge>
            </q-btn>
            </div>
            <div style="display: flex;flex-direction:column;">
              <span  class="app__color--gray" v-bind:class="{ 'text-orange': nrArticlesInFavorites>0}"></span>
            </div>
            <q-btn flat no-caps @click="goToFavorite">
              <q-icon left name="favorite_border" color="red"  />
              <span class="app__label--medium">{{$t('message.favorite')}}</span>
              <q-badge color="red" floating>{{ nrArticlesInFavorites }}</q-badge>
            </q-btn>


            <q-btn flat round  color="primary" text-color="#9EADBA" icon="shopping_cart" :ripple="{ color: 'yellow' }" class="app__color--gray q-px-sm" @click="onGoTOMyShoppingCart" />
            <div style="display: flex;flex-direction:column; cursor:pointer; " @click="onGoTOMyShoppingCart" >
              <span  class="app__color--golden">{{$t('message.my_basket')}}</span>
              <span  class="app__color--gray" v-bind:class="{ 'text-orange': nrArticlesInBasket>0}">{{nrArticlesInBasket}} {{$t('message.items')}}</span>
            </div>
          </div>
        </div>

        <div v-if="userIsAuthenticated" style="display: flex;align-items: center;" class="q-px-sm">
          <span v-if="userCompanies.length <= 1" class="app__color--label">{{user.companyName}}</span>
          <q-select
            v-else
            outlined
            v-model="user.companyName"
            :options="userCompanies"
            option-value="cif"
            option-label="denumire"
            class="form__input"
            emit-value
            map-options
            @update:model-value="val => changeCompanyUser(val)"
          />
        </div>
        <div v-if="userIsAuthenticated" style="display: flex;align-items: center;max-height: 36px;min-height: 36px" class="q-px-sm">
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
        <q-btn flat v-if="userIsAuthenticated"  class="app__color--label" no-caps :label="user.firstName+' '+user.lastName">
          <q-avatar size="42px" style="margin-left: 4px;" v-if="MyImgProfileString64.length>10" >
            <img :src="MyImgProfileString64" fit="scale-down" ratio="1">
          </q-avatar>
          <q-icon v-else name="person" />
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md app__color--label">{{$t('message.my_setting')}}</div>
                <q-input
                    outlined
                    dense
                    :label="$t('message.nr_rows_in_table')"
                    type="number"
                    v-model="nrRanduriTabel"
                    lazy-rules
                    style="max-width: 120px;max-height: 7vh;"
                    @input="setNrRanduriTabel"
                />
                <q-btn
                    style="margin-top: auto"
                    color="primary"
                    :label="$t('message.log_out')"
                    outline
                    push
                    size="sm"
                    @click="logout"
                    v-close-popup
                />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center" >

                <div class="text-h6 q-mb-md" >
                  <span class="app__color--label">{{$t('message.profile')}}</span>
                  <q-icon left size="15px" name="edit" v-close-popup @click="goToMyProfile" class="is_clickable" style="position: relative;top:-7px;left:7px;">
                    <q-tooltip
                        transition-show="rotate"
                        transition-hide="rotate"
                    >
                      {{$t('message.click_edit_profile')}}
                    </q-tooltip>
                  </q-icon>
                </div>
                <q-avatar v-if="MyImgProfileString64.length>10" size="72px" v-close-popup  @click="goToMyProfile">
                  <img :src="MyImgProfileString64">
                </q-avatar>
                <q-btn v-else color="primary" unelevated round size="lg" no-caps  @click="goToMyProfile">
                  <div class="row items-center no-wrap">
                    <div class="text-center" style="padding: 10px;">
                      {{$t('message.imagine_profil')}}
                    </div>
                  </div>
                </q-btn>
                <p class="text-h6">
                  {{user.firstName}} {{user.lastName}}
                </p>
                <div class="q-mt-md q-mb-xs">
                  <p class="text-subtitle2">
                    {{user.emailAddress}}
                  </p>
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <q-toolbar v-if="$q.platform.is.mobile">
        <div v-if="showBackBar" style="width:100%;display: flex;justify-content: center;align-items: center;position: relative;">
          <q-icon v-if="!visibleMobileBarForSearch" name="arrow_back_ios" @click="goBack" class="app__arrow--back"/>
          <span  v-if="!visibleMobileBarForSearch" class="app__back__bar--title">{{ titleBackBar }}</span>
          <q-btn v-if="showAddBtnBarMenu" square color="blue" icon="add" style="margin-left: auto;height: 2rem;width: 2rem;" @click="onClickAddBtnForDialogChild"/>
          <!-- <q-btn v-if="!visibleMobileBarForSearch && showSearchBtnBarMenu && !visibleMobileRightBtnForDashboard" flat square  color="primary" text-color="#9EADBA" icon="search" class="app__color--label" style="margin-left: auto;height: 2rem;width: 2rem;" @click="makeMobileBarForSearch"/> -->
          <q-btn v-if="showBasketBtnBarMenu && !visibleMobileRightBtnForDashboard" flat square   color="primary" text-color="#9EADBA"  icon="shopping_cart" class="app__color--label" style="margin-left: auto;height: 2rem;width: 2rem;" @click="onGoTOMyShoppingCart">
            <q-badge color="red-3" floating transparent>
              {{ nrArticlesInBasket }}
            </q-badge>
          </q-btn>
          <div v-if="visibleMobileRightBtnForDashboard && !visibleMobileBarForSearch" style="margin-left: auto;display: flex;">
            <q-btn v-if="showBasketBtnBarMenu" flat square  color="primary" text-color="#9EADBA"  icon="shopping_cart" class="app__color--label" style="height: 2rem;width: 2rem;" @click="onGoTOMyShoppingCart">
              <q-badge color="red-3" floating transparent>
                {{ nrArticlesInBasket }}
              </q-badge>
            </q-btn>
            <!-- <q-btn v-if="currentRouteName!='BrowseArticles'" flat square  color="primary" text-color="#9EADBA" icon="search" class="app__color--label" style="height: 2rem;width: 2rem;" @click="makeMobileBarForSearch"/>
            <q-btn dense flat round icon="menu" @click="goToDashboardInMobile" style="height: 2rem;width: 2rem;" /> -->
          </div>
        </div>

        <div v-if="showMenuBar" style="width:100%;display: flex;">
          <div v-if="!visibleInputFastSearch" style="width:100%;display: flex;align-items: center;">
            <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
            
            <div v-if="userIsAuthenticated" style="display: flex;align-items: center;width:100%;" class="q-px-sm">
              <span v-if="userCompanies.length <= 1" class="app__color--label">{{user.companyName}}</span>
              <q-select
                v-else
                outlined
                style="width: 100%;"
                v-model="user.companyName"
                :options="userCompanies"
                option-value="cif"
                option-label="denumire"
                class="form__input"
                emit-value
                map-options
                @update:model-value="val => changeCompanyUser(val)"
              />
            </div>

            <div style="min-width: fit-content; text-align: right;align-items: center;">
              <q-btn v-if="nrArticlesInFavorites>0" flat round  color="primary" text-color="#9EADBA" icon="favorite_border" class="app__color--label" @click="goToFavorite" >
                <q-badge color="red-3" floating transparent>
                  {{ nrArticlesInFavorites }}
                </q-badge>
              </q-btn>
              <q-btn flat round  color="primary" text-color="#9EADBA" icon="shopping_cart" class="app__color--label" @click="onGoTOMyShoppingCart" >
                <q-badge color="red-3" floating transparent>
                  {{ nrArticlesInBasket }}
                </q-badge>
              </q-btn>
              <!-- <q-btn flat round  color="primary" text-color="#9EADBA" icon="search" class="app__color--label" @click="onShowInputFastSearch"  /> -->
              <!-- <q-btn flat round  color="primary" text-color="#9EADBA" icon="notifications" class="app__color--label"  /> -->
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" overlay elevated>
      <!-- drawer content -->
      <q-list>
        <q-item>
          <div style="width:100%; text-align: center; padding-top: 7px;" >
            <img src="@/assets/color-metal-nobackground.png" style="width:15rem;">
          </div>
        </q-item>
        <q-item clickable v-ripple  @click="leftDrawerOpen=false">
          <q-item-section avatar>
            <q-icon color="primary" name="close" />
          </q-item-section>
          <q-item-section>{{ $t('message.close') }}</q-item-section>
        </q-item>
      </q-list>
      <MenuApp :userid="user.userid" :onCloseMenu="onCloseMenu" />
    </q-drawer>

    <q-page-container style="min-height: 60vh;">
      <q-banner inline-actions class="text-white bg-red" v-if="isLoadingNomenclatoare">
        {{mesajSeLoadingNomenclatoare}}
      </q-banner>


      <router-view v-slot="{ Component }">
        <transition name="fade">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>

    </q-page-container>
    <div class="q-pa-lg ecran-container" v-if="userIsAuthenticated">
      <div class="footer__container" v-bind:class="{ condensed__footer: currentRouteName=='Login' }">
        <ContacteleMeleColorMetal v-if="userIsAuthenticated" />
        <!-- <br v-if="$q.platform.is.mobile"> -->
        <!-- <div style="display: flex;flex-direction: column;justify-content: flex-start;">
          <div class="app__property--medium" >SERVICII</div>
          <br>
          <q-btn size="1rem" padding="none" flat no-caps color="blue-grey-4" align="left" label="Service center" style="font-size: 16px;" />
          <q-btn size="1rem" padding="none" flat no-caps color="blue-grey-4" align="left" label="Calculator greutate" style="font-size: 16px;" @click="openCalculatorGreutate"/>
          <q-btn size="1rem" padding="none" flat no-caps color="blue-grey-4" align="left" label="Rute de distribuție" style="font-size: 16px;" />
        </div> -->
        <br v-if="$q.platform.is.mobile">
        <div style="display: flex;flex-direction: column;justify-content: flex-start;">
          <div class="app__property--small" ><b>{{ $t('message.documente') }}</b></div>
          <q-btn size="sm" padding="none" flat no-caps color="blue-grey-4" align="left" :label="$t('message.declaration_of_conformity')" style="font-size: 14px;" @click="openLink('https://color-metal.ro/sites/default/files/declaratie_de_conformitate.pdf')"/>
          <q-btn size="sm" padding="none" flat no-caps color="blue-grey-4" align="left" :label="$t('message.terms')" style="font-size: 14px;" @click="openLink('https://color-metal.ro/sites/default/files/CONDITII-GENERALE-DE-VANZARE-COLOR-METAL-2021.pdf')"/>
          <q-btn size="sm" padding="none" flat no-caps color="blue-grey-4" align="left" :label="$t('message.catalogs')" style="font-size: 14px;" @click="openLink('https://color-metal.ro/ro/cataloage')"/>
        </div>
        <br v-if="$q.platform.is.mobile">
        <div style="display: flex;flex-direction: column;justify-content: flex-start;">
          <div class="app__property--medium" style=""><!--SOCIAL MEDIA--></div>
          <div>
            <q-btn padding="xs" color="blue-grey-4" :icon="ionLogoFacebook" flat style="width: 2rem;" @click="openLink('https://www.facebook.com/colormetalsrl/?locale=ro_RO')"/>
            <q-btn padding="xs" color="blue-grey-4" :icon="ionLogoLinkedin" flat style="width: 2rem;" @click="openLink('https://ro.linkedin.com/company/color-metal-srl')"/>
            <q-btn padding="xs" color="blue-grey-4" :icon="ionLogoYoutube" flat style="width: 2rem;" @click="openLink('https://www.youtube.com/channel/UCaTkVPnXUVzinvZR5dwfdfA')"/>
          </div>
        </div>
        <br v-if="$q.platform.is.mobile">
      </div>
    </div>
  </q-layout>
</template>

<script lang="ts" src="./app.ts" />

<style scoped lang="scss">
$small-width: 480px;
$medium-width: 768px;
$large-width: 1024px;

$title-color:#788795;
$label-color:#788896;

@mixin media_small {
  @media (max-width: #{$small-width}) {
    @content;
  }
}

@mixin media_medium {
  @media (min-width: #{$small-width}) {
    @content;
  }
}

@mixin media_large {
  @media (min-width: #{$large-width}) {
    @content;
  }
}

.condensed__footer{
  @include media_small {
  }

  @include media_medium {
    max-width: 80vw;
    margin: auto;
  }

  @include media_large {
    max-width: 60vw;
    margin: auto;
  }
}

.footer__container{
  padding-top: 3rem;
  display: flex;
  justify-content: space-between;
  @include media_small {
    flex-direction: column;
    gap: 12px;
  }

  @include media_medium {
    flex-direction: row;
    flex-wrap: wrap;
  }

  @include media_large {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
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
</style>
