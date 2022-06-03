import assignment from '@/icons/assignment.js'
// icons for navigator
import calendar from '@/icons/calendar.js'
import doitnow from '@/icons/doitnow.js'
import employee from '@/icons/employee.js'
import axios from 'axios'
import { notify } from 'notiwind'
import { computed } from 'vue'
import { AUTH_LOGOUT } from '../actions/auth'
import { PUSH_BOARD } from '../actions/boards'
import { PUSH_COLOR, PUSH_MYCOLOR } from '../actions/colors'
import { PUSH_DEPARTMENT } from '../actions/departments'
import { PUSH_EMPLOYEE, PUSH_EMPLOYEE_BY_EMAIL } from '../actions/employees'
import {
  NAVIGATOR_ERROR,
  NAVIGATOR_PUSH_BOARD,
  NAVIGATOR_PUSH_COLOR,
  NAVIGATOR_PUSH_DEPARTAMENT,
  NAVIGATOR_PUSH_EMPLOYEE,
  NAVIGATOR_PUSH_PROJECT,
  NAVIGATOR_PUSH_TAG,
  NAVIGATOR_REMOVE_BOARD,
  NAVIGATOR_REMOVE_COLOR,
  NAVIGATOR_REMOVE_DEPARTAMENT,
  NAVIGATOR_REMOVE_EMPLOYEE,
  NAVIGATOR_REMOVE_PROJECT,
  NAVIGATOR_REMOVE_TAG,
  NAVIGATOR_REQUEST,
  NAVIGATOR_SUCCESS,
  PATCH_SETTINGS,
  PATCH_SETTINGS_SUCCESS,
  RESET_STATE_NAVIGATOR
} from '../actions/navigator'
import { PUSH_PROJECT } from '../actions/projects'
import { ADD_TASK_TAGS } from '../actions/tasks'
import { visitChildren } from '../helpers/functions'

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

// function arrayRemove (arr, value) {
//   return arr.filter(function (ele) {
//     return ele.uid !== value.uid
//   })
// }

const state = getDefaultState()

const getters = {
  getNavigator: (state) => state.navigator,
  navigatorStatus: (state) => state.status
}

const actions = {
  [NAVIGATOR_REQUEST]: ({ commit, dispatch, rootState }) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/navigator/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
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
          // TODO: we are doing the same thing 3 times, DRY
          // process colors in shared vuex storage
          if (resp.data.colors.items) {
            commit(PUSH_COLOR, resp.data.colors.items)
            commit(PUSH_MYCOLOR, resp.data.colors.items)
            visitChildren(resp.data.colors.items, (value) => {
              value.parentID = resp.data.colors.uid
            })
          }
          // process private projects then put them in shared vuex storage
          if (resp.data.private_projects.items) {
            const myPrivateProjects = []
            visitChildren(resp.data.private_projects.items, (value) => {
              value.global_property_uid = resp.data.private_projects.uid
              myPrivateProjects.push(value)
            })
            commit(PUSH_PROJECT, myPrivateProjects)
          }
          // process shared projects then put them in shared vuex storage
          if (resp.data.common_projects.items) {
            const myCommonProjects = []
            visitChildren(resp.data.common_projects.items, (value) => {
              value.global_property_uid = resp.data.common_projects.uid
              myCommonProjects.push(value)
            })
            commit(PUSH_PROJECT, myCommonProjects)
          }

          if (resp.data.private_boards.items) {
            const myPrivateBoards = []
            visitChildren(resp.data.private_boards.items, (value) => {
              value.global_property_uid = resp.data.private_boards.uid
              myPrivateBoards.push(value)
            })
            commit(PUSH_BOARD, myPrivateBoards)
          }
          if (resp.data.common_projects.items) {
            const myCommonBoards = []
            visitChildren(resp.data.common_boards.items, (value) => {
              value.global_property_uid = resp.data.common_boards.uid
              myCommonBoards.push(value)
            })
            commit(PUSH_BOARD, myCommonBoards)
          }
          if (resp.data.deps.items) {
            for (const department of resp.data.deps.items) {
              commit(PUSH_DEPARTMENT, department)
            }
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
        })
        .catch((err) => {
          commit(NAVIGATOR_ERROR, err)
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: NAVIGATOR_REQUEST,
              text: err.response.data
            },
            15000
          )
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [PATCH_SETTINGS]: ({ commit, dispatch }, settings) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/settings/all'
      axios({ url: url, method: 'PATCH', data: settings })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: PATCH_SETTINGS,
              text: err.response.data
            },
            15000
          )
          reject(err)
        })
    })
  }
}

