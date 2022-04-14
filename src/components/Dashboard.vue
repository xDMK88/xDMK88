
<script setup>
import Icon from '@/components/Icon.vue'
// import focus from '@/icons/focus.js'
import unread from '@/icons/unread.js'
import Tasksblock from '@/components/DashboardComponents/Tasksblock.vue'
import Task from '@/components/DashboardComponents/Task.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const unreadTasks = computed(() => {
  return store.state.tasks.tasks.tasks
})

// const unreadCustomersUid = computed(() => {
//   return store.state.tasks.unreadCustomersUid
// })

// const typeofTasks = ['Непрочитанные задачи', 'В работе', 'Поручено мне']
</script>

<template>
  <!-- {{ unreadCustomersUid }} -->
  <!-- {{ unreadTasks }} -->
  <div>
    <h1 class="text-xl">Рабочий стол</h1>
  </div>
  <div class="flex justify-between">
    <div class="flex flex-col w-3/12 bg-white rounded-xl h-1/3 overflow-auto max-h-[500px] max-w-screen-sm">
      <tasksblock>
        <template v-slot:block-name>
          <span>Непрочитанные задачи</span>
        </template>
        <template v-slot:icon>
          <icon
            :path="unread.path"
            :height="unread.height"
            :width="unread.width"
            :viewBox="unread.viewBox">
          </icon>
        </template>
      </tasksblock>
      <task v-for="(elem, idx) in unreadTasks" :key="unreadTasks[idx]">
          <template v-slot:task-title>
            {{ unreadTasks[idx].name }}
          </template>
          <template v-slot:customer>
            {{ unreadTasks[idx].customer_name }}
          </template>
      </task>
      <!-- <tasks>{{ unreadCustomersUid }}</tasks>
      <tasks>{{ employees }}</tasks> -->
    </div>
  </div>
  <!-- {{ employees }} -->
</template>
