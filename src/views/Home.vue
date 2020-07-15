<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs24 sm24 md12 lg10 xl10>
        <v-carousel class="mt-n12"
                    cycle
                    height="500"
                    hide-delimiter-background
                    show-arrows-on-hover
        >
          <v-carousel-item
            v-for="(notice, index) in noticeImages"
            :key="index"
            :src="notice"
          >
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import {mapState} from "vuex"

export default {
  computed: {
    ...mapState('notice',['noticeImages'])
  },
  mounted() {
    this.$store.commit('SET_ACTIVE_TAB', this.$store.state.tabNotice)
  }
}
</script>
