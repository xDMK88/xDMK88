<script setup>
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'
import properties from '@/icons/properties.js'
defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})
const store = useStore()
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST
}
const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.parentID]) {
    store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabel', value.name)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
</script>

<template class="w-full">
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <template v-for="(color, pindex) in colors" :key="pindex">
      <div
        class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md cursor-pointer h-30 px-3 py-5"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <div
              class="flex items-start"
            >
              <div
                class="rounded-xl mr-2 mt-0.5"
                style="min-width: 38px; min-height: 38px;"
                :style="{ backgroundColor: color.back_color }"
              >
              </div>
              <p
                class="font-normal cursor-pointer self-center"
                @click="clickOnGridCard(color)"
              >
                {{ color.name }}
              </p>
            </div>
            <icon
              :path="properties.path"
              :width="properties.width"
              :height="properties.height"
              :box="properties.viewBox"
              class="text-gray-400 cursor-pointer hover:text-gray-800"
            />
          </div>
        </div>
      </div>
    </template>
    <div
      class="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 py-7"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dark:text-gray-100">
         <path d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857" stroke="#3E3D3B" stroke-width="3" stroke-linecap="round"/>
       </svg>
      </div>
    </div>
  </div>
</template>
