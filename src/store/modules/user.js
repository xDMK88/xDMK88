import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS
} from '../actions/user'

import { notify } from 'notiwind'
import axios from 'axios'

const state = {
  user: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {
}

const actions = {
  [USER_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/account/info'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: USER_REQUEST,
            text: err.response.data
          }, 15000)
          commit(USER_ERROR, err)
          reject(err)
        })
    })
  }
}

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.user = resp.data
    state.hasLoadedOnce = true
  },
  [USER_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
