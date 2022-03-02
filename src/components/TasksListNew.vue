<template>
  <div
    v-if="!DONT_SHOW_CREATE_TASK_INPUT_UIDS[taskListSource.uid]"
    class="pr-4"
    :class="newConfig.leaves.length == newConfig.roots.length ? 'pl-0' : 'pl-8'"
  >
    <div
      class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 p-2"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dark:text-gray-100">
         <path d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857" stroke="#3E3D3B" stroke-width="3" stroke-linecap="round"/>
       </svg>
      </div>
      <control
        ref="root"
        v-model="createTaskText"
        @keyup.enter="createTask"
        class="w-full"
        :placeholder="'Enter task name'"
        borderless
        transparent
      />
    </div>
  </div>
  <!-- Skeleton -->
  <div
    v-if="status == 'loading'"
    class="animate-pulse flex pr-4 mt-0.5"
    :class="newConfig.leaves && newConfig.leaves.length ? 'pl-8' : 'pl-0'"
  >
    <div class="flex-col w-full">
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-10 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-40 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-10 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
      <div class="animate-pulse h-10 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl"></div>
    </div>
  </div>
  <!-- vue3-treeview -->
  <tree :nodes="storeTasks" :config="newConfig" @nodeOpened="nodeExpanding" @nodeFocus="nodeSelected" v-if="status == 'success'" class="mt-0.5">
    <template #before-input="props">
      <div
        class="task-node flex-col items-center w-full bg-white p-2 rounded-xl dark:bg-gray-900 dark:border-gray-700 border border-gray-300 my-0.5 focus:border-orange-300 focus:border-2 relative"
        :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
        :class="{ 'bg-gray-200 dark:bg-gray-900': (props.node.info.status == 1 || props.node.info.status == 7) && props.node.info.uid_marker == '00000000-0000-0000-0000-000000000000' }"
      >
        <!-- Hover task options -->
        <div
          class="absolute right-2 top-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-cetner justify-center py-2 px-3"
          :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
        >
          <Icon
            :path="subtask.path"
            class="text-gray-600 dark:text-white mr-3"
            :box="subtask.viewBox"
            :width="subtask.width"
            :height="subtask.height"
          />
          <Icon
            :path="taskoptions.path"
            class="text-gray-600 dark:text-white"
            :box="taskoptions.viewBox"
            :width="taskoptions.width"
            :height="taskoptions.height"
          />
        </div>
        <!-- Name, Status -->
        <div
          class="flex"
          :class="props.node.info.focus ? 'justify-between' : ''"
        >
          <div
            class="flex items-start"
          >
            <div
              class="border-2 border-gray-300 rounded-md mr-1 flex items-center justify-center mt-0.5"
              :class="{ 'cursor-pointer': [1, 2, 3].includes(props.node.info.type), 'cursor-not-allowed': props.node.info.type == 4 }"
              style="min-width:20px; min-height: 20px;"
            >
              <Icon
                v-if="statuses[props.node.info.status]"
                :path="statuses[props.node.info.status].path"
                :class="statusColor[props.node.info.status] ? statusColor[props.node.info.status] : 'text-gray-500 dark:text-gray-100'"
                :style="{ color: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].fore_color : '' }"
                :box="statuses[props.node.info.status].viewBox"
                :width="statuses[props.node.info.status].width"
                :height="statuses[props.node.info.status].height"
              />
            </div>
            <p
              :class="{ 'text-gray-500': props.node.info.status == 1 || props.node.info.status == 7, 'line-through': props.node.info.status == 1 || props.node.info.status == 7, 'font-extrabold': props.node.info.readed == 0 }"
              :style="{ color: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].fore_color : '' }"
            >
              {{ props.node.info.name }}
            </p>
          </div>
          <Icon
            v-if="props.node.info.focus == '1'"
            :path="taskfocus.path"
            class="text-red-600 float-right"
            :box="taskfocus.viewBox"
            :width="taskfocus.width"
            :height="taskfocus.height"
          />
        </div>
        <!-- Tags, Overdue, Customer, Performer -->
        <div
          class="flex items-center mt-1.5"
        >
          <div
            v-if="props.node.info.uid_customer != '00000000-0000-0000-0000-000000000000' && employees[props.node.info.uid_customer]"
            class="p-1 px-2 text-xs text-white bg-red-500 rounded-lg mr-1 flex items-center"
          >
            {{ employees[props.node.info.uid_customer].name }}
          </div>
          <div
            v-if="props.node.info.email_performer && employeesByEmail[props.node.info.email_performer]"
            class="p-1 px-2 text-xs text-white bg-green-500 rounded-lg mr-1 flex items-center"
          >
            <Icon
              v-if="!props.node.info.performerreaded"
              :path="performerNotRead.path"
              class="cursor-pointer text-white mr-1"
              :box="performerNotRead.viewBox"
              :width="performerNotRead.width"
              :height="performerNotRead.height"
            />
            <Icon
              v-if="props.node.info.performerreaded"
              :path="performerRead.path"
              class="cursor-pointer text-white mr-1"
              :box="performerRead.viewBox"
              :width="performerRead.width"
              :height="performerRead.height"
            />
            {{ employeesByEmail[props.node.info.email_performer].name }}
          </div>
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
          <div
            v-if="props.node.info.uid_project != '00000000-0000-0000-0000-000000000000' && projects[props.node.info.uid_project]"
            class="p-1 px-2 text-xs text-white bg-yellow-400 rounded-lg mr-1 flex items-center"
          >
            <Icon
              :path="project.path"
              class="cursor-pointer text-white mr-1"
              :box="project.viewBox"
              :width="13"
              :height="12"
            />
            {{ projects[props.node.info.uid_project].name }}
          </div>
        </div>
        <!-- Icons, Messages, Files, Data, Checklist -->
        <div
          class="flex"
        >
          <div
            v-if="props.node.info.term_customer"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="clock.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="clock.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <span class="mr-1 mt-1.5 text-sm text-gray-600 dark:text-white self-center">{{ props.node.info.term_customer }}</span>
          <div
            v-if="props.node.info.checklist"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="checklist.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="checklist.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div
            v-if="props.node.info.has_files"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="file.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="file.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div
            v-if="props.node.info.has_msgs"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="msgs.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="msgs.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div
            v-if="props.node.info.comment"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="taskcomment.path"
              class="cursor-pointer text-gray-600 dark:text-white"
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
import { computed, ref } from 'vue'
import treeview from 'vue3-treeview'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import Control from '@/components/Control.vue'

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
import project from '@/icons/project.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import improve from '@/icons/improve.js'
import clock from '@/icons/clock.js'
import subtask from '@/icons/subtask.js'
import taskoptions from '@/icons/taskoptions.js'

