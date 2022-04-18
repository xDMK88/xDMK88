
<script setup>
import Icon from '@/components/Icon.vue'
// import focus from '@/icons/focus.js'
import * as TASK from '@/store/actions/tasks.js'
import unread from '@/icons/unread.js'
import focus from '@/icons/focus.js'
import inwork from '@/icons/inprogress.js'
import overdue from '@/icons/overdue.js'
import unsorted from '@/icons/unsorted'
import ready from '@/icons/ready.js'
import Tasksblock from '@/components/DashboardComponents/Tasksblock.vue'
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch(TASK.UNREAD_TASKS_REQUEST)
  store.dispatch(TASK.IN_WORK_TASKS_REQUEST)
  store.dispatch(TASK.IN_FOCUS_TASKS_REQUEST)
  store.dispatch(TASK.OVERDUE_TASKS_REQUEST)
  store.dispatch(TASK.UNSORTED_TASKS_REQUEST)
  store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST)
})

const unreadTasks = computed(() => {
  return store.state.tasks.unread.tasks
})

const inWork = computed(() => {
  return store.state.tasks.inWork.tasks
})

const inFocus = computed(() => {
  return store.state.tasks.inFocus.tasks
})

const inOverdue = computed(() => {
  return store.state.tasks.overdue.tasks
})

const inUnsorted = computed(() => {
  return store.state.tasks.unsorted.tasks
})

const inReady = computed(() => {
  return store.state.tasks.ready.tasks
})

const testObj = reactive({
  unreadTasks: unreadTasks,
  inWork: inWork,
  inFocus: inFocus,
  overdue: inOverdue,
  unsorted: inUnsorted,
  ready: inReady
})

const icons = {
  unread,
  inwork,
  focus,
  overdue,
  unsorted,
  ready
}

const iconsKeys = Object.keys(icons)

const typeofTasks = ['Непрочитанные задачи', 'В работе', 'В фокусе', 'Просрочено', 'Неразобранное', 'Готово к сдаче']
</script>

<template>
  <div>
    <h1 class="text-xl">Рабочий стол</h1>
  </div>
  <div class="flex justify-between flex-wrap">
    <div class="flex flex-col w-1/6 bg-white rounded-xl h-1/3 mb-14 max-h-[500px] max-w-screen-sm scroll-style mr-5 p-5 shadow-lg" v-for="(elem, key, idx) in testObj" :key="testObj[key]">
      <tasksblock>
        <template v-slot:block-name>
          <span>{{ typeofTasks[idx] }}</span>
        </template>
        <template v-slot:icon>
          <icon
            :path="icons[iconsKeys[idx]].path"
            :height="icons[iconsKeys[idx]].height"
            :width="icons[iconsKeys[idx]].width"
            :viewBox="icons[iconsKeys[idx]].viewBox">
          </icon>
        </template>
      </tasksblock>
      <div class="max-h-[500px] scroll-style">
        <div class="m-2 bg-gray-200 rounded-xl p-2" v-for="task in testObj[key]" :key="task.uid">
          <div class="font-bold">
            <span class="max-w-full break-all">{{ task.name }}</span>
          </div>
          <div v-if="task.comment.length">
            <details>
              <summary>Описание</summary>
              <p>{{ task.comment }}</p>
            </details>
          </div>
          <div class="bg-white rounded-xl p-1">
              {{ task.customer_name }}
          </div>
        </div>
        <div class="m-2 bg-gray-200 rounded-xl p-2" v-if="!testObj[key].length">
          <div class="font-bold">
              У вас пока нет задач этой категории!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
