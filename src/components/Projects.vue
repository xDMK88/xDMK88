<script setup>
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import projectIcon from '@/icons/project.js'
import sharedProject from '@/icons/shared_project.js'
import subArrow from '@/icons/arrow-sub.js'

import * as TASK from '@/store/actions/tasks'

const store = useStore()

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
    <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100">{{ value.dep }}</p>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 truncate mt-3">
      <template v-for="(project, pindex) in value.items" :key="pindex">
        <div
          class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow px-5 py-7"
        >
          <div>
            <div class="flex items-center w-96">
              <icon
                :path="properties.path"
                :width="properties.width"
                :height="properties.height"
                :box="properties.viewBox"
                size="18"
                class="text-gray-400 cursor-pointer hover:text-gray-800 mr-2"
              />
              <icon
                v-if="project.members && project.members.length == 1"
                :path="projectIcon.path"
                :width="18"
                :height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2"
              />
              <icon
                v-if="project.members && project.members.length > 1"
                :path="sharedProject.path"
                :width="18"
                :height="18"
                :box="sharedProject.viewBox"
                class="text-gray-500 mr-2"
              />
              <p
                class="font-light cursor-pointer break-words overflow-hidden"
                @click="clickOnGridCard(project)"
              >
                {{ project.name }}
              </p>
            </div>
            <div class="flex items-center" v-if="project.children && project.children.length">
              <icon
                :path="subArrow.path"
                :box="subArrow.viewBox"
                :width="subArrow.width"
                :height="subArrow.height"
                class="text-gray-500 cursor-pointer mr-1"
                @click="goToChildren(project)"
              />
              <p
                class="font-light text-xs text-violet-500 cursor-pointer"
                @click="goToChildren(project)"
              >
                Подпроектов: {{ project.children.length }}
              </p>
            </div>
            </div>
        </div>
      </template>
    </div>
  </div>
</template>
