<template>
  <v-dialog v-model="dialog" persistent max-width="1024">
    <v-card color="black">
      <v-card-actions>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-app-bar-nav-icon v-on="on" color="white" @click.stop="listOpen" />
          </template>
          <span>Playlist</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="white" icon @click="closePlayer">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Close</span>
        </v-tooltip>
      </v-card-actions>
      <v-responsive :aspect-ratio="16/9">
        <div v-if="videos !== undefined && videos.length > 0" class="text-center wrapper h_iframe mb-n2">
          <youtube :video-id="videos[listIndex].video_id"
                   :player-vars="playerVars"
                   player-width="100%"
                   player-height="100%"
                   @ready="ready"
                   @ended="ended"
                   id="myPlayer"
                   ref="youtube"
          >
          </youtube>
          <list-in-player ref="playlist"
                       :playlist="videos"
                       @jump2Music="jump2Music"
          >
          </list-in-player>
        </div>
      </v-responsive>
    </v-card>
  </v-dialog>
</template>

<script>
  import ListInPlayer from "./ListInPlayer";

  export default {
    components: {
      ListInPlayer
    },
    props: ['index', 'videos'],
    data () {
      return {
        dialog: false,
        playerVars: {
          autoplay: 1
        },
        width: 1024,
        height: 576,
        player: {},
        listToggle: false
      }
    },

    computed: {
      listIndex: {
        get() {
          return this.index
        },
        set(value) {
          this.index = value
        }
      }
    },
    watch: {
      dialog (val) {
        val || this.close
      }
    },

    methods: {
      setSize(size) {
        this.width = size.w
        this.height = size.h
      },
      open() {
        this.dialog = true
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      closePlayer() {
        this.stop()
        this.resolve(true)
        this.dialog = false
      },
      ready (event) {
        this.player = event.target
      },
      playing () {
        // The player is playing a video.
      },
      change () {
        // when you change the value, the player will also change.
        // If you would like to change `playerVars`, please change it before you change `videoId`.
        // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
        // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
        this.videoId = '34nuDVgBNJI'
      },
      ended () {
        if (this.videos.length === 1) return
        if (this.listIndex < this.videos.length-1){
          this.listIndex += 1
        } else this.listIndex = 0
        this.player.playVideo()
      },
      stop () {
        this.player.stopVideo()
      },
      pause () {
        this.player.pauseVideo()
      },

      listOpen () {
        if (this.videos.length > 0) {
          this.listToggle = ! this.listToggle
          this.listToggle ?  this.$refs.playlist.open() : this.$refs.playlist.cancel()
        }
      },
      jump2Music (song) {
        if (this.videos.length === 1) return
         let index = this.videos.indexOf(song)
        if (index === this.index) return
        this.stop()
        this.listToggle = false
        this.index = index
        this.player.playVideo()
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .h_iframe {
    position: relative;
  }

  .h_iframe .ratio {
    display: block;
    width: 100%;
    height: auto;
  }

  .h_iframe #myPlayer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
