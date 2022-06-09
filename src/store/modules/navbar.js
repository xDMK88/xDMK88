import { setLocalStorageItem } from '@/store/helpers/functions'

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
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  },
  updateStackWithInitValue: (state, navElement) => {
    state.navStack = [navElement]
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  },
  removeAllFromStackAfterIndex: (state, index) => {
    if (index === state.navStack.length - 1 || state.navStack.length === 1) {
      return
    }
    state.navStack.splice(index + 1, (state.navStack.length - 1) - index)
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
