<script setup>
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import projectIcon from '@/icons/project.js'
import sharedProject from '@/icons/shared_project.js'
import * as TASK from '@/store/actions/tasks'
import * as CARD from '@/store/actions/cards.js'
import { SELECT_PROJECT } from '@/store/actions/projects'
import { SELECT_BOARD } from '@/store/actions/boards.js'
import ProjectsListAddItem from '@/components/ProjectsList/ProjectsListAddItem.vue'
import ProjectsListGridViewSwitcher from '@/components/ProjectsList/ProjectsListGridViewSwitcher.vue'

const store = useStore()
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
  '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST, // shared
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST // shared
}

const isGridView = computed(() => store.state.isGridView)

const updateGridView = (value) => {
  store.commit('basic', { key: 'isGridView', value: value })
  localStorage.setItem('isGridView', value)
}

const isPropertiesMobileExpanded = computed(
  () => store.state.isPropertiesMobileExpanded
)
const user = computed(() => store.state.user.user)
const focusedUid = ref('')

const createProject = () => {
  focusedUid.value = ''
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  store.commit('basic', { key: 'propertiesState', value: 'project' })

  // create empty instanse of project
  const project = {
    uid_parent: '',
    color: '',
    comment: '',
    plugin: '',
    collapsed: 0,
    isclosed: 0,
    order: 0,
    group: 0,
    show: 0,
    favorite: 0,
    quiet: 0,
    email_creator: user.value.current_user_email,
    members: [user.value.current_user_email],
    children: [],
    uid: '',
    name: '',
    bold: 0
  }
  store.commit(SELECT_PROJECT, project)
}
const createBoard = () => {
  focusedUid.value = ''
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  store.commit('basic', { key: 'propertiesState', value: 'board' })

  // create empty instanse of board
  const board = {
    uid_parent: '00000000-0000-0000-0000-000000000000',
    color: '',
    comment: '',
    plugin: '',
    collapsed: 0,
    isclosed: 0,
    order: 0,
    group: 0,
    show: 0,
    favorite: 0,
    quiet: 0,
    email_creator: user.value.current_user_email,
    members: { [user.value.current_user_uid]: '1' },
    children: [],
    uid: null,
    name: '',
    bold: 0
  }
  store.commit(SELECT_BOARD, board)
}

const createItem = (type) => {
  switch (type) {
    case 'projects':
      createProject()
      break
    case 'boards':
      createBoard()
      break
    default:
      console.error(`createItem ${type} - неизвестный тип у плитки в проектах!`)
      break
  }
}

const openPropertiesProject = (project) => {
  focusedUid.value = project.uid
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  store.commit('basic', { key: 'propertiesState', value: 'project' })
  store.commit(SELECT_PROJECT, project)
}

const openPropertiesBoard = (board) => {
  focusedUid.value = board.uid
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  store.commit('basic', { key: 'propertiesState', value: 'board' })
  store.commit(SELECT_BOARD, board)
}

const openProperties = (type, value) => {
  switch (type) {
    case 'projects':
      openPropertiesProject(value)
      break
    case 'boards':
      openPropertiesBoard(value)
      break
    default:
      console.error(
        `openProperties ${type} - неизвестный тип у плитки в проектах!`
      )
      break
  }
}

const gotoChildrenProject = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    store.commit('basic', {
      key: 'taskListSource',
      value: { uid: value.global_property_uid, param: value.uid }
    })
  }
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)

  const navElem = {
    name: value.name,
    key: 'greedSource',
    uid: value.uid,
    global_property_uid: value.global_property_uid,
    greedPath: 'projects_children',
    value: value.children
  }

  store.commit('pushIntoNavStack', navElem)
  store.commit('basic', { key: 'greedSource', value: value.children })
  store.commit('basic', { key: 'greedPath', value: 'projects_children' })
}

