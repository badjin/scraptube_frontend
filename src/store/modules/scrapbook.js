import Api from "../../axios";

export default {
  namespaced: true,
  state: {
    vodInfo: {
      category: 1,
      title: '',
      video_id: '',
      video_url: '',
      tags: []
    },
    videos: [],
    categories: {},
    tags1: [{ header: 'Select a tag or create one' }],
    tags2: [{ header: 'Select a tag or create one' }],
    tags3: [{ header: 'Select a tag or create one' }],
    tags: [{ header: 'Select a tag or create one' }],

    lastPage: 1
  },
  mutations: {
    ADD_VOD (state, payload) {
      state.videos.push(payload)
    },
    SET_CATEGORIES(state, payload) {
      state.categories = payload
      // if (payload.tags1)
      //   state.tags1 = JSON.parse(payload.tags1)
      // else
      //   state.tags1 = [{ header: 'Select a tag or create one' }]
      //
      // if (payload.tags2)
      //   state.tags2 = JSON.parse(payload.tags2)
      // else
      //   state.tags2 = [{ header: 'Select a tag or create one' }]
      //
      // if (payload.tags3)
      //   state.tags3 = JSON.parse(payload.tags3)
      // else
      //   state.tags3 = [{ header: 'Select a tag or create one' }]
    },
    SET_TAGS(state, payload) {
      if (payload.length)
        state.tags = payload[0].tags
      else
        state.tags = [{ header: 'Select a tag or create one' }]
    },
    SET_LAST_PAGE(state, payload) {
      state.lastPage = payload
    }
  },

  actions: {
    addVOD({ dispatch }, payload) {
      return new Promise(resolve => {
        dispatch('util/postData', {
          path: 'scrapbook/store',
          data: payload
        }, {root: true}).then(res => resolve(res))
      })
    },

    updateVOD ({ dispatch }, payload) {
      dispatch('util/postData', {
        path: 'scrapbook/update',
        data: payload
      }, {root: true})
    },

    deleteVOD ({ dispatch }, payload) {
      return new Promise((resolve) => {
        dispatch('util/postData', {
          path: 'scrapbook/delete',
          data: payload
        }, {root: true}).then(() => {
          resolve(true)
        })
      })
    },

    getVideoByPage({ commit }, payload) {
      return new Promise((resolve) => {
        Api.get('scrapbook/index?page='+payload.page+'&category='+payload.category, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('SET_LAST_PAGE', res.data.videos.last_page)
            resolve(res.data.videos.data)
          })
          .catch((err) => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.statusText
            }, {root: true})
          })
      })
    },

    getCategories ({ commit }) {
      return new Promise((resolve) => {
        Api.get('category/index', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('SET_CATEGORIES', res.data.categories)
            resolve(true)
          })
          .catch((err) => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.statusText
            }, {root: true})
          })
      })
    },

    updateCategories({ state, dispatch }) {
      dispatch('util/postData', {
        path: 'category/store',
        data: state.categories
      }, {root: true})
    },

    getTags ({ commit }, category) {
      return new Promise((resolve) => {
        Api.get('tag-items/index?category='+category, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('SET_TAGS', res.data.tags)
            resolve(true)
          })
          .catch((err) => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.statusText
            }, {root: true})
          })
      })
    },

    updateTags({ dispatch }, payload) {
      dispatch('util/postData', {
        path: 'tag-items/store',
        data: payload
      }, {root: true})
    },
  }
}
