
<script setup>
import Mytasks from '@/components/DashboardComponents/Mytasks.vue'
import Unreadblock from '@/components/DashboardComponents/Unreadblock.vue'
import Focusblock from '@/components/DashboardComponents/Focusblock.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const unread = computed(() => {
  return store.state.tasks.unread
})

const unreadCustomersUid = computed(() => {
  return store.state.tasks.unreadCustomersUid
})

const employees = computed(() => {
  return store.state.employees.employees
})
</script>

<template>
  <div>
    <h1 class="text-xl">Рабочий стол</h1>
  </div>
  <div class="flex" style="justify-content: space-between">
    <mytasks class="flex-col bg-white rounded-xl w-3/12 overflow-auto">{{ unread }}</mytasks>
    <unreadblock class="flex-col bg-white rounded-xl h-64 w-5/12 overflow-auto">
      <div>{{ employees }}</div>
    </unreadblock>
    <focusblock class="flex-col bg-white rounded-xl w-3/12 h-64 overflow-auto">{{ unreadCustomersUid }}</focusblock>
  </div>
</template>
