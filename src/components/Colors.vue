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
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 truncate">
    <template v-for="(color, pindex) in colors" :key="pindex">
      <div
        class="flex items-start bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg cursor-pointer h-30 px-3 py-5"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <div
              class="flex items-center"
            >
              <div
                class="rounded-xl mr-2"
                style="width: 38px; height: 38px;"
                :style="{ backgroundColor: color.back_color }"
              >
              </div>
              <p
                class="font-normal cursor-pointer"
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
      class=""
    >
    </div>
  </div>
</template>
