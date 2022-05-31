import * as CARD_FILES_AND_MESSAGES from '../actions/cardfilesandmessages'
import axios from 'axios'

const state = {
  messages: [],
  files: [],
  status: 'loading'
}

const getters = {}

const actions = {
  [CARD_FILES_AND_MESSAGES.MESSAGES_REQUEST]: ({ commit, dispatch }, cardUid) => {
    return new Promise((resolve, reject) => {
      commit(CARD_FILES_AND_MESSAGES.MESSAGES_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/cardsmsgs/bycard?uid=' + cardUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(CARD_FILES_AND_MESSAGES.MESSAGES_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [CARD_FILES_AND_MESSAGES.FILES_REQUEST]: ({ commit, dispatch }, cardUid) => {
    return new Promise((resolve, reject) => {
      commit(CARD_FILES_AND_MESSAGES.FILES_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/cardsfiles/bycard?uid=' + cardUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(CARD_FILES_AND_MESSAGES.FILES_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [CARD_FILES_AND_MESSAGES.FETCH_FILES_AND_MESSAGES]: ({ commit, dispatch }, cardUid) => {
    commit(CARD_FILES_AND_MESSAGES.MESSAGES_REQUEST)

    const messages = dispatch(CARD_FILES_AND_MESSAGES.MESSAGES_REQUEST, cardUid)
    const files = dispatch(CARD_FILES_AND_MESSAGES.FILES_REQUEST, cardUid)

    return Promise.all([messages, files])
      .then(() => {
        commit(CARD_FILES_AND_MESSAGES.MERGE_FILES_WITH_MESSAGES)
      })
  }
}

const mutations = {
  [CARD_FILES_AND_MESSAGES.MESSAGES_REQUEST]: state => {
    state.status = 'loading'
  },
  [CARD_FILES_AND_MESSAGES.FILES_REQUEST]: state => {
    state.status = 'loading'
  },
  [CARD_FILES_AND_MESSAGES.MESSAGES_SUCCESS]: (state, resp) => {
    state.messages = resp.data
    state.status = 'success'
  },
  [CARD_FILES_AND_MESSAGES.FILES_SUCCESS]: (state, resp) => {
    state.messages = resp.data
    state.status = 'success'
  },
  [CARD_FILES_AND_MESSAGES.REFRESH_FILES]: (state, resp) => {
    state.files = []
  },
  [CARD_FILES_AND_MESSAGES.REFRESH_MESSAGES]: (state, resp) => {
    state.messages = []
  },
  [CARD_FILES_AND_MESSAGES.MERGE_FILES_AND_MESSAGES]: (state, resp) => {
    state.files.forEach(item => {
      item.msg = item.file_name
    })

    state.messages = state.messages.concat(state.files)
    state.messages.sort((a, b) => {
      return new Date(a.date_create) - new Date(b.date_create)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
