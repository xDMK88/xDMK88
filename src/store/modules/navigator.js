import {
  NAVIGATOR_REQUEST,
  NAVIGATOR_ERROR,
  NAVIGATOR_SUCCESS
} from '../actions/navigator'
import { AUTH_LOGOUT } from '../actions/auth'
import { ADD_TASK_TAGS } from '../actions/tasks'
import { PUSH_EMPLOYEE } from '../actions/employees'
import { PUSH_PROJECT } from '../actions/projects'
import { PUSH_COLOR } from '../actions/colors'
import { visitChildren } from '../helpers/functions'

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
  [NAVIGATOR_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/navigator'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(NAVIGATOR_SUCCESS, resp)
          if (resp.data.emps.items) {
            for (const employee of resp.data.emps.items) {
              commit(PUSH_EMPLOYEE, employee)
            }
          }
          // process colors in shared vuex storage
          if (resp.data.colors.items) {
            commit(PUSH_COLOR, resp.data.colors.items)
          }
          // process private projects then put them in shared vuex storage
          if (resp.data.private_projects.items) {
            const myPrivateProjects = []
            visitChildren(resp.data.private_projects.items, value => {
              value.global_property_uid = resp.data.private_projects.uid
              myPrivateProjects.push(value)
            })
            commit(PUSH_PROJECT, myPrivateProjects)
          }
          // process shared projects then put them in shared vuex storage
          if (resp.data.common_projects.items) {
            const myCommonProjects = []
            visitChildren(resp.data.common_projects.items, value => {
              value.global_property_uid = resp.data.common_projects.uid
              myCommonProjects.push(value)
            })
            commit(PUSH_PROJECT, myCommonProjects)
          }
          // process tags then put them in shared vuex storage
          if (resp.data.tags.items) {
            const myTags = []
            visitChildren(resp.data.tags.items, (value) => {
              // TODO: how to remove children without hurt actual data?
              // if (value.children) value.children = []
              myTags.push(value)
            })
            commit(ADD_TASK_TAGS, myTags)
          }
          resolve(resp)
        }).catch(err => {
          commit(NAVIGATOR_ERROR, err)
          dispatch(AUTH_LOGOUT)
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
