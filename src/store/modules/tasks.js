import * as TASK from '../actions/tasks'
import { AUTH_LOGOUT } from '../actions/auth'

import axios from 'axios'

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const state = {
  tasks: false,
  subtasks: false,
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
      console.log(chosenDate)
      const month = pad2(chosenDate.getMonth() + 1)
      const day = pad2(chosenDate.getDate())
      const year = chosenDate.getFullYear()
      const formattedDate = day + '-' + month + '-' + year
      console.log(formattedDate)
      const url = 'https://web.leadertask.com/api/v1/tasks/withdate?value=' + formattedDate
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
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
      const url = 'https://web.leadertask.com/api/v1/tasks/delegateme' + email
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
