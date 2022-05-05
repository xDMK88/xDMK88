import * as BOARD from '../actions/boards'
import axios from 'axios'
import { notify } from 'notiwind'

const state = {
  boards: {},
  selectedBoard: undefined
}
const getters = {
}
const getDefaultState = () => {
  return {
    boards: false,
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false,
    selectedBoard: undefined
  }
}

const actions = {
  [BOARD.CARD_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/cards/byboard?uid=' + board_uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: PROJECT.CREATE_PROJECT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [PROJECT.UPDATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: PROJECT.UPDATE_PROJECT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [PROJECT.REMOVE_PROJECT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: PROJECT.REMOVE_PROJECT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [PROJECT.QUIT_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects/exit?uid=' + data.uid + '&email=' + data.value
      axios({ url: url, method: 'POST' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: PROJECT.QUIT_PROJECT_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  }
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
