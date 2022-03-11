<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiMenu
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
// import NavBarItemLabel from '@/components/NavBarItemLabel.vue'
import Icon from '@/components/Icon.vue'
import NavBarSearch from '@/components/NavBarSearch.vue'
import arrowBack from '@/icons/arrow-back.js'
import * as TASK from '@/store/actions/tasks'
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
// const toggleLightDark = () => {
//   store.dispatch('darkMode')
// }

const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

const localization = computed(() => store.state.localization.localization)

const isNavBarVisible = computed(() => !store.state.isFullScreen)

const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const navbarLabel = computed(() => store.state.navbar.label)
const labelprojectchilren = computed(() => store.state.navbar.labelprojectchilren)
const labeldefault = computed(() => store.state.navbar.labeldefault)
const labelstart = computed(() => store.state.navbar.labelstart)
// const storeNavigator = computed(() => store.state.navigator.navigator)
// const userName = computed(() => store.state.userName)
const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)
const menuToggleMobile = () => {
  store.dispatch('asideMobileToggle')
}
// const isMenuNavBarActive = ref(false)

// const menuNavBarToggleIcon = computed(() => isMenuNavBarActive.value ? mdiClose : mdiDotsVertical)

// const menuNavBarToggle = () => {
//   isMenuNavBarActive.value = !isMenuNavBarActive.value
// }
// Serves as linkage between requests from storage and tree view navigator
const menuOpenLg = () => {
  store.dispatch('asideLgToggle', true)
}
const clickOnGridCard = (item) => {
  console.log(item)
  if (UID_TO_ACTION[item]) {
    store.dispatch(UID_TO_ACTION[item])
    store.commit('basic', { key: 'taskListSource', value: { uid: item, param: null } })
    store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  } else {
    if (item === 'new_private_projects' || item === 'new_emps' || item === 'new_delegate' || item === 'tags' || item === 'colors') {
      store.commit('updateLabelprojectchildren', '')
      store.commit('updatedefalt', '')
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: item })
    } if (item === 'projects_children') {
      store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    }
  }
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
</script>
<template>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 right-0 fixed flex h-14 z-30 bg-gray-100
    transition-position xl:pl-80 w-auto lg:items-center dark:bg-gray-800 dark:border-gray-800"
    :class="{ 'ml-80 lg:ml-80':isAsideMobileExpanded, 'mr-96':isPropertiesMobileExpanded}"
  >
    <div class="flex-1 items-stretch flex h-14 py-2">
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
      <nav-bar-item class="bg-gray-50 dark:bg-gray-700 rounded-lg mr-1">
        <icon
          :path="arrowBack.path"
          :width="arrowBack.width"
          :height="arrowBack.height"
          :box="arrowBack.viewBox"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item class="nopadding">
        <span class="bg-white text-black dark:bg-gray-700 rounded-lg breadcrumbs" @click="clickOnGridCard(labelstart)">{{navbarLabel}}</span>
      </nav-bar-item>
      <nav-bar-item class="nopadding" :menu="menuGroup" v-for="(item,index) in labelprojectchilren.split(',')" :key="index" >
        <span v-if="item!==''" class="bg-white text-black dark:bg-gray-700 rounded-lg breadcrumbs" @click="clickOnGridCard(labeldefault)">{{item}}</span>
        <span v-else></span>
      </nav-bar-item>
    </div>
    <div class="flex-none items-stretch flex h-14">
      <nav-bar-item class="rounded-lg hover:text-gray-700 cursor-auto px-0">
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20L15.514 15.506L20 20ZM18 9.5C18 11.7543 17.1045 13.9163 15.5104 15.5104C13.9163 17.1045 11.7543 18 9.5 18C7.24566 18 5.08365 17.1045 3.48959 15.5104C1.89553 13.9163 1 11.7543 1 9.5C1 7.24566 1.89553 5.08365 3.48959 3.48959C5.08365 1.89553 7.24566 1 9.5 1C11.7543 1 13.9163 1.89553 15.5104 3.48959C17.1045 5.08365 18 7.24566 18 9.5V9.5Z" stroke="black" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </nav-bar-item>
      <nav-bar-item class="px-0">
        <nav-bar-search :placeholder="localization.search" />
      </nav-bar-item>
      <!--
      <nav-bar-item @click.prevent="menuNavBarToggle">
        <icon
          :path="menuNavBarToggleIcon"
          size="24"
        />
      </nav-bar-item>
      -->
    </div>
    <!--
    <div
      class="absolute w-screen top-14 left-0
        lg:w-auto lg:items-stretch lg:flex lg:grow lg:static dark:bg-gray-800"
      :class="[isMenuNavBarActive ? 'block' : 'hidden']"
    >
      <div class="max-h-screen-menu overflow-y-auto lg:overflow-visible lg:flex lg:items-stretch lg:justify-end lg:ml-auto">
        <nav-bar-item
          has-divider
          is-desktop-icon-only
          @click.prevent="toggleLightDark"
        >
          <nav-bar-item-label
            :icon="mdiBrightness6"
            label="Light/Dark"
            is-desktop-icon-only
          />
        </nav-bar-item>
      </div>
    </div>
    -->
  </nav>
</template>
