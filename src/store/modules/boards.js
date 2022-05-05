import * as BOARD from '../actions/boards'
// import axios from 'axios'
// import { notify } from 'notiwind'

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
}

const mutations = {
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
