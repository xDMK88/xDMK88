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
import search from '@/icons/search.js'

const store = useStore()

// const toggleLightDark = () => {
//   store.dispatch('darkMode')
// }
const localization = computed(() => store.state.localization.localization)

const isNavBarVisible = computed(() => !store.state.isFullScreen)

const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const navbarLabel = computed(() => store.state.navbar.label)

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
</script>

<template>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 right-0 fixed flex h-14 z-30 bg-gray-100
    transition-position xl:pl-80 xl:pr-96 w-auto lg:items-center dark:bg-gray-800 dark:border-gray-800"
    :class="{'ml-80 lg:ml-80':isAsideMobileExpanded}"
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
      <nav-bar-item class="bg-gray-50 dark:bg-gray-700 rounded-lg">
        {{ navbarLabel }}
      </nav-bar-item>
    </div>
    <div class="flex-none items-stretch flex h-14">
      <nav-bar-item class="rounded-lg hover:text-gray-700 cursor-auto">
        <icon
          :path="search.path"
          :width="search.width"
          :height="search.height"
          :box="search.viewBox"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item>
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
