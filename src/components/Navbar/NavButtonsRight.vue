<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import Popper from 'vue3-popper'
import properties from '@/icons/properties.js'
import filters from '@/icons/filter.js'
import sort from '@/icons/sort.js'
import sortorder from '@/icons/sortorder.js'
import NavBarSearch from '@/components/NavBarSearch.vue'
import { PATCH_SETTINGS } from '@/store/actions/navigator'
import * as TASK from '@/store/actions/tasks'
import { visitChildren } from '@/store/helpers/functions'
import * as CARD from '@/store/actions/cards'

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
const store = useStore()
const navStack = computed(() => store.state.navbar.navStack)
const localization = computed(() => store.state.localization.localization)
const storeNavigator = computed(() => store.state.navigator.navigator)
//  const employees = computed(() => store.state.employees.employees)
//  const card = computed(() => store.state.cards.cards)
//  const board = computed(() => store.state.boards.boards)
//  const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const settings = computed(() => {
  return store.state.navigator.navigator.settings
})
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
const updateSettings = () => {
  store.dispatch(
    PATCH_SETTINGS,
    {
      show_completed_tasks: settings.value.show_completed_tasks ? 1 : 0,
      add_task_to_begin: settings.value.add_task_to_begin ? 1 : 0,
      cal_number_of_first_week: settings.value.cal_number_of_first_week ? 1 : 0,
      cal_show_week_number: settings.value.cal_show_week_number ? 1 : 0,
      nav_show_tags: settings.value.nav_show_tags ? 1 : 0,
      nav_show_overdue: settings.value.nav_show_overdue ? 1 : 0,
      nav_show_summary: settings.value.nav_show_summary ? 1 : 0,
      nav_show_emps: settings.value.nav_show_emps ? 1 : 0,
      nav_show_markers: settings.value.nav_show_markers ? 1 : 0,
      language: settings.value.language,
      stopwatch: settings.value.stopwatch ? 1 : 0,
      cal_work_time: settings.value.cal_work_time,
      reminders_in_n_minutes: settings.value.reminders_in_n_minutes,
      cal_work_week: settings.value.cal_work_week,
      compact_mode: settings.value.compact_mode ? 1 : 0
    }
  ).then(() => {
    requestLastVisitedNav()
  })
}
const searchshow = ref(false)
const IconSearchHide = ref(true)

function searchClick () {
  searchshow.value = true
  IconSearchHide.value = false
}
function HideSearch () {
  searchshow.value = false
  IconSearchHide.value = true
}
const requestLastVisitedNav = () => {
  if (store.state.auth.token) {
    // Process saved last visited nav
    if (navStack.value.length && navStack.value.length > 0) {
      if (navStack.value[navStack.value.length - 1].key === 'taskListSource') {
        store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].value.uid], navStack.value[navStack.value.length - 1].value.param)
        store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: navStack.value[navStack.value.length - 1].value })
      }
    } else {
      store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
      // TODO: here we need localization
      store.commit(
        'updateStackWithInitValue',
        { name: 'Today', key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } }
      )

      store.dispatch(TASK.TASKS_REQUEST, new Date())
        .then(() => {
          store.commit(TASK.CLEAN_UP_LOADED_TASKS)
        })
        .catch((err) => console.log(err))
    }
  }
  // After navigator is loaded we are trying to set up last visited navElement
  // Checking if last navElement is a gridSource
  if (navStack.value.length && navStack.value.length > 0) {
    if (navStack.value[navStack.value.length - 1].key === 'greedSource') {
      store.commit('basic', { key: 'greedPath', value: navStack.value[navStack.value.length - 1].greedPath })
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })

      // If last navElement is related to processed navigator instance with 'new_' prefix
      // then we pass entire object from storeNavigator
      if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath] })

        // if last visited navElem is in nested in children, then we trying to find these children with visitChildren function
        // from storeNavigator
      } else if (['tags_children', 'projects_children', 'boards_children'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
        if (navStack.value[navStack.value.length - 1].greedPath === 'tags_children') {
          // nested lookup for tags
          visitChildren(storeNavigator.value.tags.items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
        }

        // nested lookup for shared and private projects
        if (navStack.value[navStack.value.length - 1].greedPath === 'projects_children') {
          // Requests project's tasks
          store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].global_property_uid], navStack.value[navStack.value.length - 1].uid)
          store.commit('basic', { key: 'taskListSource', value: { uid: navStack.value[navStack.value.length - 1].global_property_uid, param: navStack.value[navStack.value.length - 1].uid } })

          visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
          visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
        }

        // nested lookup for shared and private boards
        if (navStack.value[navStack.value.length - 1].greedPath === 'boards_children') {
          // Requests project's tasks
          store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].global_property_uid], navStack.value[navStack.value.length - 1].uid)
          store.commit('basic', { key: 'cardSource', value: { uid: navStack.value[navStack.value.length - 1].global_property_uid, param: navStack.value[navStack.value.length - 1].uid } })

          visitChildren(storeNavigator.value.new_private_boards[0].items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
          visitChildren(storeNavigator.value.new_private_boards[1].items, value => {
            if (value.uid === navStack.value[navStack.value.length - 1].uid) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
            }
          })
        }
        // colors
      } else {
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath].items })
      }
    }
  }
}
</script>
<template>
  <div
    v-if="navStack[0] && navStack[navStack.length - 1].greedPath === 'boards_children'"
    class="transition-position flex-none items-stretch lg:items-center flex h-14 w-[300px] relative mr-0"
  >
    <nav-bar-item class="rounded-lg hover:text-gray-700 mr-2 px-0 mt-0 cursor-pointer" />
  </div>
  <div
    v-if="navStack[0] && navStack[0].greedPath !== 'new_private_projects' && navStack[0].greedPath !== 'new_delegate' && navStack[0].name !== 'Рабочий стол' && navStack[0].name !== 'Очередь' && navStack[0].greedPath !== 'new_private_boards'"
    class="transition-position flex-none items-stretch lg:items-center flex h-14 w-[300px] relative mr-0"
  >
    <!-- Search -->
    <nav-bar-item
      v-if="IconSearchHide"
      class="duration-200 right-0
