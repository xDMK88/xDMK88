import store from '@/store/index.js'

export default function selectFiles (obj) {
  store.commit('FILES_REQUEST', obj.obj)
}
