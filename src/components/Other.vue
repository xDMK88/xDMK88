<script setup>
import * as TASK from '@/store/actions/tasks.js'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import overdue from '@/icons/overdue.js'
import unread from '@/icons/unread.js'
import inwork from '@/icons/inprogress.js'
import open from '@/icons/inaccess.js'
import focus from '@/icons/focus.js'
import unsorted from '@/icons/unsorted.js'
import ready from '@/icons/ready.js'

const store = useStore()
const categories = {
  overdue: {
    name: 'Просроченные',
    icon: overdue,
    link: '46418722-a720-4c9e-b255-16db4e590c34'
  },
  unread: {
    name: 'Непрочитанные',
    icon: unread,
    link: 'fa042915-a3d2-469c-bd5a-708cf0339b89'
  },
  inwork: {
    name: 'В работе',
    icon: inwork,
    link: '2a5cae4b-e877-4339-8ca1-bd61426864ec'
  },
  unsorted: {
    name: 'Неразобранные',
    icon: unsorted,
    link: '5183b619-3968-4c3a-8d87-3190cfaab014'
  },
  ready: {
    name: 'Готово к сдаче',
    icon: ready,
    link: 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0'
  },
  open: {
    name: 'Задачи с доступом',
    icon: open,
    link: '017a3e8c-79ac-452c-abb7-6652deecbd1c'
  },
  inFocus: {
    name: 'Задачи в фокусе',
    icon: focus,
    link: '6fc44cc6-9d45-4052-917e-25b1189ab141'
  }
}

// link actions
const UID_TO_ACTION = {
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

function redirect (category) {
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
  store.dispatch(UID_TO_ACTION[category.link])
  const navElem = {
    name: category.name,
    key: 'taskListSource',
    value: { uid: category.link, param: null }
  }
  store.commit('updateStackWithInitValue', navElem)
  store.commit('basic', { key: 'taskListSource', value: { uid: category.link, param: null } })
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
}
</script>
<template>
<div class="flex">
  <div class="flex flex-col w-full">
      <div
        class="flex w-full bg-white mb-5 text-lg rounded-lg p-5 items-center cursor-pointer"
        v-for="category in categories"
        :key="category"
        @click="redirect(category)"
       >
        <Icon
          :height="category.icon.height"
          :width="category.icon.width"
          :path="category.icon.path"
          :viewBox="category.icon.viewBox"
          class="text-gray-500"
        />
        <span class="ml-2">{{ category.name }}</span>
      </div>
  </div>
</div>
</template>