export default {
  components: {
    tree: treeview,
    Icon,
    Control
  },
  props: {
    storeTasks: Object,
    newConfig: Object
  },
  data () {
    const DONT_SHOW_CREATE_TASK_INPUT_UIDS = {
      '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
      '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
      'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
      '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
      '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
      'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
      '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST
    }
    const statuses = [
      undefined,
      readyStatus,
      readyStatus,
      note,
      inwork,
      readyStatus,
      pause,
      canceled,
      canceled,
      improve
    ]
    return {
      DONT_SHOW_CREATE_TASK_INPUT_UIDS,
      statuses,
      project,
      performerNotRead,
      performerRead,
      taskfocus,
      clock,
      subtask,
      taskoptions
    }
  },
  setup () {
    const store = useStore()
    const loadedTasks = computed(() => store.state.tasks.loadedTasks)
    const employees = computed(() => store.state.employees.employees)
    const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
    const taskListSource = computed(() => store.state.taskListSource)
    const projects = computed(() => store.state.projects.projects)
    const createTaskText = ref('')
    const status = computed(() => store.state.tasks.status)
    const user = computed(() => store.state.user.user)

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

    function uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }

    const createTask = () => {
      store.dispatch(
        TASK.CREATE_TASK,
        {
          uid: uuidv4(),
          uid_parent: '00000000-0000-0000-0000-000000000000',
          uid_customer: user.value.current_user_uid,
          uid_project: '00000000-0000-0000-0000-000000000000',
          email_performer: '',
          name: createTaskText.value,
          comment: ''
        }
      )
      createTaskText.value = ''
    }

    const nodeSelected = (arg) => {
      if (arg.info.readed === 0) {
        store.dispatch(TASK.CHANGE_TASK_READ, arg.info.uid)
      }
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
      status,
      tags: computed(() => store.state.tasks.tags),
      employees,
      employeesByEmail,
      projects,
      nodeExpanding,
      nodeSelected,
      createTask,
      createTaskText,
      taskListSource,
      file,
      msgs,
      user,
      taskcomment,
      checklist,
      colors: computed(() => store.state.colors.colors),
      statusColor: {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600',
        9: 'text-blue-500'
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
  font-size: 14px;
  outline: none
}

.node-wrapper:focus-within .task-node{
  @apply ring-2 ring-orange-400 border border-orange-400
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

.tree-node {
  @apply ring-0 border-0
}
</style>
