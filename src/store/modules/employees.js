import {
  PUSH_EMPLOYEE
} from '../actions/employees'

const state = {
  employees: {}
}

const getters = {
}

const actions = {
}

const mutations = {
  [PUSH_EMPLOYEE]: (state, employee) => {
    state.employees[employee.uid] = employee
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
