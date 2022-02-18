<script setup>
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'

defineProps({
  assignments: {
    type: Array,
    default: () => []
  }
})

const store = useStore()

// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST
}

const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.uid]) {
    store.dispatch(UID_TO_ACTION[value.uid])
  } else if (UID_TO_ACTION[value.parentID]) {
    if (value.email) {
      if (UID_TO_ACTION[value.parentID] === TASK.EMPLOYEE_TASKS_REQUEST) {
        store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
        console.log('is employee request')
      } else {
        store.dispatch(UID_TO_ACTION[value.parentID], value.email)
        console.log('isnt employee request')
      }
    } else {
      store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
    }
  } else if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabel', value.name)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

</script>

<template class="w-full">
  <div v-for="(value, index) in assignments" :key="index">
    <p class="text-2xl text-gray-800 font-bold dark:text-gray-100" :class="index != 0 ? 'mt-5' : '0'">{{ value.dep }}</p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 truncate mt-5">
      <template v-for="(employee, pindex) in value.items" :key="pindex">
        <div
          class="flex items-start bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg cursor-pointer h-30 p-3"
        >
          <img v-if="employee.fotolink" :src="employee.fotolink" class="rounded-lg mx-2 my-auto" width="32" height="32">
          <div class="w-full">
            <div class="flex items-start justify-left">
              <p
                class="font-light cursor-pointer"
                @click="clickOnGridCard(employee)"
              >
                {{ employee.name }}
              </p>
            </div>
            <p class="font-light text-xs">{{ employee.email }}</p>
           </div>
        </div>
      </template>
    </div>
  </div>
</template>
