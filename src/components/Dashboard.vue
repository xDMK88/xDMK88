<template>
  <div>
    <h1>Рабочий стол</h1>
    <span>{{ unread }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const unread = computed(() => {
  return store.state.tasks.unread
})
</script>
