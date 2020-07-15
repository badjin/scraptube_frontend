<template>
  <div>

  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    name: 'VerifyEmail',

    methods: {
      ...mapActions({
        verifyEmail: 'user/verifyEmail'
      })
    },

    created() {
      console.log(this.$route.query)
      this.verifyEmail(this.$route.query)
        .then((res) => {
          if (res) this.$router.push({name: 'Login'})
        })
    }
  }
</script>
