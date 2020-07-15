<template>
  <v-list v-if="SongList.length > 0"
          style="max-height: 268px"
          class="overflow-y-auto"
  >
    <v-list-item v-for="item in SongList" :key="item.id">
      <v-card
        class="ml-n1 mr-4 mb-2"
        max-width="80"
        max-height="45"
      >
        <v-img
          :src="`https://img.youtube.com/vi/${item.video_id}/default.jpg`"
          max-width="80"
          max-height="45"
        >
        </v-img>
      </v-card>

      <v-list-item-content>
        <v-list-item-subtitle v-text="item.title"></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action class="mr-n3">
        <v-icon small @click="deleteSong(item)">
          mdi-delete
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
  export default {
    name: "SongList",
    props: ['SongList'],

    updated() {
      this.$nextTick(() => this.scrollToEnd());
    },

    methods: {
      deleteSong(item) {
        this.$emit('deleteSong', item)
      },
      scrollToEnd: function () {
        this.$el.scrollTop = this.$el.lastElementChild.offsetTop;
      }
    }
  }
</script>

<style scoped>

</style>
