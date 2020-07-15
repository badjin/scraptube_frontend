<template>
  <v-list v-if="item.song_list.length > 0">
    <v-subheader class="mt-n4">
      <v-tooltip bottom>
        <template v-if="!thumbUpFlag" v-slot:activator="{ on }">
          <v-btn icon :disabled="!isLogin || userInfo.id === item.user_id"
                 v-on="on"
                 @click="thumbUpControl"
          >
            <v-icon color="grey lighten-1">
              mdi-thumb-up
            </v-icon>

          </v-btn>
          <small style="color: #bcbcbc" class="ml-2">{{item.thumb_up_count}}</small>
        </template>
        <template v-else v-slot:activator="{ on }">
          <v-btn icon :disabled="!isLogin || userInfo.id === item.user_id"
                 v-on="on"
                 @click="thumbUpControl"
          >
            <v-icon color="blue accent-4">
              mdi-thumb-up
            </v-icon>
          </v-btn>
          <small style="color: #2961fd" class="ml-2">{{thumbUpCount}}</small>
        </template>
        <span v-if="!thumbUpFlag">I like this playlist</span>
        <span v-else>Cancel</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <small style="color: orangered">{{ clipList.count }}</small>
      <small class="mr-2"> / {{item.song_list.length}}</small>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon
                 v-on="on"
                 class="mr-n2"
                 @click="setActiveToggle"
          >
            <v-icon
              v-if="!clipList.active"
              color="grey lighten-1"
            >
              mdi-star-outline
            </v-icon>

            <v-icon
              v-else
              color="orange"
            >
              mdi-star
            </v-icon>
          </v-btn>
        </template>
        <span v-if="!clipList.active">Select All</span>
        <span v-else>Deselect All</span>
      </v-tooltip>

    </v-subheader>
    <v-divider class="mb-2"></v-divider>
    <v-list-item-group
        v-model="selected"
        style="max-height: 258px" class="overflow-y-auto"
        ref="titleWidth"
      >
        <template v-for="(song, index) in item.song_list">
          <v-list-item :key="index" @click="setList(index)">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 12 : 2"
                class="ml-n1 mr-4 mb-2"
                max-width="80"
                max-height="45"
                link
                @click.stop="playMusic(song)"
              >
                <v-img
                  :src="`https://img.youtube.com/vi/${song.video_id}/default.jpg`"
                  max-width="80"
                  max-height="45"
                >
                </v-img>
              </v-card>
            </v-hover>
            <v-list-item-content>
              <v-list-item-subtitle>
                <div :style="barWidthCalculated" class="text-truncate" >
                  {{song.title}}
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon
                v-if="!clipList.isActive[index]"
                color="grey lighten-1"
              >
                mdi-star-outline
              </v-icon>

              <v-icon
                v-else
                color="orange"
              >
                mdi-star
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list-item-group>
  </v-list>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "SongList",
    props: ['item', 'thumbUpFlag', 'clipList'],

    data () {
      return {
        selected: [-1],
        selectedList: [],
        gap: 0
      }
    },

    mounted() {
      if (this.$vuetify.breakpoint.lgAndUp) this.gap = 600
      else if (this.$vuetify.breakpoint.mdAndUp) this.gap = 500
      else this.gap = 270
      this.isActive = this.item.song_list.map(song => {
        return !song.title
      })
    },

    watch : {
      currentBreakPoint () {
        if (this.$vuetify.breakpoint.lgAndUp) this.gap = 600
        else if (this.$vuetify.breakpoint.mdAndUp) this.gap = 500
        else this.gap = 270
      }
    },

    computed: {
      ...mapState("user", ["isLogin", "userInfo"]),
      currentBreakPoint: {
        get() {
          return this.$vuetify.breakpoint.width
        }
      },
      currentWidth: {
        get () {
          return (this.$vuetify.breakpoint.width-this.gap)+'px'
        }
      },
      barWidthCalculated: function () {
        return {
          width: this.currentWidth
        };
      },
      thumbUpCount: {
        get () {
          return this.item.thumb_up_count
        },
        set (val) {
          this.item.thumb_up_count = val
        }
      }
    },

    methods: {
      playMusic (song) {
        this.selectedList=[]
        for (let i = 0; i < this.item.song_list.length ; i++){
          if (this.clipList.isActive[i])
            this.selectedList.push(this.item.song_list[i])
        }
        this.$emit('playMusic', {song: song, selectedList: this.selectedList})
      },

      setList(index) {
        this.clipList.isActive[index] = !this.clipList.isActive[index]
        this.clipList.count = (this.clipList.isActive.filter(i => i === true)).length
      },

      setActiveToggle() {
        this.clipList.active = !this.clipList.active
        this.clipList.count = this.clipList.active ? this.item.song_list.length : 0
        this.clipList.isActive = this.item.song_list.map(() => {
          return this.clipList.active
        })
      },

      thumbUpControl() {
        this.$emit('thumbUpEvent')
        this.thumbUpCount += this.thumbUpFlag ? -1 : 1
      }
    }
  }
</script>

<style scoped>

</style>
