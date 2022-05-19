import axios from 'axios'
import { notify } from 'notiwind'
import * as CARD from '../actions/cards'

const state = {
  cards: [],
  boardUid: '',
  status: ''
}

const getters = {}

const actions = {
  [CARD.BOARD_CARDS_REQUEST]: ({ commit, rootState }, boardUid) => {
    return new Promise((resolve, reject) => {
      commit(CARD.BOARD_CARDS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/cards/byboard?uid=' +
        boardUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
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
  },
  [CARD.BOARD_CARDS_ADDSTAGE]: ({ commit, rootState }, newStage) => {
    const board = rootState.boards.boards[state.boardUid]
    const canChangeBoard = board.type_access === 1
    const canAddCardsToBoard =
      board.type_access === 1 || board.type_access === 2
    //
    const stage = { ...newStage }
    stage.cards = []
    stage.Unsorted = false
    stage.Archive = false
    stage.UserStage = true
    stage.AddCard = canAddCardsToBoard
    stage.CanEditStage = canChangeBoard
    commit('AddStage', stage)
  },
  [CARD.BOARD_CARDS_RENAME_STAGE]: ({ commit, rootState }, newStage) => {
    commit('RenameStage', { stageUid: newStage.UID, stageName: newStage.Name })
  }
}

const mutations = {
  [CARD.BOARD_CARDS_REQUEST]: (state) => {
    state.cards = []
    state.status = 'loading'
  },
  [CARD.BOARD_CARDS_SUCCESS]: (state, resp) => {
    const stageUnsorted = {
      UID: '00000000-0000-0000-0000-000000000000',
      Name: 'Неразобранное',
      Order: -1,
      Color: '',
      Unsorted: true,
      Archive: false,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }
    const stageSuccess = {
      UID: 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67', // успех захардкорено у Лехи
      Name: 'Успех',
      Order: Number.MAX_SAFE_INTEGER - 1,
      Color: '',
      Unsorted: false,
      Archive: true,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }
    const stageReject = {
      UID: 'e70af5e2-6108-4c02-9a7d-f4efee78d28c', // отказ захардкорено у Лехи
      Name: 'Отказ',
      Order: Number.MAX_SAFE_INTEGER,
      Color: '',
      Unsorted: false,
      Archive: true,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }

    // заполняем все стейджи
    const stages = []
    stages.push(stageUnsorted)

    const board = resp.rootState.boards.boards[resp.boardUid]
    // могу менять доску если она моя или я есть в админах
    const canChangeBoard = board.type_access === 1
    // могу добавлять карточки если могу менять доску или я есть в писателях
    const canAddCardsToBoard =
      board.type_access === 1 || board.type_access === 2
    //
    board.stages.forEach((stage) => {
      const stageCopy = { ...stage }
      stageCopy.cards = []
      stageCopy.Unsorted = false
      stageCopy.Archive = false
      stageCopy.UserStage = true
      stageCopy.AddCard = canAddCardsToBoard
      stageCopy.CanEditStage = canChangeBoard
      stages.push(stageCopy)
    })

    stages.push(stageSuccess)
    stages.push(stageReject)

    // наполняем карточками из ответа
    const stageMap = stages.reduce((acc, stage) => {
      acc[stage.UID] = stage
      return acc
    }, {})
    for (const card of resp.data.cards) {
      const stage = stageMap[card.uid_stage]
      if (stage) {
        stage.cards.push(card)
      } else {
        stageUnsorted.cards.push(card)
      }
    }

    // сортируем
    stages.sort((stage1, stage2) => {
      // сначала по порядку
      if (stage1.Order > stage2.Order) return 1
      if (stage1.Order < stage2.Order) return -1
      // если одинаковый, то по имени
      if (stage1.Name > stage2.Name) return 1
      if (stage1.Name < stage2.Name) return -1
      return 0
    })
    stages.forEach((stage) => {
      stage.cards.sort((card1, card2) => {
        // сначала по порядку
        if (card1.order > card2.order) return 1
        if (card1.order < card2.order) return -1
        // если одинаковый, то по имени
        if (card1.name > card2.name) return 1
        if (card1.name < card2.name) return -1
        return 0
      })
    })

    state.status = 'success'
    state.boardUid = resp.boardUid
    state.cards = stages
  },
  AddStage: (state, stage) => {
    state.cards.push(stage)
    state.cards.sort((stage1, stage2) => {
      // сначала по порядку
      if (stage1.Order > stage2.Order) return 1
      if (stage1.Order < stage2.Order) return -1
      // если одинаковый, то по имени
      if (stage1.Name > stage2.Name) return 1
      if (stage1.Name < stage2.Name) return -1
      return 0
    })
  },
  RenameStage: (state, { stageUid, stageName }) => {
    const stage = state.cards.find((stage) => stage.UID === stageUid)
    if (stage) stage.Name = stageName
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
