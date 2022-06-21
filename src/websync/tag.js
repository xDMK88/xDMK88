import store from '@/store/index.js'

export function selectTag (obj) {
  store.commit('SELECT_TAG', [obj.obj])
  //  store.commit('PUSH_COLOR', [obj.obj])
}

export function createTag (obj) {
  store.commit('NAVIGATOR_PUSH_TAG', [obj.obj])
}

export function removeTag (obj) {
  store.commit('NAVIGATOR_REMOVE_TAG', { uid_parent: '', uid: obj.uid })
}
export function removeParentTag (obj) {
  store.commit('NAVIGATOR_REMOVE_TAG', { uid: obj.uid })
}
