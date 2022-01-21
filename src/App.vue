<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
// import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'
import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

import '../node_modules/@syncfusion/ej2-base/styles/material.css'
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css'
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css'
import '../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css'

const store = useStore()

console.log('localization request', LOCALIZATION_REQUEST)
store.dispatch(LOCALIZATION_REQUEST)

const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}
</script>

<template>
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

<style>
  /* @import '../node_modules/@syncfusion/ej1-base/styles/material.css'; */
  /* @import '../node_modules/@syncfusion/ej2-inputs/styles/material.css'; */
  /* @import '../node_modules/@syncfusion/ej2-buttons/styles/material.css'; */
  @import '../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css';
</style>
