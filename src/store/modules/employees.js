import {
  PUSH_EMPLOYEE,
  PUSH_EMPLOYEE_BY_EMAIL,
  SELECT_EMPLOYEE,
  CREATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  REMOVE_EMPLOYEE_REQUEST
} from '../actions/employees'
import axios from 'axios'

const state = {
  employees: {},
  employeesByEmail: {},
  selectedEmployee: null
}

const getters = {
}

const actions = {
  [CREATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/emp'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [UPDATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/emp'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [REMOVE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/emp?uid_delete=' + data.uid + '&uid_delegate=00000000-0000-0000-0000-000000000000'
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
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
