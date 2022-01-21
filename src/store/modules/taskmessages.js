import {
  MESSAGES_REQUEST,
  MESSAGES_ERROR,
  MESSAGES_SUCCESS,
  REFRESH_MESSAGES
} from '../actions/taskmessages'
import { AUTH_LOGOUT } from '../actions/auth'

import axios from 'axios'

const state = {
  messages: [],
  status: '',
  hasLoadedOnce: false
}

const getters = {
}

const actions = {
  [MESSAGES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasksmsgs/bytask?uid=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(MESSAGES_SUCCESS, resp)
          console.log(resp)
          resolve(resp)
        }).catch(err => {
          commit(MESSAGES_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  }
}

const mutations = {
  [MESSAGES_REQUEST]: state => {
    state.status = 'loading'
  },
  [MESSAGES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.messages = resp.data.msgs
    state.hasLoadedOnce = true
  },
  [MESSAGES_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_MESSAGES]: state => {
    state.messages = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
