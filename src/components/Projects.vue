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
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 truncate mt-3">
      <template v-for="(project, pindex) in value.items" :key="pindex">
        <div
          class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow px-5 py-7 relative"
        >
          <div
            v-if="project.color != '#A998B6'"
            :style="{ backgroundColor: project.color }"
            style="border-radius: 100% 0 0.75rem 0;"
            class="w-6 h-6 absolute bottom-0 right-0 rounded-tl-full rounded-br-xl"
          >
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute top-3 right-3 cursor-pointer">
            <path d="M8.58377 3.45475C8.69791 3.17266 8.89368 2.93108 9.146 2.76098C9.39832 2.59088 9.6957 2.5 10 2.5C10.3043 2.5 10.6017 2.59088 10.854 2.76098C11.1063 2.93108 11.3021 3.17266 11.4162 3.45475C12.5458 3.76541 13.5422 4.43829 14.2523 5.37004C14.9625 6.3018 15.3471 7.44092 15.3471 8.61244V12.2004L16.7466 14.2995C16.8233 14.4145 16.8674 14.5483 16.8741 14.6864C16.8808 14.8245 16.8499 14.9619 16.7847 15.0838C16.7194 15.2058 16.6223 15.3077 16.5036 15.3788C16.385 15.4498 16.2493
            15.4873 16.111 15.4873H12.6468C12.5549 16.1237 12.2367 16.7057 11.7506 17.1266C11.2645 17.5475 10.643 17.7791 10 17.7791C9.357 17.7791 8.73553 17.5475 8.24942 17.1266C7.76332 16.7057 7.44514 16.1237 7.35317 15.4873H3.88899C3.7507 15.4873 3.61499 15.4498 3.49635 15.3788C3.37771 15.3077 3.28059 15.2058 3.21535 15.0838C3.15011 14.9619 3.11919 14.8245 3.1259 14.6864C3.13261 14.5483 3.17669 14.4145 3.25345 14.2995L4.65287 12.2004V8.61244C4.65287 6.14971 6.31812 4.07502 8.58377
            3.45475ZM8.91988 15.4873C8.99877 15.7109 9.14506 15.9045 9.33858 16.0414C9.5321 16.1783 9.76332 16.2518 10.0004 16.2518C10.2374 16.2518 10.4687 16.1783 10.6622 16.0414C10.8557 15.9045 11.002 15.7109 11.0809 15.4873H8.91912H8.91988ZM10 4.79306C8.98704 4.79306 8.01556 5.19546 7.29929 5.91173C6.58302 6.62801 6.18062 7.59948 6.18062 8.61244V12.4318C6.18065 12.5827 6.136 12.7302 6.05229 12.8558L5.31668 13.9596H14.6826L13.9469 12.8558C13.8635 12.7301 13.8191 12.5826 13.8194
            12.4318V8.61244C13.8194 7.59948 13.417 6.62801 12.7007 5.91173C11.9844 5.19546 11.013 4.79306 10 4.79306Z" fill="#06060E" fill-opacity="0.5"/>
            <circle cx="14.0625" cy="5.9375" r="3.1875" fill="#FB381E" stroke="white" stroke-width="2"/>
          </svg>
          <div>
            <div class="flex items-center w-96">
              <icon
                :path="properties.path"
                :width="properties.width"
                :height="properties.height"
                :box="properties.viewBox"
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
                class="font-normal cursor-pointer break-words overflow-hidden"
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
      <div
        class="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer"
      >
        <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl">
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dark:text-gray-100">
           <path d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857" stroke="#3E3D3B" stroke-width="3" stroke-linecap="round"/>
         </svg>
        </div>
      </div>
    </div>
  </div>
</template>
