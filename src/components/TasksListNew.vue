<template>
  <tree :nodes="storeTasks" :config="newConfig" @nodeOpened="nodeExpanding" @nodeFocus="nodeSelected">
    <template #loading-slot>
      <div class="progress">
        <div class="indeterminate"></div>
        loading...
      </div>
    </template>
    <template #before-input="props" :style="{ backgroundColor: props.node.info.uid_marker != '00000000-0000-0000-0000-000000000000' ? colors[props.node.info.uid_marker].back_color : '' }">
      <div class="flex-col items-center">
        <!-- Name, Status -->
        <div class="flex items-center">
          <div class="border-2 border-gray-300 w-5 h-5 rounded-md mr-1 flex items-center justify-center">
            <Icon
              v-if="statuses[props.node.info.status]"
              :path="statuses[props.node.info.status].path"
              :class="statusColor[props.node.info.status] ? statusColor[props.node.info.status] : 'text-gray-500 dark:text-gray-100'"
              :box="statuses[props.node.info.status].viewBox"
              :width="statuses[props.node.info.status].width"
              :height="statuses[props.node.info.status].height"
              class="cursor-pointer"
            />
          </div>
          <p :class="(props.node.info.status == 1 || props.node.info.status == 7) ? 'text-gray-500 line-through' : ''">{{ props.node.info.name }}</p>
        </div>
        <!-- Tags, Overdue -->
        <div
          v-if="props.node.info.tags.length || props.node.info.is_overdue"
          class="flex items-center mt-1.5"
        >
          <div
            v-if="props.node.info.is_overdue"
            class="p-1 px-2 text-xs text-red-600 bg-red-300 rounded-lg mr-1 opacity-70"
          >
            Просрочено
          </div>
          <div
            v-for="(tag, index) in props.node.info.tags" :key="index"
          >
            <div class="p-1 px-2 text-xs text-white rounded-lg mr-1" :style="{ backgroundColor: tags[tag].back_color }">
              {{ tags[tag].name }}
            </div>
          </div>
        </div>
        <!-- Icons, Messages, Files, Data, Checklist -->
        <div
          class="flex"
        >
          <div v-if="props.node.info.checklist" class="bg-gray-200 rounded px-1.5 mr-1 mt-1.5">
            <Icon
              :path="checklist.path"
              class="cursor-pointer text-gray-600"
              :box="checklist.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div v-if="props.node.info.has_files" class="bg-gray-200 rounded px-1.5 mr-1 mt-1.5">
            <Icon
              :path="file.path"
              class="cursor-pointer text-gray-600"
              :box="file.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div v-if="props.node.info.has_msgs" class="bg-gray-200 rounded px-1.5 mr-1 mt-1.5">
            <Icon
              :path="msgs.path"
              class="cursor-pointer text-gray-600"
              :box="msgs.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div v-if="props.node.info.comment" class="bg-gray-200 rounded px-1.5 mr-1 mt-1.5">
            <Icon
              :path="taskcomment.path"
              class="cursor-pointer text-gray-600"
              :box="taskcomment.viewBox"
              :width="13"
              :height="12"
            />
          </div>
        </div>
      </div>
    </template>
  </tree>
</template>

<script>
import { computed } from 'vue'
import treeview from 'vue3-treeview'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'

