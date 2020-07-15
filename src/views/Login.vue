<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8>

        <v-card max-width="400px"
                class="mx-auto pa-3 transparent"
                color="white"
                shaped dark
        >

          <message-in-the-form/>

          <dialog-title :title="title" :sub-title="subTitle"/>

          <v-form v-model="valid">
            <div class="pa-2">
              <v-text-field v-model="user.email" solo light
                            class="v-autocomplete"
                            prepend-icon="mdi-email"
                            type="email"
                            label="E-MAIL" outlined
                            :rules="[rules.required, rules.emailCheck]"
              />
              <v-text-field v-model="user.password" solo light
                            class="mb-n6"
                            prepend-icon="mdi-lock"
                            label="PASSWORD" outlined
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            @click:append="show = !show"
                            hint="At least 8 characters"
                            @keyup.enter="loginUser"
                            :rules="[rules.required, rules.min8]"
              />
              <v-checkbox class="mb-n2 " v-model="user.rememberMe" label="Remember me"/>
            </div>

            <v-card-actions>
              <v-btn large block :color="themeColor.btnColor"
                     @click="loginUser"
                     :disabled="!valid"
              >Log In</v-btn>
            </v-card-actions>
          </v-form>

          <div class="d-flex flex-no-wrap justify-space-between">
              <v-btn text router :to="{name: 'ForgotPassword'}" ><small class="">Forgot Your Password?</small></v-btn>
          </div>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import MessageInTheForm from '../components/User/MessageInTheForm'
  import DialogTitle from '../components/DialogTitle'
  import {mapState, mapActions} from "vuex"

  export default {
    props: {
      source: String,
    },
    components: {
      MessageInTheForm,
      DialogTitle
    },
    data () {
      return {
        title: "Welcome back",
        subTitle: "Enter your credentials below",

        valid: false,
        show: false,

        user: {
          email: null,
          password: null,
          rememberMe: false
        },

      }
    },

    computed: {
      ...mapState(['rules', 'themeColor'])
    },

    methods: {
      ...mapActions({
        login: 'user/login'
      }),
      loginUser () {
        if (!this.valid) return
        this.login(this.user)
        .then(() => {
          this.$router.push({name: 'Home'})
        })
      }
    },

    created() {
      this.user.email = this.$store.getters['user/getUserEmail']
    },
    destroyed() {
      this.$store.commit('user/SET_TEMP_EMAIL', '')
      this.$store.commit('util/SET_KEEP_FLAG', false)
      this.$store.commit('util/SET_ALERT_MESSAGE', {value: false, type: '', message: ''})
    }
  }
</script>

<style lang="scss" scoped>
  .transparent {
    background-color: #3F51B5!important;
    opacity: 0.9;
    border-color: transparent!important;
  }
</style>
