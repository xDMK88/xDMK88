function getTodaysDateInFormat () {
  const today = new Date()
  const day = today.getDate()
  const month = today.toLocaleString('default', { month: 'short' })
  const weekday = today.toLocaleString('default', { weekday: 'short' })
  return day + ' ' + month + ', ' + weekday
}

const state = {
  label: getTodaysDateInFormat(),
  labelprojectchilren: '',
  labeldefault: ''
}

const getters = {
}

const actions = {
}

const mutations = {
  updatedefalt (state, payload) {
    state.labeldefault = payload
  },
  updateLabel (state, payload) {
    state.label = payload
  },
  updateLabelprojectchildren (state, payload) {
    if (payload.length > 1) {
      state.labelprojectchilren += payload.length > 1 ? payload + ',' : payload + ''
    } else {
      state.labelprojectchilren = payload
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
