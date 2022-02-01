import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REGISTER
} from '../actions/auth'
import { NAVIGATOR_REQUEST, RESET_STATE_NAVIGATOR } from '../actions/navigator'
import { RESET_STATE_TASKS } from '../actions/tasks'
import axios from 'axios'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, uri) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios({ url: uri, method: 'POST' })
        .then(resp => {
          localStorage.setItem('user-token', resp.data.access_token)
          localStorage.setItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
          dispatch(NAVIGATOR_REQUEST)
          resolve(resp)
        }).catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          reject(err)
        })
    })
  },
  [AUTH_REGISTER]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REGISTER)
      const uri = 'https://web.leadertask.com/api/v1/users/new'
      axios({ url: uri, data: user, method: 'POST' })
        .then(resp => {
          console.log(resp)
          localStorage.setItem('user-token', resp.data.access_token)
          localStorage.setItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          console.log(err.message)
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      const url = 'https://web.leadertask.com/api/v1/account/exit'
      axios.get(url)
        .then(resp => {
          commit(RESET_STATE_NAVIGATOR)
          commit(RESET_STATE_TASKS)
          resolve(resp)
        }).catch(err => {
          commit(AUTH_ERROR, err)
          reject(err)
        })
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-refresh-token')
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [AUTH_REGISTER]: state => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.data.access_token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: state => {
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
