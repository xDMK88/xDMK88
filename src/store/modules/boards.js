import * as BOARD from '../actions/boards'
import axios from 'axios'
import { notify } from 'notiwind'

const state = {
  boards: {},
  selectedBoard: undefined
}
const getters = {
}
// const getDefaultState = () => {
//   return {
//     boards: false,
//     status: '',
//     computedNavigator: false,
//     hasLoadedOnce: false,
//     selectedBoard: undefined
//   }
// }

const actions = {
  [BOARD.CREATE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        '/api/v1/board'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: BOARD.CREATE_BOARD_REQUEST,
              text: err.response.data
            },
            15000
          )
          reject(err)
        })
    })
  },
  [BOARD.UPDATE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        '/api/v1/board'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: BOARD.UPDATE_BOARD_REQUEST,
              text: err.response.data
            },
            15000
          )
          reject(err)
        })
    })
  },
  [BOARD.REMOVE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        '/api/v1/board'
      axios({ url: url, method: 'DELETE', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: BOARD.REMOVE_BOARD_REQUEST,
              text: err.response.data
            },
            15000
          )
          reject(err)
        })
    })
  },
  [BOARD.QUIT_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        '/api/v1/board/exit'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: BOARD.REMOVE_BOARD_REQUEST,
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
  [BOARD.PUSH_BOARD]: (state, boards) => {
    for (const board of boards) {
      state.boards[board.uid] = board
    }
  },
  [BOARD.SELECT_BOARD]: (state, board) => {
    state.selectedBoard = board
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
