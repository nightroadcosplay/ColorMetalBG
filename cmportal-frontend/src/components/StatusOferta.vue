<template>
<div style="display:inline-block;" v-bind:style="styleObject">
{{denumireStatus}}
</div>
</template>

<script>
export default {
  name: "StatusOferta",
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed:{
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    denumireStatus: function() {
      let result=this.status;
      if(this.status=='pending'){result=this.$t('message.offer_in_progress');}else{
        if(this.status=='offer'){result=this.$t('message.offer_received')}else{
          if(this.status=='order'){result=this.$t('message.order_sent')}
        }
      }
      return result;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    styleObject:function () {
      const result= {
        color: 'red',
        fontSize: '0.9rem',
        fontWeight: '500'
      }
      if(this.status=='pending'){result.color='#8896A2';}else{
        if(this.status=='offer'){result.color='#8896A2';}else{
          if(this.status=='order'){result.color='#1AAE9F';}
        }
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>