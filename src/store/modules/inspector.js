import * as INSPECTOR from '../actions/inspector'
import axios from 'axios'
import { notify } from 'notiwind'

const state = {
  karma: []
}

const getters = {
}

const actions = {
  [INSPECTOR.CREATE_INSPECTOR_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'inspecttask'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'INSPECTOR API Error, please make screenshot',
            action: INSPECTOR.CREATE_INSPECTOR_TASK,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [INSPECTOR.CREATE_OR_UPDATE_INSPECTOR_USER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'user'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'INSPECTOR API Error, please make screenshot',
            action: INSPECTOR.CREATE_INSPECTOR_TASK,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [INSPECTOR.ANSWER_INSPECTOR_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'answer-message?id=' + data.id + '&answer=' + data.answer
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'INSPECTOR API Error, please make screenshot',
            action: INSPECTOR.ANSWER_INSPECTOR_TASK,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [INSPECTOR.KARMA_REQUEST]: ({ commit, dispatch }, uidUser) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'karma?uid_user=' + uidUser
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(INSPECTOR.KARMA_REQUEST, resp.data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'INSPECTOR API Error, please make screenshot',
            action: INSPECTOR.KARMA_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  }
}

const mutations = {
  [INSPECTOR.KARMA_REQUEST]: (state, karma) => {
    state.karma = karma
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
