import {
  PUSH_EMPLOYEE,
  PUSH_EMPLOYEE_BY_EMAIL,
  SELECT_EMPLOYEE
} from '../actions/employees'

const state = {
  employees: {},
  employeesByEmail: {},
  selectedEmployee: null
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
    state.employeesByEmail[employee.email.toLowerCase()] = employee
  },
  [SELECT_EMPLOYEE]: (state, employee) => {
    state.selectedEmployee = employee
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
