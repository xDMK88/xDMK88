
<script setup>
import Icon from '@/components/Icon.vue'
// import focus from '@/icons/focus.js'
import * as TASK from '@/store/actions/tasks.js'
import unread from '@/icons/unread.js'
import project from '@/icons/project.js'
import focus from '@/icons/focus.js'
import inwork from '@/icons/inprogress.js'
import overdue from '@/icons/overdue.js'
import unsorted from '@/icons/unsorted'
import ready from '@/icons/ready.js'
import Tasksblock from '@/components/DashboardComponents/Tasksblock.vue'
import { computed, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const testObj = reactive({
  unreadTasks: '',
  inWork: '',
  inFocus: '',
  overdue: '',
  unsorted: '',
  ready: ''
})

onBeforeMount(() => {
  store.dispatch(TASK.UNREAD_TASKS_REQUEST).then(() => {
    testObj.unreadTasks = store.state.tasks.unread.tasks
  })
  store.dispatch(TASK.IN_WORK_TASKS_REQUEST).then(() => {
    testObj.inWork = store.state.tasks.inWork.tasks
  })
  store.dispatch(TASK.IN_FOCUS_TASKS_REQUEST).then(() => {
    testObj.inFocus = store.state.tasks.inFocus.tasks
  })
  store.dispatch(TASK.OVERDUE_TASKS_REQUEST).then(() => {
    testObj.overdue = store.state.tasks.overdue.tasks
  })
  store.dispatch(TASK.UNSORTED_TASKS_REQUEST).then(() => {
    testObj.unsorted = store.state.tasks.unsorted.tasks
  })
  store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST).then(() => {
    testObj.ready = store.state.tasks.ready.tasks
  })
})

// const unreadTasks = computed(() => {
//   return store.state.tasks.unread.tasks
// })

// const inWork = computed(() => {
//   return store.state.tasks.inWork.tasks
// })

// const inFocus = computed(() => {
//   return store.state.tasks.inFocus.tasks
// })

// const inOverdue = computed(() => {
//   return store.state.tasks.overdue.tasks
// })

// const inUnsorted = computed(() => {
//   return store.state.tasks.unsorted.tasks
// })

// const inReady = computed(() => {
//   return store.state.tasks.ready.tasks
// })

const tags = reactive(computed(() => {
  return store.state.tasks.tags
}))

const employees = reactive(computed(() => {
  return store.state.employees.employees
}))

const projects = reactive(computed(() => {
  return store.state.projects.projects
}))

const colors = reactive(computed(() => {
  return store.state.colors.colors
}))

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
  <div class="flex flex-wrap">
    <div class="flex flex-col w-1/4 bg-white rounded-xl h-1/3 mb-8 max-h-[500px] max-w-screen-sm scroll-style mr-3 p-2 shadow-lg font-SfProTextNormal" v-for="(elem, key, idx) in testObj" :key="testObj[key]">
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
        <div class="p-2 rounded-xl" v-for="(task, taskIdx) in testObj[key]" :key="task.uid" :style="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? {backgroundColor: colors[task.uid_marker].back_color} : ''">
          <div class="font-normal">
            <span class="max-w-full break-words">{{ task.name }}</span>
          </div>
          <!-- <div v-show="task.comment.length">
            <details v-show="task.comment.length">
              <summary>Описание</summary>
              <p>{{ task.comment }}</p>
            </details>
          </div> -->
          <div class="flex items-center text-xs">
            <div class="p-1">
              <img class="w-5 h-5 border-solid border-2 border-lime-500 rounded-md" :src="employees[task.uid_customer].fotolink">
            </div>
            <div class="tag-label cursor-default p-1 text-xs mr-1 flex items-center">{{ task.customer_name }}</div>
            <div
              class="tag-label cursor-default p-1 px-2 text-xs rounded-lg mr-1 flex items-center text-white bg-gray-400 order-first"
              :style="{ backgroundColor: tags[testObj[key][taskIdx].tags[j - 1]].back_color }"
              v-for="j in testObj[key][taskIdx].tags.length" :key="j">
              {{ tags[testObj[key][taskIdx].tags[j - 1]].name }}
            </div>
            <div class="p-1 order-last" v-if="task.uid_project !== '00000000-0000-0000-0000-000000000000'">
              <icon
                :path="project.path"
                :height="project.height - 15"
                :width="project.width - 15"
                :viewBox="project.viewBox">
              </icon>
              {{ projects[task.uid_project].name}}
            </div>
          </div>
        </div>
        <div class="m-2 p-2" v-if="!testObj[key].length">
          <div class="font-normal">
              У вас пока нет задач этой категории!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
