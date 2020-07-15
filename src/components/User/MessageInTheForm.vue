<template>
  <v-alert :value="alertMessage.value"
           :type="alertMessage.type"
           :color="alertMessage.type === 'error' ? themeColor.errorColor : themeColor.successColor"
  >
    {{ alertMessage.message }}
  </v-alert>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    computed: {
      ...mapState(['themeColor']),
      ...mapState('util', ['alertMessage'])
    },
    destroyed() {
      this.$store.commit('util/SET_ALERT_MESSAGE', {value: false, type: '', message: ''})
    }
  }
</script>
