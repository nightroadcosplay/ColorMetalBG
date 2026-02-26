<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
<div style="margin-top: 1vh;">
  <div class="row">
      <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="form__new__user"
      >
        <q-input
            outlined
            v-model="user.userid"
            :label="$t('message.user_id')"
            :hint="$t('message.usage_user_id')"
            class="form__input"
            @keydown.enter.prevent="focusOnFirstName"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.please_type_something')]"
        />
        <q-input
            outlined
            ref="refFirstName"
            v-model="user.firstName"
            :label="$t('message.first_name')"
            class="form__input"
            @keydown.enter.prevent="focusOnLastName"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.please_type_something')]"
        />
        <q-input
            outlined
            ref="refLastName"
            @keydown.enter.prevent="focusOnEmail"
            v-model="user.lastName"
            :label="$t('message.last_name')"
            class="form__input"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.please_type_something')]"
        />
        <q-input
            outlined
            ref="refEmail"
            @keydown.enter.prevent="focusOnPhoneNr"
            v-model="user.emailAddress"
            type="email"
            :label="$t('message.email')"
            class="form__input"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('message.please_type_something')]"
        />
        <q-input
            outlined
            ref="refPhoneNr"
            @keydown.enter.prevent="focusOnFunctie"
            v-model="user.phoneNr"
            :label="$t('message.phone')"
            class="form__input"
        />
        <q-input
            outlined
            ref="refFunctie"
            @keydown.enter.prevent="focusOnCompnay"
            v-model="user.functie"
            type="text"
            :label="$t('message.job')"
            class="form__input"
        />
        <q-select
            outlined
            ref="refCompany"
            :label="$t('message.company')"
            class="form__input"
            v-model="user.companyCode"
            option-value="code"
            option-label="name"
            clearable
            use-input
            emit-value
            map-options
            input-debounce="500"
            :options="optionsCompanies"
            @filter="filterCompanies"
        >
          <template v-slot:option="scope">
            <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label v-html="scope.opt.cif" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.name" />
                <q-item-label caption>{{ scope.opt.code }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div style="display: flex;justify-content: flex-end;">
          <q-btn :label="$t('message.reset')" type="reset" color="primary" flat class="q-ml-sm" no-caps/>
          <q-btn :label="$t('message.save')" type="submit" color="primary" no-caps text-color="black"/>
        </div>
      </q-form>

  </div>
</div>
</template>


<script lang="ts" src="./EditNewUser.ts" />

<style scoped lang="scss">
@import "../../../assets/mixins";
.form__new__user{
  display: flex;
  flex-direction: column;
  margin: auto;
  font-family: 'Roboto', sans-serif; font-weight: bold;
  @include media_small {
    font-size: 1.2rem;
    max-width: 90vw;
  }

  @include media_medium {
    max-width: 70vw;
    font-size: 1.5rem;
  }

  @include media_large {
    max-width: 50vw;
    padding-top: 2rem;
    font-size: 2rem;
  }
}

.form__input{
  font-family: 'Roboto', sans-serif;
  font-size:1.2rem;
  margin-bottom: 1rem;
  @include media_small {
    min-width:90vw;
  }

  @include media_medium {
    min-width:30rem;
  }

  @include media_large {
    min-width:37rem;
  }
}

</style>
