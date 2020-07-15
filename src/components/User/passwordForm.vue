<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card class="mx-auto pa-3 transparent" color="#3F51B5" dark>

      <dialog-title :title="title" :sub-title="subTitle"/>

      <v-form v-model="valid">
        <div class="pa-2 mb-n7">
          <v-text-field
                        v-model="password.current" solo light
                        prepend-icon="mdi-lock"
                        label="Current Password" outlined
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        @click:append="show2 = !show2"
                        :rules="[rules.required, rules.min8]"
          />
          <v-text-field
                        v-model="password.new" solo light
                        prepend-icon="mdi-lock"
                        label="New Password" outlined
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        hint="At least 8 characters"
                        :rules="[rules.required, rules.min8]"
          />
          <v-text-field
                        v-model="confirmNewPassword" solo light
                        prepend-icon="mdi-lock-alert"
                        label="Confirm new password" outlined
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                        :rules="[rules.required, passwordConfirmationRule]"
          />
        </div>
        <v-card-actions class="mt-5">
          <v-spacer></v-spacer>
          <v-btn class="mb-2" large :color="themeColor.btnColor"
                 @click="cancel"
          >Cancel</v-btn>
          <v-btn class="mb-2" large :color="themeColor.btnColor"
                 @click="agree"
                 :disabled="!valid"
          >Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapState} from "vuex";
  import DialogTitle from '../DialogTitle'

  export default {
    components: {
      DialogTitle
    },
    props: ['password'],

    data: () => ({
      show: false,
      show1: false,
      show2: false,
      valid: false,
      dialog: false,
      title: '',
      subTitle: '',
      confirmNewPassword: '',
    }),

    computed: {
      ...mapState(['rules', 'themeColor']),
      passwordConfirmationRule() {
        return () => (this.password.new === this.confirmNewPassword) || 'Password must match'
      }
    },

    watch: {
      dialog (val) {
        if (val) {
          this.show = this.show1 = this.show2 = false
          this.password.current = ''
          this.password.new = ''
          this.confirmNewPassword = ''
        }
        val || this.close
      },
    },

    methods: {
      open(title, subTitle) {
        this.dialog = true
        this.title = title
        this.subTitle = subTitle
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      agree() {
        this.resolve(true)
        this.dialog = false
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
      },
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

