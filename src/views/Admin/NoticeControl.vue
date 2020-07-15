<template>
  <v-container fluid fill-height>
    <v-layout align-center>
      <v-flex xs24 sm12 md12 lg12 xl12>
        <v-row class="pa-2 mb-8">
          <v-progress-linear indeterminate color="indigo" v-show="isLoading"></v-progress-linear>
          <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4" justify="center">
            <v-layout justify-center>
              <v-card class="pa-5" flat
                      max-width="400"
              >
                <div class="align-center text-center">
                  <v-btn class="mt-3 ml-4"
                         fab large dark color="indigo"
                         @click="onPickFile"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                  <input type="file"
                         style="display: none"
                         ref="fileInput"
                         accept="image/png,image/jpg,image/jpeg,image/gif,"
                         @change="onFilePicked"
                  >
                </div>
                <v-card-text class="text-center">
                  <h1>{{ cardText }}</h1>
                </v-card-text>
                <v-card-subtitle class="text-center mt-n7 ">
                  {{ cardSub }}
                </v-card-subtitle>
              </v-card>
            </v-layout>
          </v-col>
          <v-col
            cols="12" xs="12" sm="12" md="6" lg="4" xl="4"
            v-for="(notice, index) in noticeImages"
            :key="index"
          >
            <v-layout justify-center>
              <v-card class="pa-2" flat
                      max-width="400" justify-center
              >
                <v-img
                  :src="notice"
                  alt="notice"
                >
                </v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-icon small @click="deleteNotice(notice)">
                    mdi-delete
                  </v-icon>
                </v-card-actions>
              </v-card>
            </v-layout>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
    <confirm ref="confirm"></confirm>
  </v-container>
</template>

<script>
  import {mapState} from "vuex"
  import confirm from '../../components/ConfirmDialog'

  export default {
    name: "Notice",
    components: {
      confirm
    },
    data() {
      return {
        isLoading: false,
        cardText: "Add your notice item.",
        cardSub: "You can store only up to 5 items."
      }
    },
    computed: {
      ...mapState(['themeColor']),
      ...mapState('notice',['noticeImages'])
    },
    methods: {
      onPickFile() {
        if (this.noticeImages.length < 5) {
          this.$refs.fileInput.click()
        }
        else {
          this.$store.commit('util/SET_SNACKBAR_MESSAGE', {
            'type': 'error',
            'message': "You can store only up to 5 items."
          })
        }
      },
      onFilePicked(e) {
        let file = e.target.files[0]
        if (file.name.lastIndexOf('.') <= 0)
          return alert('업로드 할 이미지 파일을 선택하세요.')

        this.isLoading = true
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => this.$store.dispatch('notice/postNotice', {
          noticeImage: e.target.result
        }).then(() => {
          this.$store.dispatch('notice/getNotice')
          this.isLoading = false
        })
      },
      async deleteNotice(notice) {
        if (await this.$refs.confirm.open('Delete selected item', 'Are you sure?', { color: this.themeColor.errorColor })) {
          this.$store.dispatch('notice/deleteNotice', {
            noticeImage: notice
          }).then(() => this.$store.dispatch('notice/getNotice'))
        }
      },
    }
  }
</script>

<style scoped>

</style>
