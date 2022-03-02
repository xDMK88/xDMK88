import * as TASK from '../actions/tasks'
import { AUTH_LOGOUT } from '../actions/auth'
import { PUSH_COLOR } from '../actions/colors'

import axios from 'axios'

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const state = {
  tasks: false,
  tags: {},
  subtasks: false,
  selectedTask: undefined,
  status: '',
  hasLoadedOnce: false,
  loadedTasks: {},
  newtasks: false,
  newConfig: {
    roots: [],
    leaves: [],
    openedIcon: {
      type: 'shape',
      fill: '#6b7280',
      strokeWidth: 1,
      viewBox: '0 0 30 18',
      draw: 'M28.8855 1.11439C29.9269 2.15579 29.9269 3.84423 28.8855 4.88563L16.8855 16.8856C15.8441 17.927 14.1556 17.927 13.1142 16.8856L1.11422 4.88563C0.0728226 3.84423 0.0728226 2.15579 1.11422 1.11439C2.15562 0.0729939 3.84406 0.0729939 4.88546 1.11439L14.9998 11.2288L25.1142 1.11439C26.1556 0.0729939 27.8441 0.0729939 28.8855 1.11439Z'

    },
    closedIcon: {
      type: 'shape',
      fill: '#6b7280',
      strokeWidth: 1,
      viewBox: '0 0 18 30',
      draw: 'M1.11454 1.11439C2.15594 0.0729939 3.84438 0.0729939 4.88578 1.11439L16.8858 13.1144C17.9272 14.1558 17.9272 15.8442 16.8858 16.8856L4.88578 28.8856C3.84438 29.927 2.15594 29.927 1.11454 28.8856C0.0731465 27.8442 0.0731465 26.1558 1.11454 25.1144L11.2289 15L1.11454 4.88563C0.0731465 3.84423 0.0731465 2.15579 1.11454 1.11439Z'
    }
  }
}

const getters = {
  getTasks: state => state.navigator,
  tasksStatus: state => state.status
}

const actions = {
  [TASK.TASKS_REQUEST]: ({ commit, dispatch }, chosenDate) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      if (!chosenDate) {
        chosenDate = new Date()
      }
      const month = pad2(chosenDate.getMonth() + 1)
      const day = pad2(chosenDate.getDate())
      const year = chosenDate.getFullYear()
      const formattedDate = day + '-' + month + '-' + year
      const url = 'https://web.leadertask.com/api/v1/tasks/withdate?value=' + formattedDate
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.SEARCH_TASK]: ({ commit, dispatch }, text) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/search?text=' + text
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.SUBTASKS_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      // commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withparent?value=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.SUBTASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.OPENED_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/opened'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.UNSORTED_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/inbox'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.OVERDUE_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/overdue'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.UNREAD_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/unread'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.IN_WORK_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/inwork'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.IN_FOCUS_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/infocus'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.READY_FOR_COMPLITION_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/ready'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.DELEGATED_TASKS_REQUEST]: ({ commit, dispatch }, email) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/delegate?email=' + email
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.DELEGATED_TO_USER_TASKS_REQUEST]: ({ commit, dispatch }, email) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/delegateme?email=' + email
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.PROJECT_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/byproject?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.TAG_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withtag?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.COLOR_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withcolor?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.EMPLOYEE_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withemp?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.CREATE_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task'
      axios({
        url: url,
        method: 'POST',
        data: data
      })
        .then(resp => {
          commit(TASK.ADD_TASK, resp.data)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_READ]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/readed?uid=' + uid + '&value=1'
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.MARK_TASK_AS_READ, uid)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [TASK.TASKS_REQUEST]: state => {
    state.status = 'loading'
  },
  [TASK.TASKS_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.tasks = resp.data
    state.hasLoadedOnce = true

    Object.assign(state.newtasks, {})
    Object.assign(state.newConfig, { roots: [], leaves: [] })

    const nodes = {}
    for (const node of resp.data.tasks) {
      // write root uid to array
      state.newConfig.roots.push(node.uid)
      if (!node.has_children) {
        state.newConfig.leaves.push(node.uid)
      }
      // write every node into 1d array with objects that has children array in that
      nodes[node.uid] = {
        // text: node.name,
        info: node,
        children: node.has_children ? ['hello'] : ''
      }
    }
    state.newtasks = nodes
  },
  [TASK.SUBTASKS_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.subtasks = resp.data
    state.hasLoadedOnce = true
  },
  [TASK.TASKS_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [TASK.ADD_LOADED_TASK]: (state, uid) => {
    state.loadedTasks[uid] = true
  },
  [TASK.CLEAN_UP_LOADED_TASKS]: state => {
    state.loadedTasks = {}
  },
  [TASK.SELECT_TASK]: (state, task) => {
    state.selectedTask = task
  },
  [TASK.ADD_TASK_TAGS]: (state, tags) => {
    for (const tag of tags) {
      state.tags[tag.uid] = tag
    }
  },
  [TASK.UPDATE_NEW_TASK_LIST]: (state, tasks) => {
    for (const task of tasks) {
      if (!task.has_children) {
        state.newConfig.leaves.push(task.uid)
      }
      state.newtasks[task.uid] = {
        info: task,
        children: task.has_children ? ['hello'] : '',
        state: { checked: false, opened: false }
      }
    }
  },
  [TASK.MARK_TASK_AS_READ]: (state, uid) => {
    state.newtasks[uid].info.readed = 1
  },
  [TASK.ADD_TASK]: (state, task) => {
    state.newConfig.roots.push(task.uid)
    state.newConfig.leaves.push(task.uid)
    state.newtasks[task.uid] = {
      info: task,
      children: task.has_children ? ['hello'] : ''
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