import * as TASK from '@/store/actions/tasks'
import { MESSAGES_REQUEST, REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { FILES_REQUEST, REFRESH_FILES } from '@/store/actions/taskfiles'

import file from '@/icons/file.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import readyStatus from '@/icons/ready-status.js'
import inwork from '@/icons/inwork.js'
import canceled from '@/icons/canceled.js'
import pause from '@/icons/pause.js'
import note from '@/icons/note.js'

export default {
  components: {
    tree: treeview,
    Icon
  },
  props: {
    storeTasks: Object,
    newConfig: Object
  },
  data () {
    const statuses = [
      undefined,
      readyStatus,
      readyStatus,
      note,
      inwork,
      readyStatus,
      pause,
      canceled,
      canceled
    ]
    return {
      statuses
    }
  },
  setup () {
    const store = useStore()
    const loadedTasks = computed(() => store.state.tasks.loadedTasks)

    const nodeExpanding = (arg) => {
      if (loadedTasks.value[arg.id]) return
      arg.state.isLoading = true
      store.dispatch(TASK.SUBTASKS_REQUEST, arg.id)
        .then(() => {
          store.commit(TASK.ADD_LOADED_TASK, arg.id)
          store.commit(TASK.UPDATE_NEW_TASK_LIST, store.state.tasks.subtasks.tasks)

          for (const task of store.state.tasks.subtasks.tasks) {
            arg.children.push(task.uid)
          }
        })
      arg.state.isLoading = false
    }

    const nodeSelected = (arg) => {
      store.commit(REFRESH_FILES)
      store.commit(REFRESH_MESSAGES)
      store.commit(TASK.SELECT_TASK, arg.info)
      if (arg.info.has_msgs) {
        store.dispatch(MESSAGES_REQUEST, arg.info.uid)
      }
      if (arg.info.has_files) {
        store.dispatch(FILES_REQUEST, arg.info.uid)
      }
    }

    return {
      tags: computed(() => store.state.tasks.tags),
      nodeExpanding,
      nodeSelected,
      file,
      msgs,
      taskcomment,
      checklist,
      colors: computed(() => store.state.colors.colors),
      statusColor: {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600'
      }
    }
  },
  methods: {
  }
}
</script>

<style>
.tree-level {
  flex: 1
}

.node-checkbox {
  display: none
}

.icon-wrapper {
  padding: 0;
  min-width: 0;
  flex-shrink: 0;
  display: flex;
  align-items: start;
  justify-content: center;
  width: 35px;
}

.node-wrapper {
  @apply bg-white p-2 rounded-xl dark:bg-gray-900 dark:border-gray-700 border border-gray-300 my-1 focus:border-orange-300 focus:border-2 focus:ring-0
}

.input-wrapper {
  margin-left: .75em
}

.icon-wrapper svg {
  height: 15px;
  width: 15px;
}

.node-wrapper {
  min-height: 32px;
  display: flex;
  align-items: center;
  flex: 1;
  word-wrap: break-word;
  font-weight: 400;
  font-size: 14px
}

.checkbox-wrapper {
  width: 1.25em;
  height: 1.25em
}

. checkbox-wrapper {
  position: relative;
  margin-left: .3em;
  overflow: hidden
}

.checkbox-wrapper {
  background: #fff;
  border: 2px solid rgba(0, 0, 0, .54);
  border-radius: .125em;
  cursor: pointer;
  transition: background .3s
}

.checkbox-wrapper.checked,
.checkbox-wrapper.indeterminate {
  background: #3f51b5;
  border: 2px solid #3f51b5
}

.node-wrapper.disabled .checkbox-wrapper.checked {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper.indeterminate {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper {
  border-color: #00000042
}

.checkbox-wrapper. checked:after {
  transform: translate(.25em, .3365384615em) rotate(-45deg);
  width: .7em;
  height: .3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none
}

.checkbox-wrapper.indeterminate:after {
  transform: translate(.25em, .3365384615em) rotate(0);
  width: .7em;
  height: . 3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none;
  border-left-style: none
}

.checkbox-wrapper:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0
}

.node-over {
  border-top: solid 2px #5C6BC0
}

.node-in {
  background-color: #bdbdbd
}

.node-under {
  border-bottom: solid 2px #5C6BC0
}

.input-wrapper {
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center
}

.input-wrapper:after {
  content: "\a0";
  display: block;
  color: #d50000;
  font-size: 12px;
  padding-top: 5px
}

.input-wrapper input {
  padding: 4px 0;
  display: block;
  width: 100%;
  border: none;
  font-size: 14px;
  color: #000;
  border-bottom: 1px solid #d2d2d2;
  outline: none;
  background: transparent;
  transition: border-color .2s
}

.input-wrapper input:focus {
  outline: none;
  color: #3f51b5;
  padding-bottom: 4px;
  border-bottom-width: 3px;
  border-bottom-color: #3f51b5
}

.progress {
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #aab6fe;
  border-radius: 2px;
  background-clip: padding-box;
  margin: 0.5rem 0 1rem 0;
  overflow: hidden;
}
.progress .indeterminate {
  background-color: #3f51b5;
}
.progress .indeterminate:before {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
    infinite;
  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate:after {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  -webkit-animation-delay: 1.15s;
  animation-delay: 1.15s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}

.level-enter-active,
.level-leave-active {
  transition: opacity 0.2s ease;
}

.level-enter-from,
.level-leave-to {
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: 0
}

</style>
