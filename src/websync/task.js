import store from '@/store/index.js'
import { computed } from 'vue'
import { shouldAddTaskIntoList } from './utils'

const navStack = computed(() => store.state.navbar.navStack)

export function createTask (obj) {
  const lastNavStackElement = navStack.value[navStack.value.length - 1]
  console.log('last nav stack element in adding new task from websync: ', lastNavStackElement)

  if (shouldAddTaskIntoList(obj.obj, lastNavStackElement)) {
    store.commit('ADD_TASK', obj.obj)
  }
}

export function removeTask (uid) {
  store.commit('REMOVE_TASK', uid)
}

export function updateTask (obj) {
  store.commit('UPDATE_TASK', obj.obj)
}
