<script setup>
import { onBeforeMount, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import MainSection from '@/components/MainSection.vue'
// import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data'

import { TASKS_REQUEST } from '@/store/actions/tasks'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'

const store = useStore()

const storeTasks = computed(() => { return { dataSource: store.state.tasks.tasks.tasks, id: 'uid', text: 'name', child: 'children', hasChildren: 'has_children' } })

const mainTasks = reactive({
  tasks: { dataSource: store.state.tasks.tasks.tasks, id: 'uid', text: 'name', child: 'children', hasChildren: 'has_children' }
})

// const remoteData = new DataManager({
//   url: '',
//   adaptor: new ODataV4Adaptor,
//   crossDomain: true
// })

const getTasks = () => {
  if (store.state.auth.token) {
    store.dispatch(TASKS_REQUEST, new Date())
      .then(() => {
        const tasks = store.state.tasks.tasks
        console.log('INITIAL TASK REQUEST', tasks)
        mainTasks.tasks = { dataSource: tasks.tasks, id: 'uid', text: 'name', child: 'cihildren', hasChildren: 'has_children' }
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
    <TreeViewComponent
      id='treeview'
      :fields='storeTasks'
      :allowDragAndDrop='true'
      :allowMultiSelection='true'
      cssClass="custom"
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
