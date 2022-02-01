import {
  NAVIGATOR_REQUEST,
  NAVIGATOR_ERROR,
  NAVIGATOR_SUCCESS,
  PATCH_SETTINGS,
  PATCH_SETTINGS_SUCCESS,
  RESET_STATE_NAVIGATOR
} from '../actions/navigator'
import { AUTH_LOGOUT } from '../actions/auth'
import { ADD_TASK_TAGS } from '../actions/tasks'
import { PUSH_EMPLOYEE } from '../actions/employees'
import { PUSH_PROJECT } from '../actions/projects'
import { PUSH_COLOR } from '../actions/colors'
import { visitChildren } from '../helpers/functions'
import { computed } from 'vue'
import {
  mdiCalendar,
  mdiAlertCircleCheckOutline,
  mdiFolderAccountOutline,
  mdiTrayFull
} from '@mdi/js'

import axios from 'axios'

const getDefaultState = () => {
  return {
    navigator: false,
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false
  }
}

const state = {
  navigator: false,
  status: '',
  computedNavigator: false,
  hasLoadedOnce: false,
  menu: []
}

const getters = {
  getNavigator: state => state.navigator,
  navigatorStatus: state => state.status
}

const actions = {
  [NAVIGATOR_REQUEST]: ({ commit, dispatch, rootState }) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/navigator'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resp.rootState = rootState
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
          dispatch('setDots', resp.data.calendar.dates_with_tasks)
          resolve(resp)
        }).catch(err => {
          commit(NAVIGATOR_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [PATCH_SETTINGS]: ({ commit, dispatch, rootState }, settings) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/settings/all'
      axios({ url: url, method: 'PATCH', data: settings })
        .then(resp => {
          resp.rootState = rootState
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

    console.log('resp ', resp)
    const localization = computed(() => resp.rootState.localization.localization)

    // Old code to compute data to TreeView component
    // resp.data.tasks.items[0].selected = true
    // const dataArray = []
    // dataArray.push({
    //   uid: resp.data.tasks.uid,
    //   name: resp.data.tasks.name,
    //   children: resp.data.tasks.items,
    //   expanded: true
    // })

    // dataArray.push({
    //   uid: resp.data.delegate_iam.uid,
    //   name: localization.value.Delegate_i,
    //   children: resp.data.delegate_iam.items,
    //   expanded: true
    // })
    // dataArray.push({
    //   uid: resp.data.delegate_to_me.uid,
    //   name: localization.value.Delegate_tome,
    //   children: resp.data.delegate_to_me.items,
    //   expanded: true
    // })
    // dataArray.push({
    //   uid: resp.data.private_projects.uid,
    //   name: localization.value.Projects,
    //   children: resp.data.private_projects.items,
    //   expanded: true
    // })
    // dataArray.push({
    //   uid: resp.data.common_projects.uid,
    //   name: localization.value.SharedProjects,
    //   children: resp.data.common_projects.items,
    //   expanded: true
    // })
    // dataArray.push({
    //   uid: resp.data.emps.uid,
    //   name: localization.value.Emps,
    //   children: resp.data.emps.items,
    //   expanded: true
    // })
    // dataArray.push({
    //   uid: resp.data.colors.uid,
    //   name: localization.value.Colors,
    //   children: resp.data.colors.items,
    //   expanded: true
    // })
    // dataArray.push({
    //   uid: resp.data.tags.uid,
    //   name: localization.value.Labels,
    //   children: resp.data.tags.items,
    //   expanded: true
    // })
    // state.computedNavigator = { dataSource: dataArray, id: 'uid', text: 'name', child: 'children' }

    state.menu.push([{ label: localization.value.Today, uid: resp.data.tasks.items[0].uid, bold: resp.data.tasks.items[0].bold, icon: mdiCalendar }])
    state.menu.push([{ label: localization.value.overdue, uid: resp.data.tasks.items[1].uid, bold: resp.data.tasks.items[1].bold, icon: mdiAlertCircleCheckOutline }])
    state.menu.push([{ label: localization.value.open_tasks_to_me, uid: resp.data.tasks.items[2].uid, bold: resp.data.tasks.items[2].bold, icon: mdiFolderAccountOutline }])
    state.menu.push([{ label: localization.value.Inbox, uid: resp.data.tasks.items[2].uid, bold: resp.data.tasks.items[2].bold, icon: mdiTrayFull }])
  },
  [NAVIGATOR_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [PATCH_SETTINGS_SUCCESS]: (state, resp) => {
    state.navigator.settings = resp
  },
  [RESET_STATE_NAVIGATOR]: (state) => {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
