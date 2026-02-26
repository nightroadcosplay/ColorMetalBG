<template>
  <div style="text-align: center;">
    <span class="text-h5">Profilul meu</span>
    <div class="q-pa-md" style="max-width: 400px;margin: auto;">
      <q-form
          @submit="onSubmit"
          class="q-gutter-md"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm flex_row_center">

            <q-icon v-if="MyImgProfileString64.length<10" name="photo_camera" class="text-grey-10" style="font-size: 4em;cursor: pointer;"  @click="showDialogForChangeImgProfile=true">
              <q-tooltip
                  v-if="$q.platform.is.desktop"
                  transition-show="rotate"
                  transition-hide="rotate"
              >
                {{$t('message.click_pentru_incarcare_imagine_profil')}}
              </q-tooltip>
            </q-icon>

            <q-img v-else
                   v-bind:src="MyImgProfileString64"
                   spinner-color="white"
                   style="height: 140px; max-width: 150px"
                   @click="showDialogForChangeImgProfile=true"
            >
              <template v-slot:loading>
                <q-spinner-gears color="white" />
              </template>
              <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
              >
                {{$t('message.click_pentru_schimbare_imagine_profil')}}
              </q-tooltip>
            </q-img>


          </div>

          <!--<input type="file" accept="image/*" capture="camera">-->

          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                outlined
                v-model="myProfile.firstName"
                label="Prenume"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.te_rugam_sa_completezi_prenumele_tau')]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                outlined
                v-model="myProfile.lastName"
                label="Nume"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.te_rugam_sa_completezi_numele_tau')]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                outlined
                readonly
                type="email"
                v-model="myProfile.email"
                label="Emailul meu"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.te_rugam_sa_completezi_un_email_valid')]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                outlined
                readonly
                type="tel"
                v-model="myProfile.phoneNr"
                label="Telefon contact"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('message.te_rugam_sa_completezi_numarul_de_telefon_de_contact')]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                @focus="showNecessaryInfoForPasswordChange=true"
                @blur="blurInputNewPassword"
                v-model="myProfile.newPassword"
                type="password"
                outlined
                autogrow
                :label="$t('message.new_password')"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                v-if="showNecessaryInfoForPasswordChange"
                v-model="myProfile.newPasswordRetyped"
                type="password"
                outlined
                autogrow
                :label="$t('message.reenter_new_password')"
                lazy-rules
                :rules="[checkPasswordIfRetypedEqual]"
            />
          </div>
        </div>

        <!-- <div v-if="1==2" class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-input
                v-model="myProfile.motto"
                outlined
                autogrow
                label="Mottoul meu"
            />
          </div>
        </div> -->

        <div class="row">
          <div style="margin: auto;">
            <q-btn :label="$t('message.save')" type="submit" color="grey-10"/>
          </div>
        </div>
      </q-form>

    </div>

    <q-dialog v-model="showDialogForChangeImgProfile" >
      <q-card>
        <q-card-section>
          <q-uploader
              :url="getUrlForUploadProfileImage"
              :label="$t('message.upload_profile_image')"
              accept=".jpg, .png, image/*"
              auto-upload
              color="black"
              capture="environment"
              :multiple="myBoolFalse"
              style=" max-width: 80vw;"
              @uploaded="imgForProfileWasUploaded"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('message.renunta')" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts" src="./MyProfile.ts" />

<style scoped>

</style>
