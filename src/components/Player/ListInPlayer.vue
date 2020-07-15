<template>
  <v-expand-transition>
    <v-list v-if="dialog" color="grey darken-3" class="transparent" v-on-clickaway="away">
      <v-list-item
        v-for="(song, index) in playlist" :key="index"
        @click="playMusic(song)"
      >
        <v-list-item-avatar>
          <v-img
            :src="`https://img.youtube.com/vi/${song.video_id}/default.jpg`"
          >
          </v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-left" style="color: white">{{ song.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-expand-transition>
</template>

<script>
  import { directive as onClickaway } from 'vue-clickaway'

  export default {
    name: "listDialog",
    props: ['playlist'],

    directives: {
      onClickaway: onClickaway,
    },

    data () {
      return {
        dialog: false
      }
    },
    watch: {
      dialog (val) {
        val || this.close
      },
    },

    methods: {
      open() {
        this.dialog = true
        return new Promise(resolve => {
          this.resolve = resolve
        })
      },
      cancel() {
        this.dialog = false
      },

      playMusic(song) {
        this.dialog = false
        this.$emit('jump2Music', song)
      },

      away() {
        this.dialog = false
      },
    }
  }
</script>

<style scoped>
  .transparent {
    background-color: #ffffff;
    opacity: 0.9;
  }
</style>
