<template>
  <v-container fill-height>
    <v-layout justify-center>
      <v-flex xs24 sm12 md12 lg12 xl12>
        <v-tabs>
          <v-tab v-for="(category, index) in categories"
                 :key="index"
                 :to="{path: '/scrapbook/'+(index+1)}">
            {{category.name}}
          </v-tab>
        </v-tabs>
        <v-card class="d-flex justify-end mt-3 mb-n12" flat>
          <v-btn v-if="selectedTag"
                 color="orange darken-4"
                 dark
                 class="mr-2"
                 @click="changedList">List All</v-btn>
          <v-btn color="indigo"
                 dark
                 @click="editCategory">Edit Category</v-btn>
        </v-card>
        <v-row class="pa-2 mt-12 mb-8">
          <v-col
            cols="12" xs="12" sm="4" md="3" lg="2" xl="2"
            v-if="isLogin"
          >
            <v-layout justify-center>
              <v-card class="pa-2 mt-10" flat
                      max-width="180"
              >
                <div class="align-center text-center">
                  <v-btn class="mt-3"
                         fab large dark color="indigo"
                         @click="addVideo"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </div>
                <v-card-subtitle class="text-center myFontNormal">
                  {{ cardText }}
                </v-card-subtitle>
              </v-card>
            </v-layout>
          </v-col>

          <v-col
            cols="12" xs="12" sm="4" md="3" lg="2" xl="2"
            v-for="(vod, index) in filteredVOD"
            :key="index"
          >
            <v-layout justify-center>
              <clip-card :vod="vod"
                         :selected-tag="selectedTag"
                         @showVOD="showVOD(vod)"
                         @editVOD="editVOD(vod)"
                         @deleteVOD="deleteVOD(vod)"
                         @sortingByTag="sortingByTag"
              />
            </v-layout>
          </v-col>
        </v-row>
        <infinite-loading :identifier="infiniteId" @infinite="initialize"></infinite-loading>
      </v-flex>
    </v-layout>
    <confirm ref="confirm"></confirm>
    <create-edit ref="dialog" />
    <edit-category ref="editCategory" />
    <embed-player ref="iframe" :index="index" :videos="videos"></embed-player>

  </v-container>
</template>

<script>

import {mapState} from "vuex"
import confirm from "../../components/ConfirmDialog";
import CreateEdit from "../../components/Scrapbook/CreateEdit";
import ClipCard from "../../components/Scrapbook/ClipCard";
import EditCategory from "../../components/Scrapbook/EditCategory";
import embedPlayer from "../../components/Player/embedPlayer";

export default {
  name: "Scrapbook",

  components: {
    EditCategory,
    ClipCard,
    confirm,
    CreateEdit,
    embedPlayer
  },
  data() {
    return {
      page: 1,
      infiniteId: +new Date(),
      isLoading: false,
      cardText: "Add your YouTube link.",
      filteredVOD: [],
      selectedTag: "",

      vod: {
        category: 1,
        title: '',
        video_id: '',
        video_url: '',
        tags: []
      },

      index: -1,
      videos: []
    }
  },

  watch: {
    category (val) {
      if (val)
        this.changedList()
    }
  },

  computed: {
    ...mapState(['themeColor']),
    ...mapState('user', ['isLogin', 'userRole']),
    ...mapState('scrapbook', ['categories']),
    category: {
      get () {
        return this.$route.params.category
      }
    }
  },

  mounted() {
    this.$store.commit('SET_ACTIVE_TAB', this.$store.state.tabScrapbook)
    this.$store.dispatch('scrapbook/getCategories')
  },

  methods: {
    addVideo () {
      this.$refs.dialog.open('Add your YouTube video', {
        category: this.category,
        title: '',
        video_id: '',
        video_url: '',
        tags: []
      }, 'scrapbook/addVOD')
        .then((res) => {
          if (res) {
            if (res.scrapbook.video_id !== ''){
              this.changedList()
            }
          }
        })
    },
    showVOD(vod) {
      if (vod.video_url) {
        this.videos= []
        this.videos.push(vod)
        this.index = 0

        this.$refs.iframe.open()
      }
    },

    async editVOD(vod) {
      await this.$refs.dialog.open('Update Scrapbook', vod, 'scrapbook/updateVOD')
    },
    async deleteVOD(vod) {
      if (await this.$refs.confirm.open('Delete selected item.', 'Are you sure?', { color: this.themeColor.errorColor })) {
        await this.$store.dispatch('scrapbook/deleteVOD', vod)
        this.changedList()
      }
    },
    sortingByTag(tag) {
      let filteredVOD = this.filteredVOD.filter(vod => {
        return vod.tags.find(t => t.text === tag.text)
      })
      this.selectedTag = tag.text
      this.filteredVOD = filteredVOD
    },

    changedList() {
      setTimeout(() => {
        this.page = 1
        this.filteredVOD = []
        this.infiniteId += 1
        this.selectedTag = ""
      }, 300)
    },

    initialize($state) {
      this.$store.dispatch("scrapbook/getVideoByPage", {
        page: this.page,
        category: this.category
      })
        .then(res => {
          if (res.length && this.page <= this.$store.state.scrapbook.lastPage) {
            this.page += 1;
            this.filteredVOD.push(...res)
            $state.loaded()
          }
          else $state.complete()
        })
    },

    async editCategory() {
      await this.$refs.editCategory.open('Edit Category Name')
    }
  }
}
</script>

<style scoped>

</style>
