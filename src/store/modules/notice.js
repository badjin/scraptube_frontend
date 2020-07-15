import Api from "../../axios";

export default {
  namespaced: true,
  state: {
    noticeImages: ""
  },
  mutations: {
    SET_NOTICE(state, payload) {
      state.noticeImages = payload.map((notice) => {
        return notice.notice_image
      })
    }
  },
  actions: {
    getNotice({commit}) {
      return new Promise(resolve => {
        Api.get('admin/notice/index')
          .then(res => {
            commit('SET_NOTICE', res.data.notices)
            resolve(true)
          })
          .catch(err => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.data.message
            }, {root: true})
          })
      })
    },

    postNotice({commit}, notice) {
      return new Promise((resolve) => {
        Api.post('admin/notice/store', notice, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'success',
              'message': res.data.message
            }, {root: true})
            resolve(res.data.notice)
          })
          .catch(err => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.data.message
            }, {root: true})
            console.log(err.response.data.message)
          })
      })
    },

    deleteNotice({commit}, notice) {
      return new Promise((resolve) => {
        Api.post('admin/notice/delete', notice, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'success',
              'message': res.data.message
            }, {root: true})
            resolve(true)
          })
          .catch(err => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.data.message
            }, {root: true})
            console.log(err.response.data.message)
          })
      })
    },
  }
}
