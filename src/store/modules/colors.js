import {
  PUSH_COLOR,
  PUSH_MYCOLOR,
  SELECT_COLOR,
  CREATE_COLOR_REQUEST,
  UPDATE_COLOR_REQUEST,
  REMOVE_COLOR_REQUEST
} from '../actions/colors'
import axios from 'axios'

const state = {
  colors: {},
  mycolors: {},
  selectedColor: null
}

const getters = {
}

const actions = {
  [CREATE_COLOR_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/markers'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [UPDATE_COLOR_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/markers'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [REMOVE_COLOR_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/markers?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [PUSH_COLOR]: (state, colors) => {
    for (const color of colors) {
      state.colors[color.uid] = color
    }
  },
  [PUSH_MYCOLOR]: (state, mycolors) => {
    for (const color of mycolors) {
      state.mycolors[color.uid] = color
    }
  },
  [SELECT_COLOR]: (state, color) => {
    state.selectedColor = color
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
