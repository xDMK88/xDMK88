import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REGISTER,
  AUTH_RESET
} from '../actions/auth'
import { RESET_STATE_NAVIGATOR } from '../actions/navigator'
import { setLocalStorageItem } from '@/store/helpers/functions'
import { RESET_STATE_TASKS, PROJECT_TASKS_REQUEST } from '../actions/tasks'
import { RESET_STATE_PROJECT } from '../actions/projects'
import { notify } from 'notiwind'
import axios from 'axios'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false,
  navStack: []
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
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: AUTH_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [AUTH_REGISTER]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REGISTER)
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/new'
      axios({ url: uri, data: user, method: 'POST' })
        .then(resp => {
          console.log(resp)
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: AUTH_REGISTER,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-refresh-token')
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/exit'
      commit(RESET_STATE_NAVIGATOR)
      commit(RESET_STATE_TASKS)
      commit(RESET_STATE_PROJECT)
      commit(PROJECT_TASKS_REQUEST)
      commit(AUTH_REQUEST)
      commit(AUTH_RESET)
      axios.get(url)
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          commit(AUTH_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: AUTH_LOGOUT,
            text: err.response.data
          }, 15000)
          reject(err)
        })
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
    window.location.href += 'login'
  },
  [AUTH_RESET]: (state, index) => {
    if (index === state.navStack.length - 1 || state.navStack.length === 1) {
      return
    }
    console.log(state.navStack)
    state.navStack.splice(index + 1, (state.navStack.length - 1) - index)
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
