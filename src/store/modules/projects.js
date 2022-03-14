import * as PROJECT from '../actions/projects'
import axios from 'axios'

const state = {
  projects: {},
  selectedProject: undefined
}

const getters = {
}

const actions = {
  [PROJECT.CREATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/projects'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [PROJECT.UPDATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/projects'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [PROJECT.REMOVE_PROJECT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/projects?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [PROJECT.QUIT_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/projects/exit?uid' + data.uid + '&email=' + data.value
      axios({ url: url, method: 'POST' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [PROJECT.PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      state.projects[project.uid] = project
    }
  },
  [PROJECT.SELECT_PROJECT]: (state, project) => {
    state.selectedProject = project
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
