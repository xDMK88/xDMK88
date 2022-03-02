<script setup>
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import TasksListNew from '@/components/TasksListNew.vue'
import MainSection from '@/components/MainSection.vue'
import Projects from '@/components/Projects.vue'
import ProjectsChildren from '@/components/ProjectsChildren.vue'
import Employees from '@/components/Employees.vue'
import Tags from '@/components/Tags.vue'
import Colors from '@/components/Colors.vue'
import Assignments from '@/components/Assignments.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'
import * as TASK from '@/store/actions/tasks'

const store = useStore()
const mainSectionState = computed(() => store.state.mainSectionState)
const greedPath = computed(() => store.state.greedPath)
const greedSource = computed(() => store.state.greedSource)

// const storeTasks = computed(() => {
//   return {
//     dataSource: store.state.tasks.tasks.tasks,
//     id: 'uid',
//     text: 'name',
//     hasChildren: 'has_children'
//   }
// })

const storeTasks = computed(() => store.state.tasks.newtasks)
const newConfig = computed(() => store.state.tasks.newConfig)

const getTasks = () => {
  if (store.state.auth.token) {
    store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
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

onBeforeMount(() => {
  getTasks()
  getNavigator()
  store.dispatch(USER_REQUEST)
})

</script>

<template>
  <main-section>
    <TasksListNew
      v-if="mainSectionState === 'tasks'"
      :store-tasks="storeTasks"
      :new-config="newConfig"
    />
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
        v-if="greedPath === 'new_delegate'"
        :assignments="greedSource"
      />
    </div>
  </main-section>
</template>
