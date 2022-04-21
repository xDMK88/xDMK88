
<script setup>
import Icon from '@/components/Icon.vue'
// import focus from '@/icons/focus.js'
import * as TASK from '@/store/actions/tasks.js'
import unread from '@/icons/unread.js'
import project from '@/icons/projectDesktop.js'
import gear from '@/icons/gear.js'
import focus from '@/icons/focus.js'
import inwork from '@/icons/inprogress.js'
import overdue from '@/icons/overdue.js'
import unsorted from '@/icons/unsorted'
import ready from '@/icons/ready.js'
import Taskhead from '@/components/DashboardComponents/Taskhead.vue'
import TaskStatus from '@/components/TasksList/TaskStatus'
import { computed, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const testObj = reactive({
  unread: '',
  inWork: '',
  inFocus: '',
  overdue: '',
  unsorted: '',
  ready: ''
})

onBeforeMount(() => {
  store.dispatch(TASK.UNREAD_TASKS_REQUEST).then(() => {
    testObj.unread = store.state.tasks.unread.tasks
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

// link logic
const UID_TO_ACTION = {
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

function redirect (title, uid) {
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
  store.dispatch(UID_TO_ACTION[uid])
  const navElem = {
    name: title,
    key: 'taskListSource',
    value: { uid: uid, param: null }
  }
  store.commit('updateStackWithInitValue', navElem)
  store.commit('basic', { key: 'taskListSource', value: { uid: uid, param: null } })
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
}

</script>
<template>
  <div class="flex justify-end">
    <div class="font-SfProDisplayBold text-white bg-gray-800 rounded-xl p-2">
      <icon
        :path="gear.path"
        :width="gear.width"
        :height="gear.height"
        :viewBox="gear.viewBox">
      </icon>
      <button>Настроить</button>
    </div>
  </div>
  <div class="flex flex-wrap">
    <div class="flex flex-col lg:w-1/4 sm:w-4/4 bg-white dark:bg-slate-900 rounded-xl h-1/3 mb-8 max-h-[500px] max-w-screen-sm scroll-style mr-3 p-2 shadow-lg font-SfProTextNormal" :id="key" v-for="(elem, key, idx) in testObj" :key="testObj[key]">
      <taskhead>
        <template v-slot:block-name>
          <span
            class="hover:cursor-pointer"
            @click="redirect(store.state.tasks[key].title, store.state.tasks[key].link)">
              {{ store.state.tasks[key].title }}
          </span>
        </template>
        <template v-slot:icon>
          <icon
            :path="icons[iconsKeys[idx]].path"
            :height="icons[iconsKeys[idx]].height"
            :width="icons[iconsKeys[idx]].width"
            :viewBox="icons[iconsKeys[idx]].viewBox"
            class="text-gray-500">
          </icon>
        </template>
      </taskhead>
      <div class="max-h-[500px] scroll-style">
        <div class="p-2 rounded-xl" v-for="(task, taskIdx) in testObj[key]" :key="task.uid" :style="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? {backgroundColor: colors[task.uid_marker].back_color} : ''">
          <div class="flex">
            <div class="flex order-first">
              <task-status :task="task"></task-status>
            </div>
            <div class="font-normal">
              <span class="max-w-full break-words">{{ task.name }}</span>
            </div>
          </div>
          <div class="flex items-center text-xs">
            <div>
              <img class="w-5 h-5 border-solid border-2 border-lime-500 rounded-md" :src="employees[task.uid_customer].fotolink">
            </div>
            <div class="tag-label cursor-default p-1 text-xs flex items-center">{{ task.customer_name }}</div>
            <div
              class="tag-label cursor-default p-1 px-2 text-xs rounded-lg mr-1 flex items-center text-white bg-gray-400 order-first"
              :style="{ backgroundColor: tags[testObj[key][taskIdx].tags[j - 1]].back_color }"
              v-for="j in testObj[key][taskIdx].tags.length" :key="j">
              {{ tags[testObj[key][taskIdx].tags[j - 1]].name }}
            </div>
            <div class="p-1 order-last flex align-items justify-around" v-if="task.uid_project !== '00000000-0000-0000-0000-000000000000'">
              <icon
                :path="project.path"
                :height="project.height"
                :width="project.width"
                :viewBox="project.viewBox">
              </icon>
              <span class="ml-1">{{ projects[task.uid_project].name}}</span>
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
