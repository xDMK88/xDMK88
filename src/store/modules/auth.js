import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REGISTER
} from '../actions/auth'
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
  [AUTH_REQUEST]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/users/auth?login=' + user.email + '&password=' + user.password + '&system=android&type_device=mobile'
      axios({ url: url, method: 'POST' })
        .then(resp => {
          localStorage.setItem('user-token', resp.data.access_token)
          localStorage.setItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
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
      const url = 'https://web.leadertask.com/api/v1/users/new'
      axios.post(url, user)
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
          console.log(resp)
          resolve(resp)
        }).catch(err => {
          console.log(err.message)
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          localStorage.removeItem('user-refresh-token')
          reject(err)
        })
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-refresh-token')
      resolve()
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
