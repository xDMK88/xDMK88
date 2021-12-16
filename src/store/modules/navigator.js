import {
  NAVIGATOR_REQUEST,
  NAVIGATOR_ERROR,
  NAVIGATOR_SUCCESS
} from '../actions/navigator'

import axios from 'axios'

const state = {
  navigator: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {
  getNavigator: state => state.navigator,
  navigatorStatus: state => state.status
}

const actions = {
  [NAVIGATOR_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/navigator?show_compl_tasks=false'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(NAVIGATOR_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(NAVIGATOR_ERROR, err)
          reject(err)
        })
    })
  }
}

const mutations = {
  [NAVIGATOR_REQUEST]: state => {
    state.status = 'loading'
  },
  [NAVIGATOR_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.navigator = resp.data
    state.hasLoadedOnce = true
  },
  [NAVIGATOR_ERROR]: state => {
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
