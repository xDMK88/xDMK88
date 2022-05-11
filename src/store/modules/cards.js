import axios from 'axios'
import { notify } from 'notiwind'
import * as CARD from '../actions/cards'

const state = {
  cards: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {}

const actions = {
  [CARD.BOARD_CARDS_REQUEST]: ({ commit, rootState }, boardUid) => {
    return new Promise((resolve, reject) => {
      commit(CARD.BOARD_CARDS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/cards/byboard?uid=' + boardUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          console.log('REQUESTING CARDS, THIS IS RESPONSE: ', resp)
          resp.boardUid = boardUid
          resp.rootState = rootState
          commit(CARD.BOARD_CARDS_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: CARD.BOARD_CARDS_REQUEST,
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
  [CARD.BOARD_CARDS_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CARD.BOARD_CARDS_SUCCESS]: (state, resp) => {
    const board = resp.rootState.boards.boards[resp.boardUid]
    const stages = board.stages
    for (const stage of stages) {
      stage.tasks = []
      for (const card of resp.data.cards) {
        if (stage.UID === card.uid_stage) {
          stage.tasks.push(card)
        }
      }
    }
    console.log('cards requested from board ', board)
    state.status = 'success'
    state.cards = stages
    state.hasLoadedOnce = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
