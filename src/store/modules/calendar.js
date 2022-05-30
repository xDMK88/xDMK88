const state = {
  calendar: [{ key: 'today', highlight: { color: 'gray', fillMode: 'outline', class: 'back-hover' }, dates: new Date() }],
  currentDate: new Date()
}

const getters = {
}

const actions = {
  getDefaultCalendarAttributes ({ commit, state }) {
    const value = [{ key: 'today', highlight: { color: 'gray', fillMode: 'outline', class: 'back-hover' }, dates: new Date() }]
    commit('basic', { key: 'calendar', value })
  },
  setDots ({ commit, state }, dates) {
    const calendarDates = []
    if (dates) {
      for (const date of dates) {
        const splittedDate = date.split('-')
        calendarDates.push(new Date(+splittedDate[2], splittedDate[1] - 1, +splittedDate[0]))
      }
    }
    const attr = { order: 1, dates: calendarDates, highlight: { color: 'dark', class: 'dots-back' } }
    const value = [{ key: 'today', highlight: { fillMode: 'outline', class: 'today' }, dates: new Date() }, attr]
    commit('basic', { key: 'calendar', value })
  }
}

const mutations = {
  basic (state, payload) {
    state[payload.key] = payload.value
  },
  addDot (state, date) {
    let count = 0
    for (let i = 0; i < state.calendar[1].dates.length; i++) {
      const userDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
      if (state.calendar[1].dates[i].getDate() + '-' + (state.calendar[1].dates[i].getMonth() + 1) + '-' + state.calendar[1].dates[i].getFullYear() === userDate) {
        count++
      }
    }
    if (!count) {
      state.calendar[1].dates.push(date)
    }
  },
  deleteDate (state, date) {
    for (let i = 0; i < state.calendar[1].dates.length; i++) {
      const calDate = state.calendar[1].dates[i].getDate() + '-' + (state.calendar[1].dates[i].getMonth() + 1) + '-' + state.calendar[1].dates[i].getFullYear()
      if (calDate === date) {
        state.calendar[1].dates.splice(state.calendar[1].dates.indexOf(date))
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
