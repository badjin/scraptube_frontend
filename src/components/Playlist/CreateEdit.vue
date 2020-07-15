<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form v-model="valid">
        <v-card class="pa-4">
          <v-container>
            <v-card-text class="myFont33">{{subject}}</v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field placeholder="Please enter the title."
                              v-model="title"
                              prepend-icon="mdi-format-title"
                              :rules="[rules.required, rules.min3]"
                />
              </v-col>
            </v-row>
            <v-card flat>
              <v-app-bar>
                <v-toolbar-title>Add clip |
                  <small style="color: #ff4500">{{ editedPlaylist.song_list.length }}</small>
                  <small> / 10</small>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon :disabled="editedPlaylist.song_list.length === 10"
                       @click="addSong"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-app-bar>
              <clip-list-in-the-form :song-list="editedPlaylist.song_list"
                               @deleteSong="deleteSong"
              />
            </v-card>

          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled=disabled>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      <append-clip ref="dialog" thumb-nail="thumbNail"
                   @addSongToList="addSongDone"
                   @deleteSong="deleteSong"
      />
      <confirm ref="confirm"></confirm>
    </v-dialog>
  </v-row>
</template>

<script>
  import {mapState} from "vuex"
  import AppendClip from "./AppendClip";
  import ClipListInTheForm from "./ClipListInTheForm";
  import confirm from "../ConfirmDialog";

  export default {
    name: "PlaylistDialog",
    props: ['editedPlaylist'],
    components: {
      AppendClip,
      ClipListInTheForm,
      confirm
    },

    data () {
      return {
        valid: false,
        dialog: false,
        updateTagFlag: false
      }
    },

    watch: {
      dialog (val) {
        if (val) {
          this.initialize()
        }
        val || this.close
      },

      title(newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      },

      songList (newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      }
    },

    computed: {
      ...mapState(['rules', "themeColor"]),

      title: {
        get() {
          return this.editedPlaylist.title
        },
        set(value) {
          this.editedPlaylist.title = value
        }
      },
      songList: {
        get() {
          return this.editedPlaylist.song_list
        }
      },
      disabled: {
        get() {
          let value = (this.songList !== undefined && this.songList.length > 0)
          return !(value && this.updateTagFlag)
        }
      }
    },

    methods: {
      open(subject) {
        this.dialog = true
        this.subject = subject
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      save() {
        this.editedPlaylist.title = this.title
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
      async addSong() {
        if (this.songList.length > 9) {
          this.$store.commit('util/SET_SNACKBAR_MESSAGE', {
            'type': 'error',
            'message': 'Up to 10 is possible.'
          })
        } else {
          let song = Object.assign({}, {
            video_id: '',
            video_url: '',
            title: ''
          });
          await this.$refs.dialog.open("Add song", song)
        }
      },
      addSongDone(song) {
        this.editedPlaylist.song_list.push(song)
      },
      async deleteSong(item) {
        const index = this.editedPlaylist.song_list.indexOf(item)
        if (await this.$refs.confirm.open('Delete selected item.', 'Are you sure?', { color: this.themeColor.errorColor })) {
          this.editedPlaylist.song_list.splice(index, 1)
        }
      },
    }
  }
</script>

<style scoped>

</style>
