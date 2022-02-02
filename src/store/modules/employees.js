import {
  PUSH_EMPLOYEE,
  PUSH_EMPLOYEE_BY_EMAIL
} from '../actions/employees'

const state = {
  employees: {},
  employeesByEmail: {}
}

const getters = {
}

const actions = {
}

const mutations = {
  [PUSH_EMPLOYEE]: (state, employee) => {
    state.employees[employee.uid] = employee
  },
  [PUSH_EMPLOYEE_BY_EMAIL]: (state, employee) => {
    state.employeesByEmail[employee.email] = employee
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
