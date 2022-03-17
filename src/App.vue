<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
// import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'
import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

import { NotificationGroup, Notification } from 'notiwind'

const store = useStore()

console.log('localization request', LOCALIZATION_REQUEST)
store.dispatch(LOCALIZATION_REQUEST)

const menu = computed(() => store.state.navigator.menu)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}
</script>

<template>
  <NotificationGroup group="api">
    hello world
    <Notification v-slot="{ notification }">
      hello world {{ notification }}
    </Notification>
  </NotificationGroup>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  <!-- <footer-bar /> -->
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
  <properties-right />
</template>
