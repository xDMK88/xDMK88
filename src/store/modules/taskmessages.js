import {
  MESSAGES_REQUEST,
  CREATE_MESSAGE_REQUEST,
  MESSAGES_ERROR,
  MESSAGES_SUCCESS,
  REFRESH_MESSAGES
} from '../actions/taskmessages'
import { AUTH_LOGOUT } from '../actions/auth'
import { notify } from 'notiwind'

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
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: MESSAGES_REQUEST,
            text: err.response.data
          }, 15000)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [CREATE_MESSAGE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasksmsgs'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
          commit(CREATE_MESSAGE_REQUEST, data)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: CREATE_MESSAGE_REQUEST,
            text: err.response.data
          }, 15000)
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
  },
  [CREATE_MESSAGE_REQUEST]: (state, data) => {
    state.messages.push(data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
