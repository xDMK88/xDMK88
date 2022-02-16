<script setup>
import Icon from '@/components/Icon.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { mdiCog, mdiArrowDownRight } from '@mdi/js'

import * as TASK from '@/store/actions/tasks'

const store = useStore()
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)

defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST // shared
}

const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabel', value.name)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

const goToChildren = (value) => {
  if (value.children && value.children.length) {
    store.commit('basic', { key: 'greedSource', value: value.children })
    store.commit('basic', { key: 'greedPath', value: 'projects_children' })
  }
}

</script>

<template class="w-full">
  <div v-for="(value, index) in projects" :key="index">
    <p class="text-3xl text-gray-800 font-extrabold second dark:text-gray-100" :class="index != 0 ? 'mt-5' : ''">{{ value.dep }}</p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 truncate mt-5">
      <template v-for="(project, pindex) in value.items" :key="pindex">
        <div>
          <div class="h-2 rounded-t-xl" :style="{ backgroundColor: project.color }"></div>
          <div
            class="flex items-start bg-white dark:bg-gray-700 rounded-b-xl shadow-md hover:shadow-lg p-3"
          >
            <div>
              <div class="flex items-start justify-between">
                <p
                  class="font-light cursor-pointer"
                  @click="clickOnGridCard(project)"
                >
                  {{ project.name }}
                </p>
                <icon
                  :path="mdiCog"
                  size="18"
                  class="text-gray-400 cursor-pointer hover:text-gray-800"
                />
              </div>
              <div class="flex items-center" v-if="project.children && project.children.length">
                <p
                  class="font-light text-xs"
                >
                  Дочерних: {{ project.children.length }}
                </p>
                <icon
                  :path="mdiArrowDownRight"
                  size="18"
                  class="text-gray-800 cursor-pointer"
                  @click="goToChildren(project)"
                />
              </div>
                <div v-if="project.members && project.members.length" class="grid grid-cols-9 gap-1 rounded-xl mt-2">
                  <div v-for="(employee, index) in project.members.slice(0, 9)" :key="index">
                    <div v-if="employeesByEmail[employee]">
                      <img :src="employeesByEmail[employee].fotolink" class="rounded" width="28" height="28">
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
