import store from '@/store/index.js'
import { CHANGE_CARD, DELETE_CARD } from '@/store/actions/cards'

export function createCard (obj) {
  store.commit(CHANGE_CARD, obj.obj)
}

export function removeCard (uid) {
  store.commit(DELETE_CARD, uid)
}

export function updateCard (obj) {
  store.commit(CHANGE_CARD, obj.obj)
}
