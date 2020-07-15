<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8>

        <v-card max-width="400px"
                class="mx-auto pa-3 transparent"
                color="white"
                shaped dark
        >

          <AlertInForm/>

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
                            label="PASSWORD" outlined
                            prepend-icon="mdi-lock"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            @click:append="show = !show"
                            hint="At least 8 characters"
                            :rules="[rules.required, rules.min8]"
              />
              <v-text-field v-model="user.password_confirmation" solo light
                            label="Confirm Password" outlined
                            prepend-icon="mdi-lock-alert"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            :rules="[rules.required, passwordConfirmationRule]"
              />
            </div>
            <v-card-actions>
              <v-btn class="mb-2" large block :color="themeColor.btnColor"
                     @click="resetPassword"
                     :disabled="!valid"
              >Confirm</v-btn>
            </v-card-actions>
          </v-form>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Api from '../../axios'
  import AlertInForm from '../../components/User/MessageInTheForm'
  import DialogTitle from '../../components/DialogTitle'
  import {mapState} from "vuex"

  export default {

    props: {
      source: String,
    },
    components: {
      AlertInForm,
      DialogTitle
    },
    data () {
      return {
        title: "Reset Password",
        subTitle: "Enter your new password below",

        user: {
          token: null,
          email: null,
          password: null,
          password_confirmation: null
        }
      }
    },
    computed: {
      ...mapState(['rules', 'themeColor']),
      passwordConfirmationRule() {
        return () => (this.user.password === this.user.password_confirmation) || 'Password must match'
      }
    },
    methods: {
      resetPassword() {
        this.user.token = this.$route.query.token
        Api.post('password/reset', this.user)
          .then( response =>  {
            this.$store.commit('util/SET_ALERT_MESSAGE',{
              value: true,
              type: 'success',
              message: response.data.message
            })
            this.$store.commit('util/SET_KEEP_FLAG', true)
            this.$store.commit('user/SET_TEMP_EMAIL', this.user.email)
            this.$router.push({name: 'Login'})
          })
          .catch( err => {
            this.$store.commit('util/SET_ALERT_MESSAGE',{
              value: true,
              type: 'error',
              message: err.response.data.message
            })
          });
      }
    },
    destroyed() {

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
