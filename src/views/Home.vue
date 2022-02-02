<script setup>
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import MainSection from '@/components/MainSection.vue'
import Icon from '@/components/Icon.vue'
import { mdiPlus } from '@mdi/js'

import * as TASK from '@/store/actions/tasks'
import { MESSAGES_REQUEST, REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { FILES_REQUEST, REFRESH_FILES } from '@/store/actions/taskfiles'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'

const store = useStore()
const mainSectionState = computed(() => store.state.mainSectionState)
const greedPath = computed(() => store.state.greedPath)
const navigator = computed(() => store.state.navigator.navigator)
const loadedTasks = computed(() => store.state.tasks.loadedTasks)
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
  // propertiesToggleMobile()
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
    <div
      v-if="mainSectionState === 'greed'"
      class="grid grid-cols-4 gap-4 break-words"
    >
      <template v-for="(value, index) in navigator[greedPath].items" :key="index">
        <div class="flex items-start grow-0 bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer" :style="{ backgroundColor: value.back_color ? value.back_color : value.color, color: value.fore_color }">
          <img v-if="value.fotolink" :src="value.fotolink" class="rounded-lg mx-2 my-auto" width="32" height="32">
          <div>
            <p class="font-light">{{ value.name }}</p>
            <p class="font-light text-xs">{{ value.email }}</p>
            <p v-if="value.children && value.children.length" class="font-light text-xs">Дочерних: {{ value.children.length }}</p>
          </div>
          <div v-if="value.members && value.members.length">
          </div>
        </div>
      </template>
      <div class="p-3 border rounded-xl text-center cursor-pointer text-gray-500 hover:bg-gray-100 hover:shadow-inner hover:text-gray-800 hover:dark:bg-gray-900 hover:dark:text-white">
        <icon
          :path="mdiPlus"
          size="24"
        />
      </div>
    </div>
    <!-- /Greed section -->
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
