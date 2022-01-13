import {
  TASKS_REQUEST,
  SUBTASKS_REQUEST,
  TASKS_ERROR,
  TASKS_SUCCESS
} from '../actions/tasks'

import { AUTH_LOGOUT } from '../actions/auth'

import axios from 'axios'

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const state = {
  tasks: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {
  getTasks: state => state.navigator,
  tasksStatus: state => state.status
}

const actions = {
  [TASKS_REQUEST]: ({ commit, dispatch }, chosenDate) => {
    return new Promise((resolve, reject) => {
      commit(TASKS_REQUEST)
      console.log(chosenDate)
      const month = pad2(chosenDate.getMonth() + 1)
      const day = pad2(chosenDate.getDate())
      const year = chosenDate.getFullYear()
      const formattedDate = day + '-' + month + '-' + year
      console.log(formattedDate)
      const url = 'https://web.leadertask.com/api/v1/tasks/withdate?value=' + formattedDate
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASKS_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [SUBTASKS_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withparent?value=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASKS_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  }
}

const mutations = {
  [TASKS_REQUEST]: state => {
    state.status = 'loading'
  },
  [TASKS_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.tasks = resp.data
    state.hasLoadedOnce = true
  },
  [TASKS_ERROR]: state => {
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
