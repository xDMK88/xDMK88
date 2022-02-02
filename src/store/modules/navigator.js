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
  mdiTrayFull,
  mdiEyeOffOutline,
  mdiPlay,
  mdiBookmarkOutline,
  mdiCheckBold,
  mdiAccountArrowLeft,
  mdiAccountArrowRight,
  mdiFolder,
  mdiFolderAccount,
  mdiTagText,
  mdiBrushVariant,
  mdiAccountTie
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

    // Push statickly tasks to menu array from state
    state.memu = []
    state.menu.push([{
      label: localization.value.Today,
      uid: resp.data.tasks.items[0].uid,
      bold: resp.data.tasks.items[0].bold,
      icon: mdiCalendar,
      type: 'uid',
      iconBackgroundClass: 'bg-blue-400'
    }])
    state.menu.push([{
      label: localization.value.overdue,
      uid: resp.data.tasks.items[1].uid,
      bold: resp.data.tasks.items[1].bold,
      icon: mdiAlertCircleCheckOutline,
      type: 'uid',
      iconBackgroundClass: 'bg-rose-400'
    }])
    state.menu.push([{
      label: localization.value.open_tasks_to_me,
      uid: resp.data.tasks.items[2].uid,
      bold: resp.data.tasks.items[2].bold,
      icon: mdiFolderAccountOutline,
      type: 'uid',
      iconBackgroundClass: 'bg-yellow-800'
    }])
    state.menu.push([{
      label: localization.value.Inbox,
      uid: resp.data.tasks.items[3].uid,
      bold: resp.data.tasks.items[3].bold,
      icon: mdiTrayFull,
      type: 'uid',
      iconBackgroundClass: 'bg-purple-700'
    }])
    state.menu.push([{
      label: localization.value.Notreaded,
      uid: resp.data.tasks.items[4].uid,
      bold: resp.data.tasks.items[4].bold,
      icon: mdiEyeOffOutline,
      type: 'uid',
      iconBackgroundClass: 'bg-sky-600'
    }])
    state.menu.push([{
      label: localization.value.status_in_work,
      uid: resp.data.tasks.items[5].uid,
      bold: resp.data.tasks.items[5].bold,
      icon: mdiPlay,
      type: 'uid',
      iconBackgroundClass: 'bg-green-300'
    }])
    state.menu.push([{
      label: localization.value.in_focus,
      uid: resp.data.tasks.items[6].uid,
      bold: resp.data.tasks.items[6].bold,
      icon: mdiBookmarkOutline,
      type: 'uid',
      iconBackgroundClass: 'bg-rose-600'
    }])
    state.menu.push([{
      label: localization.value.CompletedTasks,
      uid: resp.data.tasks.items[7].uid,
      bold: resp.data.tasks.items[7].bold,
      icon: mdiCheckBold,
      type: 'uid',
      iconBackgroundClass: 'bg-teal-300'
    }])
    // Push others menu items
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Delegate_tome,
      uid: resp.data.delegate_iam.uid,
      bold: false,
      icon: mdiAccountArrowLeft,
      type: 'greed',
      path: 'delegate_iam',
      iconBackgroundClass: 'bg-indigo-400'
    }])
    state.menu.push([{
      label: localization.value.Delegate_i,
      uid: resp.data.delegate_to_me.uid,
      bold: false,
      icon: mdiAccountArrowRight,
      type: 'greed',
      path: 'delegate_to_me',
      iconBackgroundClass: 'bg-indigo-400'
    }])
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Projects,
      uid: resp.data.private_projects.uid,
      bold: false,
      icon: mdiFolder,
      type: 'greed',
      path: 'private_projects',
      iconBackgroundClass: 'bg-amber-500'
    }])
    state.menu.push([{
      label: localization.value.SharedProjects,
      uid: resp.data.common_projects.uid,
      bold: false,
      icon: mdiFolderAccount,
      type: 'greed',
      path: 'common_projects',
      iconBackgroundClass: 'bg-amber-500'
    }])
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Labels,
      uid: resp.data.tags.uid,
      bold: false,
      icon: mdiTagText,
      type: 'greed',
      path: 'tags',
      iconBackgroundClass: 'bg-yellow-400'
    }])
    state.menu.push([{
      label: localization.value.Colors,
      uid: resp.data.colors.uid,
      bold: false,
      icon: mdiBrushVariant,
      type: 'greed',
      path: 'colors',
      iconBackgroundClass: 'bg-yellow-400'
    }])
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Emps,
      uid: resp.data.emps.uid,
      bold: false,
      icon: mdiAccountTie,
      type: 'greed',
      path: 'emps',
      iconBackgroundClass: 'bg-cyan-500'
    }])
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
