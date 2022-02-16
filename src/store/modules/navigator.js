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
import { PUSH_EMPLOYEE, PUSH_EMPLOYEE_BY_EMAIL } from '../actions/employees'
import { PUSH_PROJECT } from '../actions/projects'
import { PUSH_COLOR } from '../actions/colors'
import { visitChildren } from '../helpers/functions'
import { computed } from 'vue'

import calendar from '@/icons/calendar.js'
import overdue from '@/icons/overdue.js'
import unsorted from '@/icons/unsorted.js'
import unread from '@/icons/unread.js'
import focus from '@/icons/focus.js'
import ready from '@/icons/ready.js'
import project from '@/icons/project.js'
import tag from '@/icons/tag.js'
import color from '@/icons/color.js'

import {
  mdiTrayFull,
  mdiPlay,
  mdiAccountArrowLeft,
  mdiAccountTie
} from '@mdi/js'

import axios from 'axios'

const getDefaultState = () => {
  return {
    navigator: false,
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false,
    menu: []
  }
}

function getAllMembersByDepartmentUID (resp, departmentUID) {
  const employeesStuck = []
  for (const employee of resp.data.emps.items) {
    if (employee.uid_dep === departmentUID) {
      employeesStuck.push(employee)
    }
  }
  return employeesStuck
}

const state = getDefaultState()

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
              employee.parentID = resp.data.emps.uid
              commit(PUSH_EMPLOYEE, employee)
              commit(PUSH_EMPLOYEE_BY_EMAIL, employee)
            }
          }
          if (resp.data.delegate_iam) {
            for (const dm of resp.data.delegate_iam.items) {
              dm.parentID = resp.data.delegate_iam.uid
            }
          }
          if (resp.data.delegate_to_me) {
            for (const dt of resp.data.delegate_to_me.items) {
              dt.parentID = resp.data.delegate_to_me.uid
            }
          }
          // process colors in shared vuex storage
          if (resp.data.colors.items) {
            commit(PUSH_COLOR, resp.data.colors.items)
            visitChildren(resp.data.colors.items, value => {
              value.parentID = resp.data.colors.uid
            })
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
              value.global_property_uid = resp.data.tags.uid
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
    state.hasLoadedOnce = true

    const localization = computed(() => resp.rootState.localization.localization)

    // Push statickly tasks to menu array from state
    state.memu = []
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Today,
      uid: resp.data.tasks.items[0].uid,
      bold: resp.data.tasks.items[0].bold,
      icon: calendar.path,
      width: calendar.width,
      height: calendar.height,
      iconBox: calendar.viewBox,
      type: 'uid',
      iconBackgroundClass: 'bg-blue-400'
    }])
    state.menu.push([{
      label: localization.value.overdue,
      uid: resp.data.tasks.items[1].uid,
      bold: resp.data.tasks.items[1].bold,
      icon: overdue.path,
      width: overdue.width,
      height: overdue.height,
      iconBox: overdue.viewBox,
      type: 'uid',
      iconBackgroundClass: 'bg-red-500'
    }])
    state.menu.push([{
      label: localization.value.open_tasks_to_me,
      uid: resp.data.tasks.items[2].uid,
      bold: resp.data.tasks.items[2].bold,
      icon: unsorted.path,
      width: unsorted.width,
      height: unsorted.height,
      iconBox: unsorted.viewBox,
      type: 'uid',
      iconBackgroundClass: 'bg-stone-600'
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
      icon: unread.path,
      iconBox: unread.viewBox,
      width: unread.width,
      height: unread.heght,
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
      icon: focus.path,
      iconBox: focus.viewBox,
      width: focus.width,
      heigth: focus.height,
      type: 'uid',
      iconBackgroundClass: 'bg-red-500'
    }])
    state.menu.push([{
      label: localization.value.CompletedTasks,
      uid: resp.data.tasks.items[7].uid,
      bold: resp.data.tasks.items[7].bold,
      icon: ready.path,
      iconBox: ready.viewBox,
      width: ready.width,
      height: ready.height,
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
      path: 'new_delegate',
      iconBackgroundClass: 'bg-indigo-400'
    }])
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Projects,
      uid: resp.data.private_projects.uid,
      bold: false,
      icon: project.path,
      iconBox: project.viewBox,
      width: project.width,
      height: project.height,
      type: 'greed',
      path: 'new_private_projects',
      iconBackgroundClass: 'bg-amber-500'
    }])
    state.menu.push('separator')
    state.menu.push([{
      label: localization.value.Labels,
      uid: resp.data.tags.uid,
      bold: false,
      icon: tag.path,
      iconBox: tag.viewBox,
      width: tag.width,
      height: tag.height,
      type: 'greed',
      path: 'tags',
      iconBackgroundClass: 'bg-yellow-400'
    }])
    state.menu.push([{
      label: localization.value.Colors,
      uid: resp.data.colors.uid,
      bold: false,
      icon: color.path,
      iconBox: color.viewBox,
      width: color.width,
      height: color.height,
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
      path: 'new_emps',
      iconBackgroundClass: 'bg-cyan-500'
    }])

    const newAssignments = []
    newAssignments.push({
      dep: localization.value.Delegate_i,
      items: resp.data.delegate_iam.items
    })
    newAssignments.push({
      dep: localization.value.Delegate_tome,
      items: resp.data.delegate_to_me.items
    })
    resp.data.new_delegate = newAssignments

    // Merge emps to deps like new private projects
    const newEmps = []
    for (const department of resp.data.deps.items) {
      const dep = {
        dep: department.name,
        items: getAllMembersByDepartmentUID(resp, department.uid)
      }
      newEmps.push(dep)
    }
    resp.data.new_emps = newEmps

    // Merge common projects and private projects into my own data structure
    // Array of objects where object is { dep: 'Dependency name', items: items }
    const newCommonProjects = []
    newCommonProjects.push({
      dep: localization.value.Projects,
      items: resp.data.private_projects.items
    })
    newCommonProjects.push({
      dep: localization.value.SharedProjects,
      items: resp.data.common_projects.items
    })
    resp.data.new_private_projects = newCommonProjects
    state.navigator = resp.data
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
