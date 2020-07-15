<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs24 sm16 md10>
        <v-card>
          <v-data-table
                        class="elevation-1 pa-2 mb-12"
                        :headers="headers"
                        :items="playlists"
                        sort-desc
                        :expanded.sync="expanded"
                        hide-default-footer
                        @click:row="clicked"
          >
            <template v-slot:top>
              <v-toolbar flat class="hidden-xs-only">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="isLogin" icon @click="addPlaylist" v-on="on" class="mr-4">
                      <v-icon>mdi-playlist-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Add</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="searchFlag" icon @click="listAll" v-on="on">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>List all</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    :placeholder="searchText"
                    single-line
                    hide-details
                    @keyup.enter="findingByTag(search)"
                  ></v-text-field>
                </v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-switch v-model="searchField" class="mt-5" v-on="on"></v-switch>
                  </template>
                  <span>Search from where</span>
                </v-tooltip>
              </v-toolbar>
              <v-toolbar flat class="hidden-sm-and-up mt-10">
                <v-row>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="isLogin" icon @click="addPlaylist" v-on="on" class="mr-4">
                        <v-icon>mdi-playlist-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Add</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="searchFlag" icon @click="listAll" v-on="on">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>List All</span>
                  </v-tooltip>
                  <v-spacer />
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-switch v-model="searchField" class="mt-3" v-on="on"></v-switch>
                    </template>
                    <span>Search from where</span>
                  </v-tooltip>
                  <v-col cols="12" xs="12">
                    <v-text-field
                      class="mt-n6 mb-8"
                      v-model="search"
                      append-icon="mdi-magnify"
                      :placeholder="searchText"
                      single-line
                      hide-details
                      @keyup.enter="findingByTag(search)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-toolbar>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <clip-list class="mt-3 mb-1"
                           v-if="item.song_list.length"
                           :item="item"
                           :thumb-up-flag="thumbUpFlag"
                           :clip-list="clipList"
                           @playMusic="playMusic"
                           @thumbUpEvent="thumbUpControl"
                />
              </td>
            </template>

            <template v-slot:item.thumb_up_count="{ item }">
              {{ item.thumb_up_count }}
            </template>

            <template v-slot:item.avatar_id="{ item }">
              <v-avatar v-if="item.avatar_id > 0">
                <v-img :src="`${avatarUrl}users-${item.avatar_id}.svg`" />
              </v-avatar>
              <v-avatar v-else size="42">
                <v-img :src="item.avatar_image" max-height="100px" max-width="100px" />
              </v-avatar>
            </template>

            <template v-slot:item.name="{ item }">
              <div>{{item.name}}</div>
            </template>

            <template v-slot:item.title="{ item }">
              <div>{{item.title}}</div>
            </template>

            <template v-slot:item.updated_at="{ item }">
              <div>{{ item.updated_at | formatDate }}</div>
            </template>

            <template v-slot:item.actions="{ item }">
              <div v-if="isLogin && (userRole !== 'Member' || userInfo.id === item.user_id)">
                <v-icon small class="mr-3" @click.stop="editPlaylist(item)">mdi-pencil</v-icon>
                <v-icon small @click.stop="deletePlaylist(item)">mdi-delete</v-icon>
              </div>
            </template>
          </v-data-table>
          <Paginate
            :table="searchTable"
            :keyword="searchKeyword"
            :store="storeName"
            class="pa-3 mt-n12 mb-12" />
        </v-card>
      </v-flex>
    </v-layout>
    <create-edit v-if="editedPlaylist !== undefined && editedPlaylist.length > 0"
                 ref="dialog"
                 :edited-playlist="editedPlaylist"/>
    <confirm ref="confirm"></confirm>
    <embedPlayer ref="iframe" :index="index" :videos="videos" />
  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import confirm from "../../components/ConfirmDialog";
  import Paginate from "../../components/Paginate";
  import CreateEdit from "../../components/Playlist/CreateEdit";
  import ClipList from "../../components/Playlist/ClipList";
  import embedPlayer from "../../components/Player/embedPlayer";

  export default {
    components: {
      confirm,
      Paginate,
      CreateEdit,
      ClipList,
      embedPlayer
    },
    data() {
      return {
        headers: [
          { text: "Like", align: "center", sortable: true, value: "thumb_up_count", width: 80 },
          { text: "Avatar", align: "center", sortable: false, value: "avatar_id", width: 80 },
          { text: "Name", align: "center", sortable: false, value: "name", width: 80 },
          { text: "Title", align: "center", sortable: false, value: "title" },
          { text: "Updated", align: "center", sortable: false, value: "updated_at", width: 80 },
          { text: "", align: "end", value: "actions", sortable: false, width: 76 }
        ],
        search: "",
        singleExpand: false,
        expanded: [],
        filteredList: [],
        searchFlag: false,
        editedPlaylist: {},
        defaultPlaylist: {
          id: 0,
          title: '',
          song_list: [],
          thumb_up_count: 0
        },
        editedIndex: -1,
        searchField: true,
        searchText: "Search by title",
        searchTable: "title",
        searchKeyword: "",
        storeName: 'playlist',

        index: -1,
        videos: {},

        oldCount: 0,
        newCount: 0,
        thumbUpFlag: false,
        thumbUpPlaylist: [],

        clipList: {
          isActive: [],
          count: 0,
          active: false
        }
      };
    },
    mounted() {
      this.$store.commit('SET_ACTIVE_TAB', this.$store.state.tabPlaylist)

      if (this.$vuetify.breakpoint.name === 'sm') {
        this.headers[3].width = 100
      } else this.headers[3].width = 304

      if (this.$store.state.user.isLogin) {
        this.$store.dispatch('user/getMemberInfo').then(() => {
          if (this.$store.state.user.userInfo.thumb_up_playlist) {
            if (this.$store.state.user.userInfo.thumb_up_playlist.length){
              this.thumbUpPlaylist = this.$store.state.user.userInfo.thumb_up_playlist
            }
          }
        })
      }

      this.listAll();
    },

    watch: {
      searchField(val) {
        this.searchTable = val ? "title" : "name";
        this.searchText = val ? "Search by title" : "Search by name";
      },
      currentBreakPoint (val) {
        if (val === 'sm') {
          this.headers[3].width = 150
        } else this.headers[3].width = 304
      }
    },

    computed: {
      ...mapState(["avatarUrl", "themeColor"]),
      ...mapState("user", ["isLogin", "userRole", "userInfo"]),
      ...mapState("playlist", ["playlists"]),
      currentBreakPoint: {
        get() {
          return this.$vuetify.breakpoint.name
        }
      },
    },

    methods: {
      async getList(table, keyword) {
        await this.$store.dispatch("playlist/getList", {
          page: 1,
          table: table,
          keyword: keyword
        });
      },
      listAll() {
        this.searchTable = "title";
        this.searchKeyword = "";
        this.getList(this.searchTable, this.searchKeyword);
        this.searchFlag = false;
        this.searchField = true;
      },

      addPlaylist() {
        this.editedPlaylist = Object.assign({}, {
          title: '',
          song_list: [],
          thumb_up_count: 0
        })
        this.$refs.dialog.open("Add playlist")
          .then(res => {
            if (res) this.add()
            else this.close()
          })
      },

      editPlaylist(item) {
        this.editedIndex = this.$store.state.playlist.playlists.indexOf(item);
        this.editedPlaylist = Object.assign({}, item);
        this.$refs.dialog.open("Update playlist")
          .then(res => {
            if (res) this.save()
            else this.close()
          })

      },

      async deletePlaylist(item) {
        const index = this.$store.state.playlist.playlists.indexOf(item);
        if (
          await this.$refs.confirm.open(
            "Delete selected item",
            "Are you sure?",
            { color: this.themeColor.errorColor }
          )
        ) {
          this.editedPlaylist = this.$store.state.playlist.playlists[index];
          await this.$store.dispatch("playlist/deletePlaylist", item);
          await this.getList(this.searchTable, this.searchKeyword);
        }
      },

      async updateThumbUp(item) {
        this.editedIndex = this.$store.state.playlist.playlists.indexOf(item)
        this.editedPlaylist = Object.assign({}, item)
        if (this.editedIndex > -1) {
          this.$store.commit('user/SET_THUMB_UP', this.thumbUpPlaylist)
          this.close()
          await this.$store.dispatch("playlist/updateThumbUp", {
            thumbUp: this.editedPlaylist,
            user: this.$store.state.user.userInfo
          })
          await this.getList(this.searchTable, this.searchKeyword)
        }
      },

      close() {
        setTimeout(() => {
          this.editedPlaylist = {};
          this.editedIndex = -1;
        }, 300);
      },
      async save() {
        if (this.editedIndex > -1) {
          this.close();
          await this.$store.dispatch("playlist/updatePlaylist", this.editedPlaylist);
          await this.getList(this.searchTable, this.searchKeyword);
        }
      },
      async add() {
        this.close();
        await this.$store.dispatch("playlist/addPlaylist", this.editedPlaylist);
        this.listAll();
      },

      findingByTag(tag) {
        if (!tag) {
          this.listAll();
          return;
        }
        this.searchKeyword = tag;
        this.getList(this.searchTable, this.searchKeyword);
        this.searchFlag = true;
        this.search = "";
      },

      checkThumbUpPlaylist(index) {
        if (this.oldCount !== this.expanded[index].thumb_up_count) {
          if (this.oldCount > this.expanded[index].thumb_up_count){
            let i = this.thumbUpPlaylist.findIndex(id => id === this.expanded[index].id)
            if (i > -1) this.thumbUpPlaylist.splice(i, 1)
          } else {
            this.thumbUpPlaylist.push(this.expanded[index].id)
          }
          this.updateThumbUp(this.expanded[index])
        }
        this.expanded.splice(index, 1)
      },

      clicked(value) {
        this.index = -1
        this.clipList = {
          active: false,
          isActive: [],
          count: 0
        }
        const index = this.expanded.indexOf(value)
        if (index === -1) {
          if (this.expanded.length > 0) {
            this.checkThumbUpPlaylist(0)
          }
          this.oldCount = value.thumb_up_count

          let i = this.thumbUpPlaylist.findIndex(id => id === value.id)
          this.thumbUpFlag = (i > -1)

          this.expanded.push(value)
        } else {
          this.checkThumbUpPlaylist(index)
        }
      },
      playMusic(item) {
        this.videos = [];
        this.videos = item.selectedList

        if (!this.videos.length) {
          this.videos.push(item.song);
          this.index = 0;
        } else {
          this.index = item.selectedList.indexOf(item.song);
          if (this.index === -1) this.index = 0;
        }

        this.$refs.iframe.open()
      },
      needLogin() {
        this.$refs.confirm
          .open("This service requires login.", "Go to the login page.", {
            color: this.themeColor.errorColor
          })
          .then(res => {
            if (res) {
              this.$router.push({ name: "Login" });
            }
          });
      },

      thumbUpControl() {
        this.thumbUpFlag = !this.thumbUpFlag
      }
    }
  };
</script>

<style scoped>
  .v-btn {
    text-transform: none !important;
  }
</style>
