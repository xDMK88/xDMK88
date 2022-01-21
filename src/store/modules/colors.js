import {
  PUSH_COLOR
} from '../actions/colors'

const state = {
  colors: {}
}

const getters = {
}

const actions = {
}

const mutations = {
  [PUSH_COLOR]: (state, colors) => {
    for (const color of colors) {
      state.colors[color.uid] = color
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