const mutations = {
  [NAVIGATOR_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [NAVIGATOR_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true

    const localization = computed(
      () => resp.rootState.localization.localization
    )
    console.log('navigator ', resp)

    // Push statickly tasks to menu array from state
    state.memu = []
    // state.menu.push('separator')
    // state.menu.push([
    //   {
    //     label: 'Рабочий стол',
    //     uid: '2bad1413-a373-4926-8a3c-58677a680714',
    //     bold: 0,
    //     icon: desktop.path,
    //     width: desktop.width,
    //     height: desktop.height,
    //     iconBox: desktop.viewBox,
    //     type: 'uid',
    //     iconBackgroundClass: 'bg-white-500'
    //   }
    // ])
    state.menu.push([
      {
        label: 'Очередь',
        uid: '2cf6b167-6506-4b05-bc34-70a8d88e3b25',
        bold: 0,
        icon: doitnow.path,
        width: doitnow.width,
        height: doitnow.height,
        iconBox: doitnow.viewBox,
        type: 'uid',
        iconBackgroundClass: 'bg-white-500'
      }
    ])
    state.menu.push([
      {
        label: localization.value.Today,
        uid: resp.data.tasks.items[0].uid,
        bold: resp.data.tasks.items[0].bold,
        icon: calendar.path,
        width: calendar.width,
        height: calendar.height,
        iconBox: calendar.viewBox,
        type: 'uid',
        iconBackgroundClass: 'bg-blue-400'
      }
    ])
    // state.menu.push('separator')
    state.menu.push([
      {
        label: 'Поручения',
        uid: resp.data.delegate_iam.uid,
        bold: false,
        icon: assignment.path,
        iconBox: assignment.viewBox,
        width: assignment.width,
        height: assignment.height,
        type: 'greed',
        path: 'new_delegate',
        iconBackgroundClass: 'bg-indigo-400'
      }
    ])
    // state.menu.push('separator')
    state.menu.push([
      {
        label: 'Проекты',
        uid: resp.data.private_projects.uid,
        bold: false,
        icon: 'M23.8818 9.48613V8.39669C23.8818 7.38613 23.0651 6.56289 22.0625 6.56289H14.565L14.3401 6.18824C14.2031 5.97134 13.9635 5.83331 13.7092 5.83331H8.15332C7.15073 5.83331 6.33398 6.65655 6.33398 7.66712V21.4995C6.33398 22.5101 7.15073 23.3333 8.15332 23.3333H23.6813C24.6839 23.3333 25.5006 22.5101 25.5006 21.4995V11.3101C25.5055 10.3636 24.7915 9.58472 23.8818 9.48613ZM7.81097 7.66712C7.81097 7.47486 7.96748 7.31712 8.15821 7.31712H13.2983L15.2937 10.6002C15.4258 10.8171 15.6654 10.9551 15.9246 10.9551H23.6911C23.8818 10.9551 24.0383 11.1129 24.0383 11.3051V21.4995C24.0383 21.6918 23.8818 21.8495 23.6911 21.8495H8.15332C7.96259 21.8495 7.80608 21.6918 7.80608 21.4995V7.66712H7.81097ZM22.4048 9.47134H16.3306L15.4649 8.04669H22.0576C22.2483 8.04669 22.4048 8.20444 22.4048 8.39669V9.47134Z',
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'new_private_projects',
        iconBackgroundClass: 'bg-amber-500'
      }
    ])
    state.menu.push([
      {
        label: 'Доски',
        uid: resp.data.private_boards.uid,
        bold: false,
        icon: 'M6.5 24.9694C5.67347 24.9694 5 24.3061 5 23.4898V8.85714C5 8.04082 5.67347 7.37755 6.5 7.37755H10.102V6.32653C10.102 5.96939 10.3878 5.68367 10.7449 5.68367H12.7347L12.7857 5.55102C13.1122 4.62245 14.0102 4 15 4C15.9898 4 16.8878 4.62245 17.2143 5.55102L17.2653 5.68367H19.2551C19.6122 5.68367 19.898 5.96939 19.898 6.32653V7.37755H23.5C24.3265 7.37755 25 8.04082 25 8.85714V23.4898C25 24.3061 24.3265 24.9694 23.5 24.9694H6.5ZM6.29592 23.6939H23.7143V8.65306H19.898V9.70408C19.898 10.0612 19.6122 10.3469 19.2551 10.3469H10.7449C10.3878 10.3469 10.102 10.0612 10.102 9.70408V8.65306H6.29592V23.6939ZM11.398 9.06122H18.6122V6.96939H16.7041C16.3469 6.96939 16.0612 6.68367 16.0612 6.32653C16.0612 5.7449 15.5918 5.27551 15.0102 5.27551C14.4286 5.27551 13.949 5.7449 13.949 6.32653C13.949 6.68367 13.6633 6.96939 13.3061 6.96939H11.398V9.06122ZM19.1327 20.3571C18.7041 20.3571 18.3673 20.0102 18.3673 19.5918V18.6224C18.3673 18.1939 18.7143 17.8571 19.1327 17.8571H21.3163C21.7449 17.8571 22.0816 18.2041 22.0816 18.6224V19.5918C22.0816 20.0204 21.7347 20.3571 21.3163 20.3571H19.1327ZM14.0306 20.3571C13.6122 20.3571 13.2653 20.0102 13.2653 19.5918V18.6224C13.2653 18.1939 13.6122 17.8571 14.0306 17.8571H16.2143C16.6429 17.8571 16.9796 18.2041 16.9796 18.6224V19.5918C16.9796 20.0204 16.6327 20.3571 16.2143 20.3571H14.0306ZM8.68367 20.3571C8.2551 20.3571 7.91837 20.0102 7.91837 19.5918V18.6224C7.91837 18.1939 8.26531 17.8571 8.68367 17.8571H10.8673C11.2857 17.8571 11.6327 18.2041 11.6327 18.6224V19.5918C11.6327 20.0204 11.2857 20.3571 10.8673 20.3571H8.68367ZM19.1327 15.5C18.7041 15.5 18.3673 15.1531 18.3673 14.7347V13.7551C18.3673 13.3367 18.7143 12.9898 19.1327 12.9898H21.3163C21.7449 12.9898 22.0816 13.3367 22.0816 13.7551V14.7245C22.0816 15.1429 21.7347 15.4898 21.3163 15.4898H19.1327V15.5ZM14.0306 15.5C13.6122 15.5 13.2653 15.1531 13.2653 14.7347V13.7551C13.2653 13.3367 13.6122 12.9898 14.0306 12.9898H16.2143C16.6429 12.9898 16.9796 13.3367 16.9796 13.7551V14.7245C16.9796 15.1429 16.6327 15.4898 16.2143 15.4898H14.0306V15.5ZM8.68367 15.5C8.2551 15.5 7.91837 15.1531 7.91837 14.7347V13.7551C7.91837 13.3367 8.26531 12.9898 8.68367 12.9898H10.8673C11.2857 12.9898 11.6327 13.3367 11.6327 13.7551V14.7245C11.6327 15.1429 11.2857 15.4898 10.8673 15.4898H8.68367V15.5Z',
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'new_private_boards',
        iconBackgroundClass: 'bg-amber-500'
      }
    ])
    // state.menu.push('separator')
    state.menu.push([
      {
        label: localization.value.Emps,
        uid: resp.data.emps.uid,
        bold: false,
        icon: employee.path,
        type: 'greed',
        path: 'new_emps',
        width: employee.width,
        iconBox: employee.viewBox,
        height: employee.height,
        iconBackgroundClass: 'bg-cyan-500'
      }
    ])
    state.menu.push([
      {
        label: 'Прочее',
        uid: '757be87d-c269-40e0-b224-6b2bb0e4f97d',
        bold: false,
        icon: [
          'M7.5 16.875C8.53553 16.875 9.375 16.0355 9.375 15C9.375 13.9645 8.53553 13.125 7.5 13.125C6.46447 13.125 5.625 13.9645 5.625 15C5.625 16.0355 6.46447 16.875 7.5 16.875Z',
          'M15 16.875C16.0355 16.875 16.875 16.0355 16.875 15C16.875 13.9645 16.0355 13.125 15 13.125C13.9645 13.125 13.125 13.9645 13.125 15C13.125 16.0355 13.9645 16.875 15 16.875Z',
          'M22.5 16.875C23.5355 16.875 24.375 16.0355 24.375 15C24.375 13.9645 23.5355 13.125 22.5 13.125C21.4645 13.125 20.625 13.9645 20.625 15C20.625 16.0355 21.4645 16.875 22.5 16.875Z'
        ],
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'other'
      }
    ])
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
        dep: department,
        items: getAllMembersByDepartmentUID(resp, department.uid)
      }
      newEmps.push(dep)
    }
    newEmps.push({
      dep: { uid: '', name: 'Вне отдела' },
      items: getAllMembersByDepartmentUID(
        resp,
        '00000000-0000-0000-0000-000000000000'
      )
    })
    resp.data.new_emps = newEmps
    // Merge common projects and private projects into my own data structure
    // Array of objects where object is { dep: 'Dependency name', items: items }
    const itemsInProjectView = []
    itemsInProjectView.push({
      dep: localization.value.Projects,
      items: resp.data.private_projects.items,
      type: 'projects'
    })
    itemsInProjectView.push({
      dep: localization.value.SharedProjects,
      items: resp.data.common_projects.items,
      type: 'projects'
    })
    resp.data.new_private_projects = itemsInProjectView

    const newCommonBoards = []
    newCommonBoards.push({
      dep: 'Мои доски',
      items: resp.data.private_boards.items
    })
    newCommonBoards.push({
      dep: 'Общие доски',
      items: resp.data.common_boards.items
    })
    resp.data.new_private_boards = newCommonBoards

    state.navigator = resp.data
  },
  [NAVIGATOR_PUSH_DEPARTAMENT]: (state, departaments) => {
    for (const departament of departaments) {
      state.navigator.deps.items.push(departament)
      if (
        departament.uid_parent ||
        departament.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding departament to the root
        state.navigator.deps.items.push(departament)
      } else {
        // adding departament recursively to subarrays
        visitChildren(state.navigator.deps.items, (value) => {
          if (value.uid === departament.uid_parent) {
            value.children.push(departament)
          }
        })
      }
    }
  },
  [NAVIGATOR_REMOVE_DEPARTAMENT]: (state, departament) => {
    for (let i = 0; i < state.navigator.deps.items.length; i++) {
      if (state.navigator.deps.items[i].uid !== departament.uid) {
        state.navigator.deps.items.splice(i, 1)
        //  state.navigator.deps.items.splice(state.navigator.deps.items.indexOf(department.uid), 1)
      }
    }
  },
  [NAVIGATOR_PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      if (
        !project.uid_parent ||
        project.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding projects to the root
        state.navigator.new_private_projects[0].items.push(project)
      } else {
        // adding projects recursively to subarrays
        visitChildren(
          state.navigator.new_private_projects[0].items,
          (value) => {
            if (value.uid === project.uid_parent) {
              value.children.push(project)
            }
          }
        )
      }
    }
  },
  [NAVIGATOR_PUSH_BOARD]: (state, boards) => {
    for (const board of boards) {
      if (
        !board.uid_parent ||
        board.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding projects to the root
        state.navigator.new_private_boards[0].items.push(board)
      } else {
        // adding projects recursively to subarrays
        visitChildren(state.navigator.new_private_boards[0].items, (value) => {
          if (value.uid === board.uid_parent) {
            value.children.push(board)
          }
        })
      }
    }
  },
  [NAVIGATOR_PUSH_TAG]: (state, tags) => {
    for (const tag of tags) {
      if (
        !tag.uid_parent ||
        tag.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding tags to the root
        state.navigator.tags.items.push(tag)
      } else {
        // adding projects recursively to subarrays
        visitChildren(state.navigator.tags.items, (value) => {
          if (value.uid === tag.uid_parent) {
            value.children.push(tag)
          }
        })
      }
    }
  },
  [NAVIGATOR_PUSH_COLOR]: (state, colors) => {
    for (const color of colors) {
      state.navigator.colors.items.push(color)
    }
  },
  [NAVIGATOR_PUSH_EMPLOYEE]: (state, employees) => {
    for (const employee of employees) {
      state.navigator.new_emps[state.navigator.new_emps.length - 1].items.push(
        employee
      )
    }
  },
  [NAVIGATOR_REMOVE_PROJECT]: (state, project) => {
    if (
      !project.uid_parent ||
      project.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (
        let i = 0;
        i < state.navigator.new_private_projects[0].items.length;
        i++
      ) {
        if (
          state.navigator.new_private_projects[0].items[i].uid === project.uid
        ) {
          state.navigator.new_private_projects[0].items.splice(i, 1)
        }
      }
    } else {
      visitChildren(
        state.navigator.new_private_projects[0].items,
        (value, index) => {
          if (value.uid === project.uid_parent) {
            for (let i = 0; i < value.children.length; i++) {
              if (value.children[i].uid === project.uid) {
                // remove element without mutation
                value.children.splice(i, 1)
              }
            }
          }
        }
      )
    }
  },
  [NAVIGATOR_REMOVE_BOARD]: (state, board) => {
    if (
      !board.uid_parent ||
      board.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (
        let i = 0;
        i < state.navigator.new_private_boards[0].items.length;
        i++
      ) {
        if (state.navigator.new_private_boards[0].items[i].uid === board.uid) {
          state.navigator.new_private_boards[0].items.splice(i, 1)
        }
      }
    } else {
      visitChildren(
        state.navigator.new_private_boards[0].items,
        (value, index) => {
          if (value.uid === board.uid_parent) {
            for (let i = 0; i < value.children.length; i++) {
              if (value.children[i].uid === board.uid) {
                // remove element without mutation
                value.children.splice(i, 1)
              }
            }
          }
        }
      )
    }
  },
  [NAVIGATOR_REMOVE_EMPLOYEE]: (state, employee) => {
    for (const dep of state.navigator.new_emps) {
      for (let i = 0; i < dep.items.length; i++) {
        if (dep.items[i].uid === employee.uid) {
          dep.items.splice(i, 1)
        }
      }
    }
  },
  [NAVIGATOR_REMOVE_TAG]: (state, tag) => {
    // removing wihtout mutation even on root level
    if (
      !tag.uid_parent ||
      tag.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (let i = 0; i < state.navigator.tags.items.length; i++) {
        if (state.navigator.tags.items[i].uid === tag.uid) {
          state.navigator.tags.items.splice(i, 1)
        }
      }
    } else {
      visitChildren(state.navigator.tags.items, (value, index) => {
        if (value.uid === tag.uid_parent) {
          for (let i = 0; i < value.children.length; i++) {
            if (value.children[i].uid === tag.uid) {
              // remove element without mutationy
              value.children.splice(i, 1)
            }
          }
        }
      })
    }
  },
  [NAVIGATOR_REMOVE_COLOR]: (state, color) => {
    for (let i = 0; i < state.navigator.colors.items.length; i++) {
      if (state.navigator.colors.items[i].uid === color.uid) {
        state.navigator.colors.items.splice(i, 1)
      }
    }
  },
  NAVIGATOR_UPDATE_PROJECT: (state, project) => {
    visitChildren(
      state.navigator.new_private_projects[0].items,
      (value, index) => {
        if (value.uid === project.uid) {
          Object.assign(value, project)
        }
      }
    )
  },
  [NAVIGATOR_ERROR]: (state) => {
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
