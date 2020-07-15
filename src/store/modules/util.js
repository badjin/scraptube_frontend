import Api from "../../axios";

export default {
  namespaced: true,
  state: {
    alertMessage: {
      value: false,
      type: "",
      message: ""
    },
    snackbarMessage: {
      value: false,
      message: '',
      timeout: 7000,
      type: ""
    },
    keepMessage: false
  },
  mutations: {
    SET_ALERT_MESSAGE(state, payload) {
      state.alertMessage.value = payload.value
      state.alertMessage.type = payload.type
      state.alertMessage.message = payload.message
    },
    SET_KEEP_FLAG(state, payload) {
      state.keepMessage = payload
    },
    SET_SNACKBAR_MESSAGE(state, payload) {
      state.snackbarMessage.value = !!payload.message
      state.snackbarMessage.type = payload.type
      state.snackbarMessage.message = payload.message
    }
  },
  actions: {
    postData({commit}, payload) {
      return new Promise((resolve => {
        Api.post(payload.path, payload.data, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('SET_SNACKBAR_MESSAGE', {
              'type': 'success',
              'message': res.data.message
            })
            resolve(res.data)
          })
          .catch(err => {
            commit('SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.data.message
            })
          })
      }))
    },

    getData({commit}, payload) {
      return new Promise((resolve) => {
        Api.get(payload.path, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            commit('SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.data.message
            })
          })
      })
    },

    getVideoId({ commit },url) {
      return new Promise((resolve) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        let match = regExp.exec(url)
        if (!match) {
          commit('SET_SNACKBAR_MESSAGE', {
            'type': 'error',
            'message': 'Invalid URL. Please check the YouTube link'
          })
          resolve(false)
        }

        const clip = {
          video_id: match[7],
          video_url: "https://www.youtube.com/embed/" + match[7]
        }

        resolve(clip)
      })
    },
  }
}
