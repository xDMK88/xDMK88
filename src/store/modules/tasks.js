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
  loadedTasks: {}
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
      commit(TASK.TASKS_REQUEST)
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
