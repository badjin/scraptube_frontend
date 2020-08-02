import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
// import VueYoutube from 'vue-youtube'
import VueYouTubeEmbed from 'vue-youtube-embed'
//
Vue.use(VueYouTubeEmbed)
// Vue.use(VueYoutube)

Vue.filter('formatDate', function (value) {
  if (!value) return ''
  return moment(value.toString()).format('MM/DD/YYYY')
})

Vue.use(InfiniteLoading, {
  props: {
    spinner: 'default',
    /* other props need to configure */
  },
  system: {
    throttleLimit: 50,
    /* other settings need to configure */
  },
  slots: {
    noMore: '', // you can pass a string value
  },
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  async beforeCreate() {
    await router.push({name: 'Home'})
    await this.$store.dispatch('notice/getNotice')
    if (localStorage.getItem("Authorization"))
      await this.$store.dispatch('user/getMemberInfo')
  },
  render: h => h(App)
}).$mount('#app')
