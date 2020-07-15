<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form v-model="valid">
        <v-card class="pa-4">
          <v-container>
            <v-card-text class="myFont33">{{subject}}</v-card-text>
            <v-row>
              <v-col cols="12" class="">
                <v-text-field placeholder="YouTube link here and click ENTER key."
                              v-model="url"
                              prepend-icon="mdi-youtube"
                              @paste.stop="onPaste"
                              @keyup.enter="getVideoId(url)"
                              :rules="[rules.required, rules.url]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-show="song.video_id"
                              placeholder="Please enter the title."
                              v-model="title"
                              prepend-icon="mdi-format-title"
                              :rules="[rules.required, rules.min3]"
                />
              </v-col>
            </v-row>

          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled=!valid>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    name: "SongDialog",

    data () {
      return {
        valid: false,
        dialog: false,
        updateTagFlag: false,
        url: '',
        song: {},
      }
    },

    watch: {
      dialog (val) {
        if (val) {
          this.initialize()
        }
        val || this.close
      },
      title(newVal) {
        if (newVal)
          this.uploadFlag = true
      },
    },

    computed: {
      ...mapState(['rules']),
      title: {
        get() {
          return this.song.title
        },
        set(val) {
          this.song.title = val
        }
      },
    },

    methods: {

      open(subject, song) {
        this.dialog = true
        this.subject = subject
        this.song = song
        this.url = song.url
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      save() {
        if (this.uploadFlag) {
          this.$emit('addSongToList', this.song)
        }
        this.resolve(true)
        this.dialog = false
      },

      cancel() {
        this.resolve(false)
        this.dialog = false
      },

      async initialize() {
        this.valid = false
        this.updateTagFlag = false
      },

      getVideoId(url) {
        this.$store.dispatch('util/getVideoId', url).then(res => {
          if (!res){
            this.url = ''
            return
          }
          this.song.video_id = res.video_id
          this.song.video_url = res.video_url

          fetch("https://noembed.com/embed?url="+this.song.video_url).then(res => res.json()).then(json => {
            this.title = json.title
          })
        })
      },

      onPaste (evt) {
        let url = evt.clipboardData.getData('text')
        this.getVideoId(url)
      }
    }
  }
</script>

<style scoped>

</style>
