<script setup>
import { computed, ref, watch } from 'vue'
import { visitChildren } from '@/store/helpers/functions'
import { useStore } from 'vuex'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiMenu
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import Popper from 'vue3-popper'
import NavRightButtons from '@/components/Navbar/Navrightbuttons.vue'
import propertiesproject from '@/icons/propertiesproject.js'
import add from '@/icons/add.js'
import arrowForward from '@/icons/arrow-forward.js'
import arrowDown from '@/icons/arrow-down.js'

import * as TASK from '@/store/actions/tasks'
import * as CARD from '@/store/actions/cards'
import { SELECT_PROJECT } from '@/store/actions/projects'

const UID_TO_ACTION = {
  '2bad1413-a373-4926-8a3c-58677a680714': [
    TASK.TASKS_REQUEST,
    TASK.OVERDUE_TASKS_REQUEST,
    TASK.UNSORTED_TASKS_REQUEST
  ],
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
  '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
  '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST // shared
}

const showNoneUid = [
  '46418722-a720-4c9e-b255-16db4e590c34',
  '017a3e8c-79ac-452c-abb7-6652deecbd1c',
  'fa042915-a3d2-469c-bd5a-708cf0339b89',
  '2a5cae4b-e877-4339-8ca1-bd61426864ec',
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0'
]

const store = useStore()

defineProps({
  item: {
    type: Object,
    required: true
  },
  menu: {
    type: Array,
    default: () => []
  }
})

const closeProperties = () => {
  store.dispatch('asidePropertiesToggle', false)
}

const isTaskHoverPopperActive = ref(false)
// const isTaskStatusPopperActive = ref(false)
const toggleTaskHoverPopper = (val) => {
  isTaskHoverPopperActive.value = val
}

const isNavBarVisible = computed(() => !store.state.isFullScreen)

const user = computed(() => store.state.user.user)
const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)

const navStack = computed(() => store.state.navbar.navStack)
const projects = computed(() => store.state.projects.projects)
const storeNavigator = computed(() => store.state.navigator.navigator)

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)
const menuToggleMobile = () => {
  store.dispatch('asideMobileToggle')
}

const menuOpenLg = () => {
  store.dispatch('asideLgToggle', true)
}

// Copypasted from Home.vue
// TODO: DRY

const clickOnGridCard = (item, index) => {
  if (!item || !item.greedPath) {
    return
  }
  store.commit('removeAllFromStackAfterIndex', index)

  store.commit('basic', { key: 'greedPath', value: item.greedPath })
  store.commit('basic', { key: 'mainSectionState', value: 'greed' })

  if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(item.greedPath)) {
    store.commit('basic', { key: item.key, value: storeNavigator.value[item.greedPath] })
  } else if (['tags_children', 'projects_children', 'boards_children'].includes(item.greedPath)) {
    if (item.greedPath === 'tags_children') {
      visitChildren(storeNavigator.value.tags.items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
    }
    if (item.greedPath === 'projects_children') {
      // Request project's tasks
      store.dispatch(UID_TO_ACTION[item.global_property_uid], item.uid)
      store.commit('basic', { key: 'taskListSource', value: { uid: item.global_property_uid, param: item.uid } })
      visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
      visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
    }
    if (item.greedPath === 'other') {
      const navElem = {
        name: item.label,
        key: 'greedSource',
        value: { uid: item.uid, param: null },
        greedPath: 'other'
      }
      store.commit('updateStackWithInitValue', navElem)
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: 'other' })
      return
    }
    if (item.greedPath === 'boards_children') {
      // Request boards's cards
      store.dispatch(UID_TO_ACTION[item.global_property_uid], item.uid)
      store.commit('basic', { key: 'cardSource', value: { uid: item.global_property_uid, param: item.uid } })
      visitChildren(storeNavigator.value.new_private_boards[0].items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
      visitChildren(storeNavigator.value.new_private_boards[1].items, value => {
        if (value.uid === item.uid) {
          store.commit('basic', { key: item.key, value: value.children })
        }
      })
    }
  } else {
    if (item.greedPath !== 'other') {
      store.commit('basic', { key: item.key, value: storeNavigator.value[item.greedPath].items })
    }
  }
}

