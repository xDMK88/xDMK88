import {
  FILES_REQUEST,
  FILES_ERROR,
  FILES_SUCCESS,
  REFRESH_FILES,
  MYFILES,
  GETFILES,
  FILE_SUCCESS,
  CREATE_FILES_REQUEST
} from '../actions/taskfiles'
import { AUTH_LOGOUT } from '../actions/auth'
import { notify } from 'notiwind'

import axios from 'axios'

const state = {
  files: [],
  file: '',
  status: '',
  hasLoadedOnce: false,
  myfiles: {}
}

const getters = {
}

const actions = {
  [FILES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(FILES_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasksfiles/bytask?uid=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(FILES_SUCCESS, resp)
          console.log(resp)
          resolve(resp)
        }).catch(err => {
          commit(FILES_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: FILES_REQUEST,
            text: err.response.data
          }, 15000)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [GETFILES]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(GETFILES)
      const url = 'https://web.leadertask.com/api/v1/tasksfiles/file?uid=' + uid
      axios({ url: url, method: 'GET', responseType: 'blob' })
        .then(resp => {
          commit(FILE_SUCCESS, resp)
          console.log(resp)
          resolve(resp)
        }).catch(err => {
          commit(FILES_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: GETFILES,
            text: err.response.data
          }, 15000)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [CREATE_FILES_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('files', data.name)
      const url = 'https://web.leadertask.com/api/v1/tasksfiles?uid_task=' + data.uid_task
      axios({
        url: url,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(resp => {
          commit(CREATE_FILES_REQUEST, data)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [FILES_REQUEST]: state => {
    state.status = 'loading'
  },
  [FILES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.files = resp.data.files
    state.hasLoadedOnce = true
  },
  [FILE_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.file = resp.data.files
    state.hasLoadedOnce = true
  },
  [MYFILES]: (state, myfiles) => {
    state.status = 'success'
    for (const taskfile of myfiles) {
      state.myfiles[taskfile.uid_creator] = taskfile
    }
    state.hasLoadedOnce = true
  },
  [FILES_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_FILES]: state => {
    state.files = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
