<template>
  <v-navigation-drawer v-if="isLogin"
                       v-model="drawer"
                       dark
                       app
                       :expand-on-hover="expandOnHover"
                       :mini-variant="miniVariant"
                       absolute
                       temporary
                       class="navImg items"
  >
    <v-img src="https://picsum.photos/1920/1080?random"
           gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
           height="100%"
    >
      <v-list dense nav class="py-0">
        <v-list-item
          two-line
          :class="miniVariant && 'px-0'"
          class="mt-1"
        >

          <v-list-item-avatar v-if="userInfo.avatar_image">
            <v-img :src="userInfo.avatar_image" max-height="100px" max-width="100px"/>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-img :src="`${avatarUrl}users-${userInfo.avatar_id}.svg`"/>
          </v-list-item-avatar>

          <v-list-item-content class="mt-2">
            <v-list-item-title class="text-uppercase">{{ userInfo.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mb-1"/>

        <v-list-item
          link
          @click="profile"
          exact
        >
          <v-list-item-icon>
            <v-icon>mdi-account-box</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class=" mt-1">{{Profile}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mb-1"/>

        <v-list-item v-for="item in menuItems" :key="item.id"
                     @click="goTo(item)"
                     class="hidden-sm-and-up"
        >
          <v-list-item-icon>
            <v-icon v-show="item.id === 0 || isLogin">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-show="item.id === 0 || isLogin" class=" mt-1">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mb-1 hidden-sm-and-up"/>

        <v-list-item v-if="userRole === 'Admin'"
                     link
                     router :to="{path: '/admin/users'}"
                     exact
        >
          <v-list-item-icon>
            <v-icon>mdi-folder-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class=" mt-1">{{UserManagement}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="userRole !== 'Member'"
                     link
                     router :to="{path: '/admin/notice'}"
                     exact
        >
          <v-list-item-icon>
            <v-icon>mdi-transcribe</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="mt-1">{{NoticeUpdate}}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

        <v-list-item
          link
          exact
          @click="logoutUser"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class=" mt-1">{{LogOut}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-img>
  </v-navigation-drawer>
  <v-navigation-drawer v-else
                       v-model="drawer"
                       dark
                       app
                       :expand-on-hover="expandOnHover"
                       :mini-variant="miniVariant"
                       absolute
                       temporary
                       class="navImg items"
  >
    <v-img src="https://picsum.photos/1920/1080?random"
           gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
           height="100%"
    >
      <v-list dense nav class="py-0">
        <v-list-item
          two-line
          :class="miniVariant && 'px-0'"
          class="mt-1"
          link
          exact
        >
          <v-img src="@/assets/logo.png"
                 max-height="80"
                 max-width="80"
          />

        </v-list-item>

        <v-divider class="mb-1"/>

        <v-list-item v-for="item in menuItems" :key="item.id"
                     @click="goTo(item)"
                     class="hidden-sm-and-up"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class=" mt-1">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
  import { mapState } from "vuex"

  export default {
    name: "NavDrawer",
    props: ['drawer', 'menuItems'],
    data() {
      return {
        Profile: 'Profile',
        UserManagement: 'Members',
        NoticeUpdate: 'Notice Update',
        LogOut: 'Log Out',

        miniVariant: false,
        expandOnHover: false
      }
    },

    watch: {
      drawer(val) {
        if (!val) {
          this.$emit('offDrawer')
        }
      }
    },

    computed: {
      ...mapState('user', ['isLogin', 'userInfo', 'userRole']),
      ...mapState(['themeColor', 'avatarUrl']),
    },
    methods: {
      logoutUser() {
        this.$store.dispatch('user/logout')
          .then(() => {
            this.$emit('offDrawer')
            if (this.$router.currentRoute.name !== 'Home') this.$router.push({name: 'Home'})
          })
      },
      profile() {
        this.$emit('profile')
      },
      goTo(item) {
        this.$emit('goTo', item)
      },
    }
  }
</script>

<style scoped>
  .items {
    position:fixed;
    top:0;
    left:0;
  }
</style>
