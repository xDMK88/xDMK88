const state = {
  navStack: []
}

const getters = {
}

const actions = {
}

const mutations = {
  pushIntoNavStack: (state, navElement) => {
    state.navStack.push(navElement)
  },
  updateStackWithInitValue: (state, navElement) => {
    state.navStack = [navElement]
  },
  removeAllFromStackAfterIndex: (state, index) => {
    if (index === state.navStack.length - 1 || state.navStack.length === 1) {
      return
    }
    state.navStack.splice(index + 1, (state.navStack.length - 1) - index)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
