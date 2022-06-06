import { NAVIGATOR_PUSH_EMPLOYEE } from '@/store/actions/navigator'
import axios from 'axios'
import { notify } from 'notiwind'
import {
  CREATE_EMPLOYEE_REQUEST, PUSH_EMPLOYEE,
  PUSH_EMPLOYEE_BY_EMAIL, REMOVE_EMPLOYEE_REQUEST, SELECT_EMPLOYEE, UPDATE_EMPLOYEE_REQUEST
} from '../actions/employees'

const state = {
  employees: {},
  employeesByEmail: {},
  selectedEmployee: null
}

const getters = {}

const actions = {
  [CREATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/emp'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          const employee = resp.data
          employee.parentID = 'd28e3872-9a23-4158-aea0-246e2874da73' // resp.data.emps.uid
          commit(PUSH_EMPLOYEE, employee)
          commit(PUSH_EMPLOYEE_BY_EMAIL, employee)
          commit(NAVIGATOR_PUSH_EMPLOYEE, [employee])
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: CREATE_EMPLOYEE_REQUEST,
              text: err.response?.data ?? err
            },
            15000
          )
          reject(err)
        })
    })
  },
  [UPDATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/emp/title/?email=' +
        data.email +
        '&title=' +
        data.name
      axios({ url: url, method: 'PATCH' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: UPDATE_EMPLOYEE_REQUEST,
              text: err.response.data
            },
            15000
          )
          reject(err)
        })
    })
  },
  [REMOVE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/emp?uid_delete=' +
        data.uid +
        '&uid_delegate=00000000-0000-0000-0000-000000000000'
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: REMOVE_EMPLOYEE_REQUEST,
              text: err.response.data
            },
            15000
          )
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
