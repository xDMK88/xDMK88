import * as CARD from '@/store/actions/cards'
import * as TASK from '@/store/actions/tasks'
import { setLocalStorageItem, visitChildren } from '@/store/helpers/functions'

const state = {
  navStack: []
}

const getters = {}

const actions = {
  gotoNavStackItem: ({ commit, dispatch, rootState }, index) => {
    const item = rootState.navbar.navStack[index]
    if (!item || !item.greedPath) return
    //
    const UID_TO_ACTION = {
      '2bad1413-a373-4926-8a3c-58677a680714': [
        TASK.TASKS_REQUEST,
        TASK.OVERDUE_TASKS_REQUEST,
        TASK.UNSORTED_TASKS_REQUEST
      ],
      '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
      '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
      '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
      '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
      'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
      '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
      '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
      '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
      '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
      '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST,
      'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
      'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
      '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
      '511d871c-c5e9-43f0-8b4c-e8c447e1a823':
        TASK.DELEGATED_TO_USER_TASKS_REQUEST,
      'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0':
        TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
      '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
      '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST // shared
    }
    const storeNavigator = rootState.navigator.navigator
    //
    commit('removeAllFromStackAfterIndex', index)

    commit('basic', { key: 'greedPath', value: item.greedPath })
    commit('basic', { key: 'mainSectionState', value: 'greed' })

    if (
      [
        'new_private_projects',
        'new_emps',
        'new_delegate',
        'new_private_boards'
      ].includes(item.greedPath)
    ) {
      commit('basic', {
        key: item.key,
        value: storeNavigator[item.greedPath]
      })
    } else if (
      ['tags_children', 'projects_children', 'boards_children'].includes(
        item.greedPath
      )
    ) {
      if (item.greedPath === 'tags_children') {
        dispatch(UID_TO_ACTION[item.global_property_uid], item.uid)
          .then(() => {
            commit('basic', {
              key: 'taskListSource',
              value: { uid: item.global_property_uid, param: item.uid }
            })
          })
        visitChildren(storeNavigator.tags.items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
      }
      if (item.greedPath === 'projects_children') {
        // Request project's tasks
        dispatch(UID_TO_ACTION[item.global_property_uid], item.uid)
        commit('basic', {
          key: 'taskListSource',
          value: { uid: item.global_property_uid, param: item.uid }
        })
        visitChildren(storeNavigator.new_private_projects[0].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
        visitChildren(storeNavigator.new_private_projects[1].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
      }
      if (item.greedPath === 'other') {
        const navElem = {
          name: item.label,
          key: 'greedSource',
          value: { uid: item.uid, param: null },
          greedPath: 'other'
        }
        commit('updateStackWithInitValue', navElem)
        commit('basic', { key: 'mainSectionState', value: 'greed' })
        commit('basic', { key: 'greedPath', value: 'other' })
        return
      }
      if (item.greedPath === 'boards_children') {
        // Request boards's cards
        dispatch(UID_TO_ACTION[item.global_property_uid], item.uid)
        commit('basic', {
          key: 'cardSource',
          value: { uid: item.global_property_uid, param: item.uid }
        })
        visitChildren(storeNavigator.new_private_boards[0].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
        visitChildren(storeNavigator.new_private_boards[1].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
      }
    } else {
      if (item.greedPath !== 'other') {
        commit('basic', {
          key: item.key,
          value: storeNavigator[item.greedPath].items
        })
      }
    }
  },
  popNavStack: ({ commit, dispatch, rootState }) => {
    const navStack = rootState.navbar.navStack
    if (navStack.length > 1) {
      const index = navStack.length - 2
      dispatch('gotoNavStackItem', index)
    }
  }
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
    state.navStack.splice(index + 1, state.navStack.length - 1 - index)
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