const openProjectProperties = (project, parentProjectUid = '') => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  store.commit('basic', { key: 'propertiesState', value: 'project' })

  // create empty instanse of project
  if (!project || parentProjectUid) {
    project = {
      uid_parent: parentProjectUid,
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
  } else {
    project = projects.value[project]
  }
  store.commit(SELECT_PROJECT, project)
}

watch(navStack, (oldVal, newVal) => {
  if (document.getElementById('control-input')) {
    document.getElementById('control-input').value = ''
  }
})
</script>

<template>
  <pre
    v-if="navStack.length && showNoneUid.includes(navStack[navStack.length - 1].uid)"
    class="md:text-lg sm:text-base"
  >
    У вас пока нет задач этой категории!
  </pre>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 pt-2 right-0 fixed flex h-14 z-[10] bg-[#f4f5f7] font-['Roboto']
    transition-position xl:ml-72 w-auto lg:items-center dark:bg-gray-800 dark:border-gray-800"
    :class="{ 'ml-80':isAsideMobileExpanded, 'mr-96':isPropertiesMobileExpanded }"
  >
    <div class="flex-1 items-stretch flex h-14 py-2 pl-3">
      <nav-bar-item
        type="flex lg:hidden"
        @click.prevent="menuToggleMobile"
      >
        <icon
          :path="menuToggleMobileIcon"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        @click.prevent="menuOpenLg"
      >
        <icon
          :path="mdiMenu"
          size="24"
        />
      </nav-bar-item>
    </div>
    <div class="nav-scroll">
      <nav-bar-item
        v-for="(navItem, index) in navStack"
        :key="index"
        class="px-1 group"
      >
        <span
          v-if="navItem && navItem.name"
          class="font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] breadcrumbs"
          :class="index === 0 ? 'text-[#7E7E80] font-medium' : index+1 === navStack.length ? 'text-[#4C4C4D] font-medium' : 'text-[#7E7E80] font-medium'"
          @click.stop="clickOnGridCard(navItem, index), closeProperties()"
        >
          {{ navItem.name.length > 15 ? navItem.name.slice(0, 15) + '...' : (((new Date(navItem.value.param).getDate() + new Date(navItem.value.param).getMonth() + new Date(navItem.value.param).getMonth()) === (new Date().getDate() + new Date().getMonth() + new Date().getMonth()) && navItem.value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') ? 'Сегодня' : navItem.name) }}
          <Popper
            class="items-center"
            :class="isDark ? 'dark' : 'light'"
            placement="bottom"
            @click.stop="toggleTaskHoverPopper(true)"
            @open:popper="toggleTaskHoverPopper(true)"
            @close:popper="toggleTaskHoverPopper(false)"
          >

            <template #content>
              <div class="flex flex-col w-60">
                <div
                  class="text-[13px] flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1 rounded-md"
                  @click="openProjectProperties(navItem.uid)"
                >
                  <icon
                    class="mr-3 text-gray-500 p-1"
                    :path="propertiesproject.path"
                    :width="16"
                    :height="10"
                    :box="propertiesproject.viewBox"
                  />
                  Открыть свойства проекта
                </div>
                <div
                  v-if="projects[navItem.uid] && projects[navItem.uid].email_creator === user.current_user_email"
                  class="font-medium flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1 mr-1 rounded-md"
                  @click="openProjectProperties(false, navItem.uid)"
                >

                  <icon
                    class="mr-2 text-gray-500 p-2"
                    :path="add.path"
                    :width="14"
                    :height="13"
                    :box="add.viewBox"
                  />
                  Добавить подпроект
                </div>
              </div>
            </template>
            <icon
              v-if="navItem.greedPath === 'projects_children' && index === (navStack.length - 1)"
              class="invisible ml-0.5 text-gray-500 group-hover:visible"
              :path="arrowDown.path"
              :width="10"
              :height="10"
              :box="arrowDown.viewBox"
            />
          </Popper>
        </span>
        <div>
          <icon
            v-if="index !== navStack.length - 1"
            class="ml-2.5 mr-0.5 text-gray-500"
            :path="arrowForward.path"
            :width="6"
            :height="12"
            :box="arrowForward.viewBox"
          />
        </div>
      </nav-bar-item>
    </div>
    <div>
      <NavRightButtons></NavRightButtons>
    </div>
  </nav>
</template>
