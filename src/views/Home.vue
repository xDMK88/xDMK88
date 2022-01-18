<script setup>
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import MainSection from '@/components/MainSection.vue'

import * as TASK from '@/store/actions/tasks'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'

const store = useStore()
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
  store.dispatch(NAVIGATOR_REQUEST)
}

onBeforeMount(() => {
  getTasks()
  getNavigator()
})

</script>

<template>
  <main-section>
    <!-- <h1 v-if="storeTasks.dataSource.length">There are no tasks :(</h1> -->
    <TreeViewComponent
      id='treeview'
      :fields='storeTasks'
      :allowDragAndDrop='true'
      :allowMultiSelection='true'
      cssClass="custom"
      @nodeExpanding="nodeExpanding"
      @nodeCollapsing="nodeCollapsing"
    >
    </TreeViewComponent>
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
