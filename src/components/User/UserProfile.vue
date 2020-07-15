<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card class="mx-auto pa-3 transparent"
            color="#3F51B5"
            dark
    >
      <dialog-title :title="title" :sub-title="subTitle"/>

      <v-form v-model="valid">
        <v-row class="pa-2 mb-n7">
          <v-col cols="undefined">
            <v-text-field v-model="name" solo light
                          prepend-icon="mdi-account"
                          type="text"
                          label="Name" outlined
                          :rules="[rules.required, rules.min3]"
            />
          </v-col>
          <v-col cols="4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn fab icon class="ml-4" v-on="on" @click="openAvatarPicker">
                  <v-avatar v-if="preview">
                    <v-img :src="preview" max-height="100px" max-width="100px"/>
                  </v-avatar>
                  <v-avatar v-else>
                    <v-img :src="`${avatarUrl}users-${avatar_id}.svg`"/>
                  </v-avatar>
                </v-btn>
              </template>
              <span>Upload your profile image</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <div class="pa-2 mb-n7">
          <v-text-field v-model="user.email" solo light
                        prepend-icon="mdi-email"
                        type="email"
                        label="E-MAIL" outlined
                        disabled
          />
        </div>
        <v-radio-group class="ml-10" row v-model="role" v-if="roleFlag">
          <v-radio label="Staff" value="2"></v-radio>
          <v-radio label="Member" value="3"></v-radio>
        </v-radio-group>

        <v-card-actions class="mt-5">
          <v-btn v-show="editFlag" class="mb-2" large :color="themeColor.btnColor"
                 @click="openPasswordForm"
          >Password</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mb-2" large :color="themeColor.btnColor"
                 @click="cancel"
          >Cancel</v-btn>
<!--          <v-spacer></v-spacer>-->
          <v-btn class="mb-2" large :color="themeColor.btnColor"
                 @click="agree"
                 :disabled="!valid"
          >Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <avatar-picker
      v-model="showAvatarPicker"
      :current-avatar="user.avatar_id"
      @selected="selectAvatar"/>
    <passwordForm v-show="editFlag" ref="passwordChange" :password="password" />
  </v-dialog>
</template>

<script>
  import AvatarPicker from './AvatarPicker'
  import DialogTitle from '../DialogTitle'
  import passwordForm from "./passwordForm"
  import {mapState} from "vuex"

  export default {
    components: {
      AvatarPicker,
      DialogTitle,
      passwordForm
    },
    props: ['user', 'editFlag'],
    data () {
      return {
        dialog: false,
        title: '',
        subTitle: '',
        showAvatarPicker: false,
        valid: false,
        role: "4",
        roleFlag: false,
        enableFlag: false,

        passwordChange: false,
        password: {
          current: '',
          new: '',
        },
        avatar_id: 1,
        preview: null,
        name: null
      }
    },
    computed: {
      ...mapState(['rules', 'avatarUrl', 'themeColor']),
      passwordConfirmationRule() {
        return () => (this.user.password === this.user.password_confirmation) || 'Password must match'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          this.avatar_id = this.user.avatar_id
          this.preview = this.user.avatar_image
          this.name = this.user.name
          this.role = this.user.role_id.toString()
        }
        val || this.close
      },
    },

    methods: {
      openAvatarPicker () {
        this.showAvatarPicker = true
      },

      selectAvatar (avatar) {
        this.avatar_id = avatar.avatar
        this.preview = avatar.image
      },

      open(title, subTitle, roleFlag) {
        this.dialog = true
        this.title = title
        this.subTitle = subTitle
        this.roleFlag = roleFlag

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      agree() {
        this.user.role_id = Number(this.role)
        this.user.avatar_image = this.preview
        this.user.avatar_id = this.avatar_id
        this.user.name = this.name
        this.resolve(true)
        this.dialog = false
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
      },

      async openPasswordForm() {
        if (await this.$refs.passwordChange.open('비밀번호 변경하기', '')) {
          await this.$store.dispatch('user/changePassword', this.password)
        }
      }

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
