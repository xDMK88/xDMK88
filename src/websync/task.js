import store from '@/store/index.js'
import { computed } from 'vue'

const navStack = computed(() => store.state.navbar.navStack)
const employees = computed(() => store.state.employees.employees)
const user = computed(() => store.state.user.user)

export function createTask (obj) {
  const lastNavStackElement = navStack.value[navStack.value.length - 1]

  // Adding new task by date request
  if (
    obj.obj.customer_date_begin &&
    obj.obj.customer_date_begin !== '0001-01-01T00:00:00' &&
    obj.obj.email_performer === user.value.current_user_email
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b' &&
      new Date(lastNavStackElement.value.param).toLocaleString().split(',')[0] === new Date(obj.obj.customer_date_begin).toLocaleString().split(',')[0]
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by assigned to property
  if (
    obj.obj.email_performer &&
    obj.obj.email_performer !== user.value.current_user_email &&
    obj.obj.uid_customer === user.value.current_user_uid
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '169d728b-b88b-462d-bd8e-3ac76806605b' &&
      lastNavStackElement.value.param === obj.obj.email_performer
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by assigned by property
  if (
    obj.obj.email_performer &&
    obj.obj.email_performer === user.value.current_user_email &&
    obj.obj.uid_customer !== user.value.current_user_uid
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '511d871c-c5e9-43f0-8b4c-e8c447e1a823' &&
      lastNavStackElement.value.param === employees.value[obj.obj.uid_customer]?.email
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by private project
  if (
    obj.obj.uid_project &&
    obj.obj.uid_project !== '00000000-0000-0000-0000-000000000000'
  ) {
    if (
      lastNavStackElement.key === 'greedSource' &&
      lastNavStackElement.global_property_uid === '7af232ff-0e29-4c27-a33b-866b5fd6eade' &&
      lastNavStackElement.uid === obj.obj.uid_project
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by shared project
  if (
    obj.obj.uid_project &&
    obj.obj.uid_project !== '00000000-0000-0000-0000-000000000000'
  ) {
    if (
      lastNavStackElement.key === 'greedSource' &&
      lastNavStackElement.global_property_uid === '431a3531-a77a-45c1-8035-f0bf75c32641' &&
      lastNavStackElement.uid === obj.obj.uid_project
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by overdue flag
  if (
    obj.obj.email_performer &&
    obj.obj.email_performer === user.value.current_user_email &&
    new Date(obj.obj.customer_date_end) < new Date() // is_overdue is false by default TODO: say to alex to fix this in websync
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '46418722-a720-4c9e-b255-16db4e590c34'
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by unread flag
  if (obj.obj.readed === 0) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === 'fa042915-a3d2-469c-bd5a-708cf0339b89'
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by unread flag
  if (obj.obj.readed === 0) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === 'fa042915-a3d2-469c-bd5a-708cf0339b89'
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by access
  if (obj.obj.emails) {
    for (const email in obj.obj.emails.split('..')) {
      if (
        email === user.value.current_user_email &&
        lastNavStackElement.key === 'taskListSource' &&
        lastNavStackElement.value.uid === 'fa042915-a3d2-469c-bd5a-708cf0339b89'
      ) {
        store.commit('ADD_TASK', obj.obj)
        return 0
      }
    }
  }
  // Adding new task by focus flag
  if (obj.obj.focus === 1) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '6fc44cc6-9d45-4052-917e-25b1189ab141'
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Adding new task by tag
  if (obj.obj.tags.length) {
    for (const tag in obj.obj.tags) {
      if (
        tag === lastNavStackElement.value.param &&
        lastNavStackElement.key === 'taskListSource' &&
        lastNavStackElement.value.uid === '00a5b3de-9474-404d-b3ba-83f488ac6d30'
      ) {
        store.commit('ADD_TASK', obj.obj)
        return 0
      }
    }
  }
  // Adding new task by color
  if (
    obj.obj.uid_marker &&
    obj.obj.uid_marker !== '00000000-0000-0000-0000-000000000000'
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === 'ed8039ae-f3de-4369-8f32-829d401056e9' &&
      lastNavStackElement.value.param === obj.obj.uid_marker
    ) {
      store.commit('ADD_TASK', obj.obj)
      return 0
    }
  }
  // Add to unsorted list
  if (
    lastNavStackElement.key === 'taskListSource' &&
    lastNavStackElement.value.uid === '5183b619-3968-4c3a-8d87-3190cfaab014'
  ) {
    store.commit('ADD_TASK', obj.obj)
    return 0
  }
}

export function removeTask (uid) {
  store.commit('REMOVE_TASK', uid)
}

export function updateTask (obj) {
  store.commit('UPDATE_TASK', obj.obj)
}
