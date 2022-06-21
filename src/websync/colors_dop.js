import store from '@/store/index.js'

export function selectColor (obj) {
  store.commit('PUSH_COLOR', [obj.obj])
  //  store.commit('PUSH_COLOR', [obj.obj])
  store.commit('NAVIGATOR_PUSH_COLOR', [obj.obj])
}

export function createColor (obj) {
  store.commit('NAVIGATOR_PUSH_COLOR', [obj.obj])
}

export function removeColor (obj) {
  store.commit('NAVIGATOR_REMOVE_COLOR', { uid_parent: '', uid: obj.uid })
}

export function updateColor (obj) {
  store.commit('UPDATE_COLOR_REQUEST', obj.obj)
}
