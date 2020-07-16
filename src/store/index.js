import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import util from './modules/util';
import notice from './modules/notice';
import scrapbook from './modules/scrapbook';
import playlist from './modules/playlist';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rules: {
      image: (value) =>
        !value ||
        value.size < 2000000 ||
        'Avatar size should be less than 2 MB!',
      required: (value) => !!value || 'Required.',
      min3: (value) => (value || '').length >= 3 || 'Min 3 characters',
      min8: (value) => (value || '').length >= 8 || 'Min 8 characters',
      max12: (value) => (value || '').length < 13 || 'Max 12 characters',
      max30: (value) =>
        (value || '').length < 31 || 'Max 300 characters',
      emailCheck: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail';
      },
      url: (value) => {
        const regex = /^(http|https)/;
        if (value.length > 8 && value.match(regex)) return true;
        else return 'Invalid url';
      },
    },
    themeColor: {
      color: '#3F51B5',
      backgroundColor: '#9FA8DA',
      cardTitleColor: '#3F51B5',

      btnColor: '#1A237E',
      dialogColor: '#E8EAF6',

      tagColor: '#b3b018',
      errorColor: '#5f394a',
      successColor: '#3fb180',
    },
    avatarUrl: process.env.VUE_APP_IMAGE_URL,
    activeTab: 0,
    tabNotice: 0,
    tabPlaylist: 1,
    tabScrapbook: 2,
  },
  mutations: {
    SET_ACTIVE_TAB(state, payload) {
      state.activeTab = payload;
    },
  },
  actions: {},
  modules: {
    user,
    util,
    notice,
    scrapbook,
    playlist,
  },
});
