function getTodaysDateInFormat () {
  const today = new Date()
  const day = today.getDate()
  const month = today.toLocaleString('default', { month: 'short' })
  const weekday = today.toLocaleString('default', { weekday: 'short' })
  return day + ' ' + month + ', ' + weekday
}

const state = {
  label: getTodaysDateInFormat()
}

const getters = {
}

const actions = {
}

const mutations = {
  updateLabel (state, payload) {
    state.label = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
