<template>
  <TreeViewComponent
    id="treeview"
    :fields="storeTasks"
    :allow-drag-and-drop="true"
    :allow-multi-selection="true"
    :node-template="Template"
    css-class="custom"
    @nodeExpanding="nodeExpanding"
    @nodeSelected="nodeSelected"
  />
</template>

<script>
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import { createApp, computed } from 'vue'
import { useStore } from 'vuex'

import * as TASK from '@/store/actions/tasks'
import { MESSAGES_REQUEST, REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { FILES_REQUEST, REFRESH_FILES } from '@/store/actions/taskfiles'

const app = createApp({})

const Template = app.component('Template', {
  data () {
    return {
      data: {}
    }
  },
  template: '<div>{{ data.name }}</div>'
})

export default {
  components: {
    TreeViewComponent
  },
  props: {
    storeTasks: Object
  },
  setup () {
    const store = useStore()
    const loadedTasks = computed(() => store.state.tasks.loadedTasks)

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
    const nodeSelected = (arg) => {
      store.commit(REFRESH_FILES)
      store.commit(REFRESH_MESSAGES)
      const tree = document.getElementById('treeview').ej2_instances[0]
      const treeNodeData = tree.getTreeData(arg.nodeData.id)[0]
      store.commit(TASK.SELECT_TASK, treeNodeData)
      if (treeNodeData.has_msgs) {
        store.dispatch(MESSAGES_REQUEST, treeNodeData.uid)
      }
      if (treeNodeData.has_files) {
        store.dispatch(FILES_REQUEST, treeNodeData.uid)
      }
    }
    return {
      nodeExpanding,
      nodeSelected,
      Template: function () {
        return {
          template: Template
        }
      }
    }
  },
  methods: {
  }
}
</script>
