<template>
  <v-card
    class="pa-2"
    max-width="180"
  >
    <v-card-actions v-if="isLogin">
      <v-spacer></v-spacer>
      <v-icon small class="mr-3" @click="editVOD">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteVOD">
        mdi-delete
      </v-icon>
    </v-card-actions>
    <v-hover v-slot:default="{ hover }">
      <v-card link
              @click="showVOD"
              :elevation="hover ? 12 : 2"
              max-width="180"
      >
        <v-img class="pa2"
               :src="`https://img.youtube.com/vi/${vod.video_id}/sddefault.jpg`"
               max-width="180"
               max-height="92"
        >
        </v-img>
      </v-card>
    </v-hover>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-card-text v-on="on">
          <div class="text-truncate">
            {{vod.title}}
          </div>
        </v-card-text>
      </template>
      <span>{{vod.title}}</span>
    </v-tooltip>
    <div v-show="vod.tags !== null" class="pa-1 mt-n4">
      <template v-for="(tag, i) in vod.tags">
        <v-chip class="mr-2 mt-1" small
                :key="i"
                @click="sorting(tag)"
                :color="(selectedTag === tag.text) ? 'red lighten-3' : 'orange lighten-3'"
        >{{vod.tags[i].text}}</v-chip>
      </template>
    </div>
  </v-card>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "ClipCard",
    props: ['vod', 'selectedTag'],

    computed: {
      ...mapState('user', ['isLogin'])
    },
    methods: {
      showVOD () {
        this.$emit('showVOD')
      },
      editVOD() {
        this.$emit('editVOD')
      },
      deleteVOD() {
        this.$emit('deleteVOD')
      },
      sorting(tag) {
        this.$emit('sortingByTag', tag)
      }
    }
  }
</script>

<style scoped>

</style>
