<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Overlay from '@/components/modals/Overlay.vue'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

const store = useStore()
const router = useRouter()
const isFileRedirect = computed(() => (router.currentRoute.value.name === 'taskfile' || router.currentRoute.value.name === 'cardfile') && router.currentRoute.value.params.id)

store.dispatch(LOCALIZATION_REQUEST)

const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}

</script>

<template>
  <router-view />
  <overlay
    v-if="!isFileRedirect"
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
