<script setup>
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import MainSection from '@/components/MainSection.vue'
// import Icon from '@/components/Icon.vue'
import Projects from '@/components/Projects.vue'
import ProjectsChildren from '@/components/ProjectsChildren.vue'
import Employees from '@/components/Employees.vue'
import Tags from '@/components/Tags.vue'
import Colors from '@/components/Colors.vue'
import Assignments from '@/components/Assignments.vue'
// import { mdiPlus } from '@mdi/js'

import * as TASK from '@/store/actions/tasks'
import { MESSAGES_REQUEST, REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { FILES_REQUEST, REFRESH_FILES } from '@/store/actions/taskfiles'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'

const store = useStore()
const mainSectionState = computed(() => store.state.mainSectionState)
const greedPath = computed(() => store.state.greedPath)
// const navigator = computed(() => store.state.navigator.navigator)
const greedSource = computed(() => store.state.greedSource)
const loadedTasks = computed(() => store.state.tasks.loadedTasks)
// const employeesByEmail = computed(() => store.state.employees.employeesByEmail)

const storeTasks = computed(() => {
  return {
    dataSource: store.state.tasks.tasks.tasks,
    id: 'uid',
    text: 'name',
    hasChildren: 'has_children'
  }
})

const nodeExpanding = (arg) => {
  if (arg.isInteracted) {
    if (loadedTasks.value[arg.nodeData.id]) return false
    store.dispatch(TASK.SUBTASKS_REQUEST, arg.nodeData.id)
      .then(() => {
        store.commit(TASK.ADD_LOADED_TASK, arg.nodeData.id)
        const tree = document.getElementById('treeview').ej2_instances[0]
        tree.addNodes(store.state.tasks.subtasks.tasks, arg.nodeData.id)
      })
  }
}

// Serves as linkage between requests from storage and tree view navigator
// const UID_TO_ACTION = {
//   '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
//   '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
//   '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
//   '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
//   'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
//   '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
//   '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
//   'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
//   '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
//   '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
//   '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
//   '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
//   'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
//   'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
//   '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
// }

const getTasks = () => {
  if (store.state.auth.token) {
    store.dispatch(TASK.TASKS_REQUEST, new Date())
      .then(() => {
        store.commit(TASK.CLEAN_UP_LOADED_TASKS)
      })
      .catch((err) => console.log(err))
  }
}

const getNavigator = () => {
  if (store.state.auth.token) {
    store.dispatch(NAVIGATOR_REQUEST)
  }
}

// const clickOnGridCard = (value) => {
//   console.log(value)
//   if (UID_TO_ACTION[value.uid]) {
//     store.dispatch(UID_TO_ACTION[value.uid])
//   } else if (UID_TO_ACTION[value.parentID]) {
//     if (value.email) {
//       if (UID_TO_ACTION[value.parentID] === TASK.EMPLOYEE_TASKS_REQUEST) {
//         store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
//         console.log('is employee request')
//       } else {
//         store.dispatch(UID_TO_ACTION[value.parentID], value.email)
//         console.log('isnt employee request')
//       }
//     } else {
//       store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
//     }
//   } else if (UID_TO_ACTION[value.global_property_uid]) {
//     store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
//   }
//   store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
//   store.commit('updateLabel', value.name)
//   store.commit(TASK.CLEAN_UP_LOADED_TASKS)
// }

const nodeSelected = (arg) => {
  store.commit(REFRESH_FILES)
  store.commit(REFRESH_MESSAGES)
  const tree = document.getElementById('treeview').ej2_instances[0]
  const treeNodeData = tree.getTreeData(arg.nodeData.id)[0]
  console.log(treeNodeData)
  store.commit(TASK.SELECT_TASK, treeNodeData)
  if (treeNodeData.has_msgs) {
    store.dispatch(MESSAGES_REQUEST, treeNodeData.uid)
  }
  if (treeNodeData.has_files) {
    store.dispatch(FILES_REQUEST, treeNodeData.uid)
  }
}

onBeforeMount(() => {
  getTasks()
  getNavigator()
  store.dispatch(USER_REQUEST)
})

</script>

<template>
  <main-section>
    <!-- Tasks section -->
    <TreeViewComponent
      v-if="mainSectionState === 'tasks'"
      id="treeview"
      :fields="storeTasks"
      :allow-drag-and-drop="true"
      :allow-multi-selection="true"
      css-class="custom"
      @nodeExpanding="nodeExpanding"
      @nodeSelected="nodeSelected"
    />
    <!-- /Tasks section -->

    <!-- Greed section -->
    <div v-if="mainSectionState === 'greed'">
      <projects
        v-if="greedPath === 'new_private_projects'"
        :projects="greedSource"
      />
      <projects-children
        v-if="greedPath === 'projects_children'"
        :projects="greedSource"
      />
      <employees
        v-if="greedPath === 'new_emps'"
        :employees="greedSource"
      />
      <tags
        v-if="greedPath === 'tags'"
        :tags="greedSource"
      />
      <colors
        v-if="greedPath === 'colors'"
        :colors="greedSource"
      />
      <assignments
        v-if="greedPath === 'delegate_iam' || greedPath === 'delegate_to_me'"
        :assignments="greedSource"
      />
    </div>
  </main-section>
</template>

<style>
  .custom .e-list-text {
    font-size: 16px!important;
  }
  .custom.e-fullrow-wrap .e-text-content {
    border-radius: 10px;
    border: 1px solid #ccc;
    min-height: 40px;
  }
  .custom .e-list-item.e-active, .e-treeview .e-list-item.e-hover {
    background: none!important;
  }
  .custom .e-list-item.e-active > .e-fullrow {
    background-color: transparent;
    border: none;
  }
  .custom .e-list-item.e-active > .e-fullrow:hover {
    background-color: transparent;
  }
  .custom .e-list-item > .e-fullrow:hover {
    background-color: transparent;
  }
</style>
