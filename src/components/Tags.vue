<script setup>
import Icon from '@/components/Icon.vue'
import { mdiCog, mdiArrowDownRight } from '@mdi/js'
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'

const store = useStore()

const goToChildren = (value) => {
  if (value.children && value.children.length) {
    store.commit('basic', { key: 'greedSource', value: value.children })
  }
}

const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
}

const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabel', value.name)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

</script>

<template class="w-full">
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 truncate">
    <template v-for="(tag, pindex) in tags" :key="pindex">
      <div
        class="flex items-start bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg cursor-pointer h-30 p-3"
        :style="{ backgroundColor: tag.back_color }"
      >
        <div class="w-full">
          <div class="flex items-start justify-between">
            <p
              class="font-light cursor-pointer"
              @click="clickOnGridCard(tag)"
            >
              {{ tag.name }}
            </p>
            <icon
              :path="mdiCog"
              size="18"
              class="text-gray-400 cursor-pointer hover:text-gray-800"
            />
          </div>
          <div class="flex items-center" v-if="tag.children && tag.children.length">
            <p
              class="font-light text-xs"
            >
              Дочерних: {{ tag.children.length }}
            </p>
            <icon
              :path="mdiArrowDownRight"
              size="18"
              class="text-gray-800 cursor-pointer"
              @click="goToChildren(tag)"
            />
          </div>
         </div>
      </div>
    </template>
  </div>
</template>
