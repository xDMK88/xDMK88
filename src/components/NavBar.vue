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

const store = useStore()
defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})
// const toggleLightDark = () => {
//   store.dispatch('darkMode')
// }
const projects = computed(() => store.state.projects.projects)
const localization = computed(() => store.state.localization.localization)

const isNavBarVisible = computed(() => !store.state.isFullScreen)

const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const navbarLabel = computed(() => store.state.navbar.label)
const labelprojectchilren = computed(() => store.state.navbar.labelprojectchilren)
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

const menuOpenLg = () => {
  store.dispatch('asideLgToggle', true)
}
const goToChildren = (value) => {
  if (value.children && value.children.length) {
    store.commit('updateLabelprojectchildren', value.name)
    store.commit('basic', { key: 'greedSource', value: value.children })
  }
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
        <span class="bg-white text-black dark:bg-gray-700 rounded-lg breadcrumbs">{{navbarLabel}}</span>
      </nav-bar-item>
      <nav-bar-item class="nopadding" @click="goToChildren(projects)" v-for="item in labelprojectchilren.split(',')" :key="item" >
        <span v-if="item!==''" class="bg-white text-black dark:bg-gray-700 rounded-lg breadcrumbs">{{item}}</span>
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
