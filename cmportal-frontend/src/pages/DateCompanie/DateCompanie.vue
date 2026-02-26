 <template>
  <div class="q-pa-sm ecran-container " style="font-family: 'Roboto', sans-serif;">

    <div style="display: flex;justify-content: flex-start;min-width: 70vw;padding-bottom: 2rem;">
      <div class="app__page__title__container">
        <span style="white-space:nowrap;font-size:2rem;"><q-icon name="account_balance" style="font-size:2rem;position: relative;top: -4px;" color="primary" /> {{$t('message.company_data')}}</span>
      </div>
    </div>

    <div style="min-width: 70vw;">
      <div class="parametru">
        <span class="app__title--small">{{$t('message.name2')}}</span>
        <span class="app__label--large">{{denumire}}</span>
      </div>
      <div class="parametru">
        <span class="app__title--small">{{$t('message.cui')}}</span>
        <span class="app__label--large">{{cui}}</span>
      </div>
      <div class="parametru">
        <span class="app__title--small">{{$t('message.reg_com')}}</span>
        <span class="app__label--large">{{regCom}}</span>
      </div>
      <div class="parametru">
        <span class="app__title--small">{{$t('message.base_address')}}</span>
        <span class="app__label--large">{{adresaBaza}}</span>
      </div>
    </div>

    <!--
        <div class="dashboard__section" style="min-width: 70vw;">
          <ContacteleMeleColorMetal />
        </div>
         -->
  </div>

</template>

<script lang="ts" src="./DateCompanie.ts" />

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
.dashboard__section{
  @include media_small {
    padding-top: 1rem;
  }

  @include media_medium {
    padding-top: 3rem;
  }

  @include media_large {
    padding-top: 5rem;
  }
}

.dashboard__div__title{
  @include media_small {
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
  }

  @include media_medium {
    font-size: 1.1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  @include media_large {
    font-size: 1.2rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bolder;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

.parametru{
  @include media_small {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #DFE6ED;
  }

  @include media_medium {
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 0.2rem;
  }

  @include media_large {
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 0.3rem;
  }
}


.factura__div {
  @include media_small {
    display: grid;
    align-items: center;
    grid-template-areas:
    'factura_id      factura_data'
    'factura_valoare factura_valoare'
    'factura_rest    factura_rest'
    'factura_alert   factura_alert';
    grid-gap: 10px;
    border-top: 1px solid #DFE6ED;
    border-bottom: 1px solid #DFE6ED;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
  }

  @include media_medium {
    background-color: white;
    min-width: 70vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid #DFE6ED;
  }

  @include media_large {
    background-color: white;
    min-width: 60vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid #DFE6ED;
  }
}

.factura__valoare{
  font-weight: 600;
  color: black;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 1rem;
  }

  @include media_medium {
    font-size: 1rem;
  }

  @include media_large {
    font-size: 1.1rem;
  }
}

.dashboard__div__parameter{
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 100;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @include media_small {
    font-size: 0.9rem;
    color: $title-color;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  @include media_medium {
    font-size: 1rem;
    color: $title-color;
  }

  @include media_large {
    font-size: 1.1rem;
    color: $title-color;
  }
}

.dashboard__div__content {
  @include media_small {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  @include media_medium {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  @include media_large {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
}
</style>