const gotoChildrenBoard = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    store.commit('basic', {
      key: 'cardSource',
      value: { uid: value.global_property_uid, param: value.uid }
    })
  }
  // store.commit(CARD.CLEAN_UP_LOADED_CARDS)

  const navElem = {
    name: value.name,
    key: 'greedSource',
    uid: value.uid,
    global_property_uid: value.global_property_uid,
    greedPath: 'boards_children',
    value: value.children
  }

  store.commit('pushIntoNavStack', navElem)
  store.commit('basic', { key: 'greedSource', value: value.children })
  store.commit('basic', { key: 'greedPath', value: 'boards_children' })
}

const gotoChildren = (type, value) => {
  focusedUid.value = ''
  store.dispatch('asidePropertiesToggle', false)

  switch (type) {
    case 'projects':
      gotoChildrenProject(value)
      break
    case 'boards':
      gotoChildrenBoard(value)
      break
    default:
      console.error(
        `gotoChildren ${type} - неизвестный тип у плитки в проектах!`
      )
      break
  }
}

const isHaveMembers = (type, value) => {
  switch (type) {
    case 'projects':
      return value.members && value.members.length > 1
    case 'boards':
      return value.members && Object.keys(value.members).length > 1
    default:
      console.error(
        `isHaveMembers ${type} - неизвестный тип у плитки в проектах!`
      )
      return false
  }
}
</script>

<template class="w-full">
  <div
    v-for="(value, index) in items"
    :key="index"
  >
    <div
      class="flex items-center w-full"
      :class="{ 'justify-between': index == 0, 'mt-3': index != 0 }"
    >
      <!-- название раздела -->
      <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100">
        {{ value.dep }}
      </p>
      <!-- переключатель вида - список или плитки у первого раздела -->
      <ProjectsListGridViewSwitcher
        v-if="index == 0"
        :is-grid-view="isGridView"
        @setGridView="updateGridView"
      />
    </div>
    <div
      class="grid gap-4 mt-3"
      :class="{
        'md:grid-cols-2 lg:grid-cols-4': isGridView,
        'grid-cols-1': !isGridView,
        'grid-cols-1': isPropertiesMobileExpanded && !isGridView,
        'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
      }"
    >
      <template
        v-for="item in value.items"
        :key="item.uid"
      >
        <div
          class="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md px-5 relative min-h-[80px] cursor-pointer"
          :class="{ 'ring-4 ring-orange-300': focusedUid == item.uid }"
          @click.stop="gotoChildren(value.type, item)"
        >
          <div
            class="text-gray-400 cursor-pointer hover:text-gray-800 absolute top-8 right-4 h-[18px] w-[18px] text-center"
            @click.stop="openProperties(value.type, item)"
          >
            <Icon
              :path="properties.path"
              :width="properties.width"
              :height="properties.height"
              :box="properties.viewBox"
            />
          </div>
          <div
            v-if="item.color != '#A998B6'"
            :style="{ backgroundColor: item.color }"
            class="w-full h-4 absolute top-0 right-0 rounded-t-xl"
          />
          <div class="relative">
            <div
              v-if="item.children && item.children.length"
              class="min-w-[15px] min-h-[15px] absolute rounded-full bg-gray-500 -top-2 -left-2 flex items-center justify-center"
            >
              <span class="text-white text-xs">
                {{ item.children.length }}
              </span>
            </div>
            <div class="flex items-start">
              <Icon
                v-if="isHaveMembers(value.type, item)"
                :path="sharedProject.path"
                width="18"
                height="18"
                :box="sharedProject.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <Icon
                v-else
                :path="projectIcon.path"
                width="18"
                height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <p class="font-normal">
                {{
                  item.name.length > 60
                    ? item.name.substring(0, 60) + '...'
                    : item.name
                }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <!-- кнопка добавить проект -->
      <ProjectsListAddItem
        v-if="index == 0"
        @onClick="createItem(value.type)"
      />
      <!-- кнопка добавить доску -->
      <ProjectsListAddItem
        v-if="index == 2"
        @onClick="createItem(value.type)"
      />
    </div>
  </div>
</template>
