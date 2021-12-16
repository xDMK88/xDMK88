<script setup>
import { computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { Calendar } from 'v-calendar'
import { mdiMenu } from '@mdi/js'
import AsideMenuList from '@/components/AsideMenuList.vue'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

const store = useStore()
const isFullScreen = computed(() => store.state.isFullScreen)
const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)
const isDark = computed(() => store.state.darkMode)

const getNavigator = () => {
  if (store.state.auth.token) {
    store.dispatch(NAVIGATOR_REQUEST)
      .then(() => console.log(store.state.navigator.navigator))
      .catch((err) => console.log(err))
  }
}

onBeforeMount(() => {
  getNavigator()
})

const attrs = [{
  key: 'today',
  highlight: true,
  dates: new Date()
}]

const asideLgClose = () => {
  store.dispatch('asideLgToggle', false)
}

const menuClick = (event, item) => { //
}
</script>

<template>
  <aside
    v-show="!isFullScreen"
    id="aside"
    class="w-80 fixed top-0 z-40 h-screen bg-white transition-position lg:left-0 dark:border-r dark:border-gray-800 dark:bg-gray-900"
    :class="[ isAsideMobileExpanded ? 'left-0' : '-left-80', isAsideLgActive ? 'block' : 'lg:hidden xl:block' ]"
  >
    <div class="flex flex-row w-full text-dark flex-1 h-14 items-center">
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        active-color="text-dark"
        active
        @click="asideLgClose"
      >
        <icon
          :path="mdiMenu"
          class="cursor-pointer"
          size="24"
        />
      </nav-bar-item>
      <div class="flex-1 px-3">
        <span>Username</span>
      </div>
    </div>
    <nav-bar-item>
      <Calendar
        show-weeknumbers
        locale="ru"
        :attributes='attrs'
        color="yellow"
        :is-dark="isDark"
        is-range
        is-expanded
        />
    </nav-bar-item>
    <div>
      <template v-for="(menuGroup, index) in menu">
        <p
          v-if="typeof menuGroup === 'string'"
          :key="`a-${index}`"
          class="p-3 text-xs uppercase text-gray-400"
        >
          {{ menuGroup }}
        </p>
        <aside-menu-list
          v-else
          :key="`b-${index}`"
          :menu="menuGroup"
          @menu-click="menuClick"
        />
      </template>
    </div>
  </aside>
</template>