ease-out transition transform origin-top-right right-[-35%] rounded-lg hover:text-gray-700 cursor-auto px-0"
      @click="searchClick"
    >
      <svg
        class="cursor-pointer"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 20L15.514 15.506L20 20ZM18 9.5C18 11.7543 17.1045 13.9163 15.5104 15.5104C13.9163 17.1045 11.7543 18 9.5 18C7.24566 18 5.08365 17.1045 3.48959 15.5104C1.89553 13.9163 1 11.7543 1 9.5C1 7.24566 1.89553 5.08365 3.48959 3.48959C5.08365 1.89553 7.24566 1 9.5 1C11.7543 1 13.9163 1.89553 15.5104 3.48959C17.1045 5.08365 18 7.24566 18 9.5V9.5Z"
          stroke="black"
          stroke-opacity="0.5"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span class="text-sm text-[#7E7E80] font-normal ml-1">{{ localization.search }}</span>
    </nav-bar-item>

    <nav-bar-item
      v-if="searchshow"
      class="px-0 relative mr-7 right-[12%] duration-200
ease-out transition transform"
      @mouseleave="HideSearch"
    >
      <nav-bar-search :placeholder="localization.search" />
    </nav-bar-item>
    <div class="flex absolute right-6">
      <nav-bar-item class="px-3 mt-1">
        <Popper
          class="items-center z-[99]"
          arrow
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template #content>
            <div
              class="w-60 flex flex-col"
            >
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold mr-1">
                  {{ localization.show_completed_tasks }}
                </p>
                <input
                  v-if="settings"
                  v-model="settings.show_completed_tasks"
                  class="w-6 h-6"
                  type="checkbox"
                  @change="updateSettings"
                >
              </div>
            </div>
          </template>
          <icon
            :path="properties.path"
            :width="properties.width"
            :height="properties.height"
            :box="properties.viewBox"
          />
        </Popper>
      </nav-bar-item>
      <nav-bar-item class="rounded-lg hover:text-gray-700 mr-2 px-0 mt-0 cursor-pointer">
        <Icon
          :path="sortorder.path"
          :width="sortorder.width"
          :height="sortorder.height"
          :box="sortorder.viewBox"
        />
      </nav-bar-item>
      <nav-bar-item class="rounded-lg hover:text-gray-700 mr-2 px-0 mt-0 cursor-pointer">
        <Icon
          :path="sort.path"
          :width="sort.width"
          :height="sort.height"
          :box="sort.viewBox"
        />
      </nav-bar-item>
      <nav-bar-item class="rounded-lg hover:text-gray-700 px-0 mt-0 cursor-pointer">
        <Icon
          :path="filters.path"
          :width="filters.width"
          :height="filters.height"
          :box="filters.viewBox"
        />
      </nav-bar-item>
    </div>
  </div>
</template>
