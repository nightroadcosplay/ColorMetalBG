<template>
  <div>
    <div  class="app__property--small"><b>{{ $t('message.my_contacts') }}</b></div>
    <div class="dashboard__div__content" style="flex-direction: column;">
      <div v-for="contact in tableContacts" :key="contact.email" class="app__label--large">
        <q-icon name="perm_contact_calendar" style="font-size:1rem;color:#90A4AE;"  />
        <span style="font-size: 12px;color:#90A4AE;">{{ contact.lastName }} {{ contact.firstName }} <a href="tel:contact.phoneNr" style="color:red;text-decoration: none">{{ contact.phoneNr }}</a> <br v-if="$q.platform.is.mobile"> <a :href = "'mailto:' + contact.email" style="text-decoration: none">{{contact.email}}</a></span>
        
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {TColorMetalAgentAsContact} from '@/types/TColorMetalAgentAsContact';
import {ServiceUser} from "@/services/ServiceUser";
import { ref } from 'vue'

const tableContacts = ref([]) as unknown as TColorMetalAgentAsContact[];

ServiceUser.getMyColorMetalUserContacts().then(result=>{
  console.log('getMyColorMetalUserContacts.result=%o',result)
  if(result.status=='success'){
    //tableContacts.value=[...result.colorContacts];
    tableContacts.value=result.colorContacts;
    console.log('tableContacts.value=%o',tableContacts.value)
  }else{
    console.log('cum adica?!AAAAAAAAAAAAAAAAAAAAA');
  }
})


</script>


