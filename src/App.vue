<template>
  <v-app id="inspire" class="overflow-x-hidden">

    <nav-bar @toggleDrawer="toggleDrawer"
             :menu-items="menuItems"
             :selected-tab="activeTab"
             @goTo="goTo"
    />

    <nav-drawer :drawer="drawer"
                :menu-items="menuItems"
                @offDrawer="drawer = false"
                @profile="profileUser"
                @goTo="goTo"
    />

    <v-main>
      <scroll-top />
      <router-view/>
    </v-main>

    <user-profile ref="profile" :user="userInfo" :edit-flag="true"></user-profile>

    <v-snackbar v-model="snackbarMessage.value" top class="mt-3"
                :timeout="snackbarMessage.timeout"
                :color="snackbarMessage.type === 'error' ? themeColor.errorColor : themeColor.successColor"
    >
      {{ snackbarMessage.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white"
               icon
               v-bind="attrs"
               @click="snackbarMessage.value = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-footer absolute padless>
      <v-img src="https://picsum.photos/1920/1080?random"
             gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
             width="100%" height="46px"
      >
        <div class="pt-3 pl-4 text-center">
          <span class="white--text pt-5 myFontNormal">&copy; 2020 ScrapTube</span>
        </div>
      </v-img>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapState } from "vuex"
  import UserProfile from "./components/User/UserProfile"
  import NavBar from "./components/NavBar"
  import NavDrawer from "./components/NavDrawer"
  import ScrollTop from "./components/ScrollTop"

  export default {

    components: {
      UserProfile,
      NavBar,
      NavDrawer,
      ScrollTop
    },

    data () {
      return {
        drawer: false,
        menuItems: [
          {id:0, icon: 'mdi-clipboard-outline', title: 'Notice', titleShort: 'Notice', to: '/notice'},
          {id:1, icon: 'mdi-playlist-play', title: 'Playlist', titleShort: 'Playlist', to: '/playlist'},
          {id:2, icon: 'mdi-youtube', title: 'Scrapbook',titleShort: 'Scrapbook', to: '/scrapbook/1'},
        ],
      }
    },

    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('util', ['snackbarMessage']),
      ...mapState(['themeColor', 'activeTab'])
    },
    methods: {
      async profileUser () {
        if (await this.$refs.profile.open('Profile', 'Edit your details', false)) {
          await this.$store.dispatch('user/updateUser', this.userInfo)
        }
      },
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      goTo(item) {
        if (!this.$store.state.user.isLogin && item.id === this.$store.state.tabScrapbook){
          this.$store.commit('util/SET_SNACKBAR_MESSAGE', {
            'type': 'error',
            'message': 'You need to login in order to use this personal service.'
          })
          if (this.$router.currentRoute.name !== 'Home') {
            this.$router.push({name: 'Home'})
          } else {
            this.$store.commit('SET_ACTIVE_TAB', this.$store.state.tabNotice)
          }
        }
        else {
          this.$store.commit('SET_ACTIVE_TAB', item.id)
          if (this.$router.currentRoute.path !== item.to) {
            this.$router.push({path: item.to})
          } else
              if (this.$router.currentRoute.name === 'Scrapbook')
                window.location.reload()
        }
      },
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Cute+Font&display=swap");
  .myFont {
    font-family: 'Black Han Sans', sans-serif;
    font-size: 16px;
    font-weight: 200;
  }

  .myFontNormal {
    font-family: 'Cute Font', cursive;
    font-size: 18px;
    font-weight: 300;
  }

  .myFont33 {
    font-family: 'Cute Font', cursive;
    font-size: 33px;
    font-weight: 300;
  }

  .myFont28 {
    font-family: 'Cute Font', cursive;
    font-size: 28px;
    font-weight: 300;
  }

  .myFont20 {
    font-family: 'Cute Font', cursive;
    font-size: 22px;
    font-weight: 300;
  }

  h1 {
    font-family: 'Cute Font', cursive;
    font-weight: 300;
  }
</style>
