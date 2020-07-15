export default {
  namespaced: true,
  state: {
    playlists: [],
    currentPage: 1,
    lastPage: 1,
  },
  mutations: {
    SET_ALL_PLAYLISTS(state, payload) {
      state.playlists = payload
      // state.playlists.forEach(playlist => {
      //   playlist.song_list = JSON.parse(playlist.song_list)
      // })
    },
    SET_PAGES(state, payload) {
      state.currentPage = payload.currentPage;
      state.lastPage = payload.lastPage;
    },
    SET_CURRENT_PAGES(state, page) {
      state.currentPage = page;
    },
    DELETE_PLAYLIST(state, index) {
      state.playlists.splice(index, 1)
    },
    ADD_PLAYLIST(state, payload) {
      state.playlists.unshift(payload)
    },
    UPDATE_PLAYLIST(state, payload) {
      state.playlists[payload.index] = payload.data
    },
  },
  actions: {
    getList({ commit, dispatch }, payload) {
      return new Promise((resolve) => {
        dispatch('util/getData', {
            path: 'playlist/index?page='+payload.page+'&table='+payload.table+'&keyword='+payload.keyword
          },
          { root: true }
        ).then((res) => {
          commit('SET_PAGES', {
            currentPage: res.playlists.current_page,
            lastPage: res.playlists.last_page,
          });
          commit('SET_ALL_PLAYLISTS', res.playlists.data);
          resolve(true);
        });
      });
    },
    addPlaylist({ commit, dispatch }, payload) {
      return new Promise(resolve => {
        dispatch('util/postData', {
          path: 'playlist/store',
          data: payload,
        },{ root: true }).then(() => {
          commit('ADD_PLAYLIST', payload)
          resolve(true)
        })
      })
    },
    updatePlaylist({ dispatch }, payload) {
      return new Promise(resolve => {
        dispatch('util/postData',{
          path: 'playlist/update',
          data: payload,
        },{ root: true }).then(res => {
          console.log(res)
          resolve(true)
        })
      })
    },
    updateThumbUp({ dispatch }, payload) {
      return new Promise(resolve => {
        dispatch('util/postData',{
          path: 'playlist/updateThumbUp',
          data: payload.thumbUp,
        },{ root: true }).then(() => {
          dispatch('util/postData', {
            path: 'update-thumbUp',
            data: payload.user
          }, {root: true}).then(res => {
            resolve(res)
          })
        })
      })
    },
    deletePlaylist({ dispatch }, payload) {
      return new Promise((resolve) => {
        dispatch('util/postData', {
            path: 'playlist/delete',
            data: payload,
          }, { root: true }).then(() => {
          resolve(true)
        })
      })
    },
  },
};
