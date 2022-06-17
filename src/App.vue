<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
import ErrorNotification from '@/components/Notifications/ErrorNotification.vue'
import Notification from '@/components/Notifications/Notification.vue'
import InspectorNotification from '@/components/Notifications/InspectorNotification.vue'
import Overlay from '@/components/modals/Overlay.vue'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

const store = useStore()
const router = useRouter()
const isFileRedirect = computed(() => (router.currentRoute.value.name === 'taskfile' || router.currentRoute.value.name === 'cardfile') && router.currentRoute.value.params.id)

store.dispatch(LOCALIZATION_REQUEST)

const menu = computed(() => store.state.navigator.menu)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}

</script>

<template>
  <nav-bar v-if="!isFileRedirect" />
  <aside-menu
    v-if="!isFileRedirect"
    :menu="menu"
  />
  <router-view />
  <overlay
    v-if="!isFileRedirect"
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
  <properties-right v-if="!isFileRedirect" />
  <ErrorNotification v-if="!isFileRedirect" />
  <Notification v-if="!isFileRedirect" />
  <InspectorNotification v-if="!isFileRedirect" />
</template>
