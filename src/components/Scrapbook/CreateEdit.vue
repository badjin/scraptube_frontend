<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form v-model="valid">
        <v-card class="pa-4">
          <v-container>
            <v-card-text class="myFont33">{{subject}}</v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field :disabled="path === 'scrapbook/updateVOD'"
                              placeholder="YouTube link here and click ENTER key."
                              v-model="url"
                              prepend-icon="mdi-youtube"
                              @paste.stop="onPaste"
                              @keyup.enter="getVideoId(url)"
                              :rules="[rules.required, rules.url]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-show="vod.video_id"
                              placeholder="Please enter the title."
                              v-model="title"
                              prepend-icon="mdi-format-title"
                              :rules="[rules.required, rules.min3]"
                />
              </v-col>
              <v-col cols="12">
                <tag-combobox v-show="vod.video_id"
                              :search="search"
                              :index="index"
                              :tagModel="vod.tags"
                              @updateModel="updateModel"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
  import {mapState} from "vuex"
  import TagCombobox from "./TagCombobox";

  export default {
    name: "VodDialog",
    components: {
      TagCombobox
    },

    data () {
      return {
        valid: false,
        dialog: false,
        uploadFlag: false,
        updateTagFlag: false,
        url: '',
        tags: [],

        vod: {
          category: 1,
          title: '',
          video_id: '',
          video_url: '',
          tags: []
        },

        path: '',

        search: "", //sync search
        index: -1
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
        if (newVal && this.valid)
          this.uploadFlag = true
      },
      tagItems (val, prev) {
        if (prev === null) return
        if (val) this.updateTagFlag = true
      }
    },

    computed: {
      ...mapState(['rules']),
      ...mapState('scrapbook',['vodInfo']),
      title: {
        get() {
          return this.vod.title
        },
        set(val) {
          this.vod.title = val
     }
      },
      tagItems: {
        get() {
          return this.$store.state.scrapbook.tags
        },
        set(value) {
          this.$store.state.scrapbook.tags = value
        }
      }
    },

    methods: {
      open(subject, vod, path) {
        this.dialog = true
        this.subject = subject
        this.vod = vod
        this.path = path
        this.url = vod.video_url

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      updateTags() {
        if (this.updateTagFlag){
          this.$store.dispatch('scrapbook/updateTags', {
           category: this.$route.params.category,
           tags: this.tagItems
          })
        }
      },

      save() {
        this.updateTags()
        if (this.uploadFlag) {
          this.vod.tags = this.tags
          this.$store.dispatch(this.path, this.vod).then((res) => {
            this.resolve(res)
            this.dialog = false
          })
        }
      },

      cancel() {
        this.resolve(false)
        this.dialog = false
      },

      getVideoId(url) {
        this.$store.dispatch('util/getVideoId', url).then(res => {
          if (!res){
            this.url = ''
            return
          }
          this.vod.video_id = res.video_id
          this.vod.video_url = res.video_url

          fetch("https://noembed.com/embed?url="+this.vod.video_url).then(res => res.json()).then(json => {
            this.title = json.title
          })
        })
      },

      onPaste (evt) {
        let url = evt.clipboardData.getData('text')
        this.getVideoId(url)
      },

      async initialize() {
        await this.$store.dispatch('scrapbook/getTags', this.$route.params.category)
        .then((res) => {
          if (res) {
            this.uploadFlag = false
            this.updateTagFlag = false
            this.search = ''
            this.index = -1
          }
        })
      },

      updateModel(model) {
        this.tags = model
        this.uploadFlag = true
      }
    }
  }
</script>

<style scoped>

</style>
