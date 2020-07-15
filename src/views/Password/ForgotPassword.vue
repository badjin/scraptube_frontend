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
            </div>

            <v-card-actions>
              <v-btn large block :color="themeColor.btnColor"
                     @click="sendRequest(user.email)"
                     :disabled="!valid"
              >Send Password Reset Link</v-btn>
            </v-card-actions>
          </v-form>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Api from '../../axios';
  import AlertInForm from '../../components/User/MessageInTheForm'
  import DialogTitle from '../../components/DialogTitle'
  import {mapState} from "vuex";

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
        subTitle: "Enter your email below",

        valid: false,
        user: {
          email: null
        }
      }
    },

    computed: {
      ...mapState(['rules', 'themeColor'])
    },

    methods: {
      sendRequest() {
        Api.post('password/forgot', this.user)
          .then( response =>  {
            this.$store.commit('util/SET_ALERT_MESSAGE',{
              value: true,
              type: 'success',
              message: response.data.message
            })
            this.user.email = null
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
  }
</script>

<style lang="scss" scoped>
  .transparent {
    background-color: #3F51B5!important;
    opacity: 0.9;
    border-color: transparent!important;
  }
</style>
