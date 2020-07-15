<template>
  <v-app-bar
    app
    src="https://picsum.photos/1920/1080?random"
    dark
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
      ></v-img>
    </template>

    <v-app-bar-nav-icon v-if="isLogin" @click.stop="drawer" />
    <v-app-bar-nav-icon v-else class="hidden-sm-and-up" @click.stop="drawer" />

    <v-img src="@/assets/logo.png"
           max-height="160"
           max-width="160"
           class="mt-12 hidden-sm-and-down"
           @click="gotoHome"
    />
    <v-img src="@/assets/logo.png"
           max-height="80"
           max-width="80"
           class="mt-2 hidden-md-and-up"
           @click="gotoHome"
    />

<!--    <v-img src="@/assets/logo.png"-->
<!--           max-height="80"-->
<!--           max-width="80"-->
<!--           @click="gotoHome"-->
<!--    />-->

<!--    <v-toolbar-items class="hidden-xs-only">-->
<!--      <v-btn text v-for="item in menuItems" :key="item.id" @click="goTo(item)">-->
<!--        <v-icon left dark>{{ item.icon }}</v-icon>-->
<!--        <span>{{ item.title }}</span>-->
<!--      </v-btn>-->
<!--    </v-toolbar-items>-->

    <v-spacer/>

    <v-toolbar-items v-show="!isLogin">
      <v-btn @click="goSignIn"
             target="_blank"
             text
      >
        <span class="hidden-xs-only mr-2 ">{{LogIn}}</span>
        <v-icon class="mb-1">mdi-login</v-icon>
      </v-btn>
      <v-btn @click="goSignUp"
             target="_blank"
             text
      >
        <span class="hidden-xs-only mr-2 ">{{Register}}</span>
        <v-icon class="mb-1">mdi-account-plus</v-icon>
      </v-btn>
    </v-toolbar-items>

    <template v-slot:extension>
      <v-tabs  centered class="hidden-xs-only" icons-and-text v-model="activeTab">
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="item in menuItems" :key="item.id" @click="goTo(item)">
          <span class="hidden-sm-and-down ">{{ item.title }}</span>
          <span class="hidden-md-and-up ">{{ item.titleShort }}</span>
          <v-icon left dark>{{ item.icon }}</v-icon>
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
  import { mapState } from "vuex"

  export default {
    name: "NavBar",
    props: ['menuItems', 'selectedTab'],
    data() {
      return {
        LogIn: 'Log In',
        Register: 'Register',
      }
    },
    computed: {
      ...mapState('user', ['isLogin']),
      ...mapState(['activeTab'])
    },

    methods: {
      gotoHome() {
        if (this.$router.currentRoute.name !== 'Home')
          this.$router.push({ name: 'Home' })
      },
      goSignIn() {
        if (this.$router.currentRoute.name !== 'Login')
          this.$router.push({ name: 'Login' })
      },
      goSignUp() {
        if (this.$router.currentRoute.name !== 'Register')
          this.$router.push({ name: 'Register' })
      },
      goTo(item) {
        this.$emit('goTo', item)
      },
      drawer() {
        this.$emit('toggleDrawer')
      }
    }
  }
</script>

