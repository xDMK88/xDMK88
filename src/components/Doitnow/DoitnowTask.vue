<template>
  <div
    class="group task-node flex-col items-center w-full bg-white p-2 rounded-lg dark:bg-gray-900 dark:border-gray-700 border border-gray-200 my-0.5 relative font-SfProTextNormal"
    :style="{ backgroundColor: backgroundColor }"
    :class="{
      'bg-gray-200 dark:bg-gray-800':
        isTaskComplete &&
        task.uid_marker == '00000000-0000-0000-0000-000000000000'
    }"
  >
    <div class="flex justify-between">
      <!-- performer info -->
      <div class="flex">
        <img
          class="h-[32px] w-[32px] rounded-full"
          :src="employees[task.uid_performer] ? employees[task.uid_performer].fotolink : ''"
        />
        <span
          class="py-1 px-3 rounded-lg ml-1 text-white"
          :class="task.uid_performer === user.current_user_uid ? 'bg-green-400' : 'bg-yellow-400'"
        >
          {{ employees[task.uid_performer] ? employees[task.uid_performer].name : '' }}
        </span>
        <!-- overdue -->
        <span
          v-if="task.is_overdue"
          class="text-white py-1 px-3 rounded-full ml-1 bg-red-400"
        >
          Просрочено
        </span>
        <div class="flex bg-gray-200 ml-1 px-2 rounded-full">
          <!-- readed -->
          <Icon
            v-if="task.readed"
            :height="doublecheck.height"
            :width="doublecheck.width"
            :view="doublecheck.viewbox"
            :path="doublecheck.path"
          />
          <!-- unread -->
          <Icon
            v-if="!task.readed"
            :height="checkmark.height"
            :width="checkmark.width"
            :view="checkmark.viewbox"
            :path="checkmark.path"
          />
        </div>
      </div>
      <!-- next -->
      <button
        class="bg-orange-500 py-1 px-3 rounded-full text-white mr-1 hover:bg-orange-600 bg-opacity-70"
        @click="nextTask"
      >
        Следующая задача
      </button>
    </div>
    <div
      class="flex"
    >
      <div
        class="flex items-center"
      >
        <!-- <div
          class="border-2 relative border-gray-300 rounded-md mr-1 flex items-center justify-center mt-0.5"
          style="min-width: 20px; min-height: 20px"
        >
          <Icon
            v-if="statuses[task.status]"
            :path="statuses[task.status].path"
            :class="statusColor"
            :style="{ color: forecolor }"
            :box="statuses[task.status].viewBox"
            :width="statuses[task.status].width"
            :height="statuses[task.status].height"
          />
          <Icon
            v-if="task.SeriesType !== 0"
            :path="repeat.path"
            class="text-blue-500 bg-white absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full"
            :box="repeat.viewBox"
            :width="repeat.width"
            :height="repeat.height"
          />
        </div> -->
        <div class="flex flex-col">
          <!-- editable task name -->
          <contenteditable
            v-model="name"
            tag="div"
            class="taskName p-0.5 ring-0 outline-none max-w-7xl"
            :contenteditable="task._isEditable"
            placeholder="Введите название задачи"
            :no-nl="true"
            :no-html="true"
            :class="{ 'uppercase': !task._isEditable && colors[task.uid_marker] && colors[task.uid_marker].uppercase, 'text-gray-500': task.status == 1 || task.status == 7, 'line-through': task.status == 1 || task.status == 7, 'font-extrabold': task.readed == 0 }"
            :style="{ color: getValidForeColor(colors[task.uid_marker]?.fore_color) }"
            @focusout="clearTaskFocus(task)"
            @dblclick.stop="editTaskName(task)"
            @keyup.enter="updateTask($event, task); this.$emit('changeValue', {_isEditable: false})"
          />
          <div v-if="task.comment.length">
            <article class="text-sm break-all">
              <span class="font-bold block">Описание задачи:</span>
              {{ task.comment }}
            </article>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags, Overdue, Customer, Performer -->
    <!-- <div
      v-if="
        task.uid_customer !== '00000000-0000-0000-0000-000000000000' ||
          task.email_performer ||
          task.is_overdue ||
          task.tags ||
          task.uid_project !== '00000000-0000-0000-0000-000000000000' ||
          task.term_customer ||
          task.checklist ||
          task.has_files ||
          task.has_msgs ||
          task.comment ||
          task.focus
      "
      class="flex items-center mt-1.5"
    > -->
      <!-- Customer -->
      <!-- <TaskListTagLabel
        v-if="task.type !== 1 && task.type !== 2"
        :text="customerName"
        :color-bg-class="{
          'bg-red-500': task.type === 3,
          'bg-gray-400': task.type !== 3,
          'bg-opacity-50': isTaskComplete
        }"
      /> -->
      <!-- Performer -->
      <!-- <TaskListTagLabel
        v-if="task.type === 2 || task.type === 4"
        :text="performerName"
        :icon-width="
          task.performerreaded ? performerRead.width : performerNotRead.width
        "
        :icon-height="
          task.performerreaded ? performerRead.height : performerNotRead.height
        "
        :icon-box="
          task.performerreaded
            ? performerRead.viewBox
            : performerNotRead.viewBox
        "
        :icon-path="
          task.performerreaded ? performerRead.path : performerNotRead.path
        "
        :color-bg-class="{
          'bg-gray-400': task.type === 4,
          'bg-green-500': task.type === 2,
          'bg-opacity-50': isTaskComplete
        }"
      /> -->
      <!-- Overdue -->
      <!-- <TaskListTagLabel
        v-if="task.is_overdue"
        text="Просрочено"
        color-text-class="text-red-600"
        color-bg-class="bg-red-300 opacity-70"
      /> -->
      <!-- Tags -->
      <!-- <template
        v-for="(tag, index) in task.tags"
        :key="index"
      >
        <TaskListTagLabel
          :icon-path="tagIcon.path"
          :icon-box="tagIcon.viewBox"
          :text="tags[tag]?.name ?? '???'"
          :color-bg-style="{ backgroundColor: tags[tag]?.back_color ?? '' }"
        />
      </template> -->
      <!-- Project -->
      <!-- <TaskListTagLabel
        v-if="task.uid_project != '00000000-0000-0000-0000-000000000000'"
        :icon-path="project.path"
        :icon-box="project.viewBox"
        :text="projects[task.uid_project]?.name ?? '???'"
        :color-bg-class="{
          'bg-yellow-400': true,
          'bg-opacity-50': isTaskComplete
        }"
      /> -->
      <!-- Data -->
      <!-- <TaskListIconLabel
        v-if="task.term_user"
        :icon-path="clock.path"
        :icon-box="clock.viewBox"
        :text="task.term_user"
      /> -->
      <!-- <TaskListIconLabel
        v-if="task.type !== 1 && task.type !== 2 && task.term_customer"
        :icon-path="clock.path"
        :icon-box="clock.viewBox"
        :text="task.term_customer"
        icon-class="text-red-600"
      /> -->
      <!-- Checklist -->
      <!-- <TaskListIconLabel
        v-if="task.checklist"
        :icon-path="checklist.path"
        :icon-box="checklist.viewBox"
        :text="checkBoxText"
      /> -->
      <!-- Access -->
      <!-- <TaskListIconLabel
        v-if="task.emails"
        :icon-path="inaccess.path"
        :icon-box="inaccess.viewBox"
        icon-width="14"
        icon-height="14"
      /> -->
      <!-- Files -->
      <!-- <TaskListIconLabel
        v-if="task.has_files"
        :icon-path="file.path"
        :icon-box="file.viewBox"
      /> -->
      <!-- Messages -->
      <!-- <TaskListIconLabel
        v-if="task.has_msgs"
        :icon-path="msgs.path"
        :icon-box="msgs.viewBox"
      /> -->
      <!-- Comment -->
      <!-- <TaskListIconLabel
        v-if="task.comment.replace(/\r?\n|\r/g, '')"
        :icon-path="taskcomment.path"
        :icon-box="taskcomment.viewBox"
      /> -->
      <!-- Focus -->
      <!-- <TaskListIconLabel
        v-if="task.focus"
        :icon-path="taskfocus.path"
        :icon-box="taskfocus.viewBox"
        icon-class="text-red-600"
      />
    </div> -->

    <!-- Buttons -->
    <div class="flex mt-3 justify-between">
      <!-- take/change date -->
      <div class="flex">
        <!-- take -->
        <TaskPropsButtonPerform
          v-if="task.status !== 3 && task.type !== 4 && task.uid_customer === user.current_user_uid"
          :task-type="task.type"
          :current-user-uid="user.current_user_uid"
          :performer-email="task.email_performer"
          @changePerformer="onChangePerformer"
          @reAssign="onReAssignToUser"
        />
        <!-- change date -->
        <TaskPropsButtonSetDate
          :date-begin="task.date_begin"
          :date-end="task.date_end"
          :date-text="task.term_user"
          @changeDates="onChangeDates"
        />
        <!-- popper menu -->
        <Popper
          arrow
          placement="bottom"
          @click.stop="toggleTaskHoverPopper(true)"
          @open:popper="toggleTaskHoverPopper(true)"
          @close:popper="toggleTaskHoverPopper(false)"
        >
          <Icon
            :path="taskoptions.path"
            class="text-gray-600 dark:text-white cursor-pointer h-full ml-1"
            :box="taskoptions.viewBox"
            :width="taskoptions.width"
            :style="{ color: 'gray' }"
            :height="taskoptions.height"
          />
          <template #content>
            <div class="flex flex-col bg-white rounded-xl p-2 border-2 items-stretch">
              <!-- Доступ -->
              <TaskPropsButtonAccess
                v-if="isAccessVisible"
                :current-user-uid="user.current_user_uid"
                :access-emails="task.emails ? task.emails.split('..') : []"
                :can-edit="task.type === 1 || task.type === 2"
                @changeAccess="onChangeAccess"
              />
              <!-- Проекты -->
              <TaskPropsButtonProject
                :selected-project="task.uid_project"
                :can-edit="task.type === 1 || task.type === 2"
                @changeProject="onChangeProject"
              />
              <!-- Цвет -->
              <TaskPropsButtonColor
                :selected-color="task.uid_marker"
                :can-edit="task.type === 1 || task.type === 2"
                @changeColor="onChangeColor"
              />
              <!-- Теги -->
              <TaskPropsButtonTags
                v-if="task.type === 1 || task.type === 2"
                :selected-tags="task.tags"
                @changeTags="onChangeTags"
              />
              <!-- Чек лист -->
              <div
                v-if="!task.checklist && task.type!==4 && task.type!==3"
                class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100"
                @click="print('Функция пока в разработке')"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 72 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.8812 36.8813L21 46.7625L17.1188 42.8813C15.9563 41.7188 14.0437 41.7188 12.8812 42.8813C11.7187 44.0438 11.7187 45.9563 12.8812 47.1188L18.8812 53.1188C19.4625 53.7 20.2313 54 21 54C21.7687 54 22.5375 53.7 23.1188 53.1188L35.1188 41.1188C36.2812 39.9563 36.2812 38.0438 35.1188 36.8813C33.9562 35.7188 32.0438 35.7 30.8812 36.8813Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    d="M30.8812 60.8813L21 70.7625L17.1188 66.8813C15.9563 65.7188 14.0437 65.7188 12.8812 66.8813C11.7187 68.0438 11.7187 69.9563 12.8812 71.1188L18.8812 77.1188C19.4625 77.7 20.2313 78 21 78C21.7687 78 22.5375 77.7 23.1188 77.1188L35.1188 65.1188C36.2812 63.9563 36.2812 62.0438 35.1188 60.8813C33.9562 59.7188 32.0438 59.7 30.8812 60.8813Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    d="M42 45C42 46.65 43.35 48 45 48H57C58.65 48 60 46.65 60 45C60 43.35 58.65 42 57 42H45C43.35 42 42 43.35 42 45Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    d="M57 66H45C43.35 66 42 67.35 42 69C42 70.65 43.35 72 45 72H57C58.65 72 60 70.65 60 69C60 67.35 58.65 66 57 66Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    d="M51 6H44.4938C43.2563 2.5125 39.9188 0 36 0C32.0812 0 28.7437 2.5125 27.5062 6H21C19.35 6 18 7.35 18 9V12H6C2.7 12 0 14.7 0 18V90C0 93.3 2.7 96 6 96H66C69.3 96 72 93.3 72 90V18C72 14.7 69.3 12 66 12H54V9C54 7.35 52.65 6 51 6ZM24 12H30C31.65 12 33 10.65 33 9C33 7.35 34.35 6 36 6C37.65 6 39 7.35 39 9C39 10.65 40.35 12 42 12H48V18H24V12ZM66 18V90H6V18H18V21C18 22.65 19.35 24 21 24H51C52.65 24 54 22.65 54 21V18H66Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </svg>
                <span class="rounded">Чек-лист</span>
              </div>
              <!-- Фокус -->
              <TaskPropsButtonFocus
                :focus="task.focus === 1"
                @toggle-focus="changeFocus(task.uid, task.focus === 1 ? 0 : 1)"
              />
            </div>
          </template>
        </Popper>
      </div>
      <!-- accept/redo/decline/popper -->
      <div
        class="flex"
        v-if="task.uid_customer === user.current_user_uid || task.uid_performer === user.current_user_uid"
      >
        <!-- accept -->
        <button
          class="bg-green-500 py-1 px-3 rounded-full text-white mr-1 hover:bg-green-600"
          @click="accept"
        >
          {{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Завершить' : 'Принять и завершить задачу') : 'Готово к сдаче'}}
        </button>
        <!-- redo -->
        <button
          class="bg-red-500 py-1 px-3 rounded-full text-white mr-1 hover:bg-red-600"
          @click="reDo"
        >
          {{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Отменить' : 'Отправить на доработку') : 'Отклонить'}}
        </button>
        <!-- decline -->
        <button
          class="bg-indigo-400 py-1 px-3 rounded-full text-white mr-1 hover:bg-indigo-500"
          @click="decline"
        >
          Отложить
        </button>
      </div>
    </div>
    <div class="flex flex-col max-w-1/2">
      <p
        v-if="taskMessages.length > 2 && !showAllMessages"
        class="text-gray-500 dark:text-gray-100 text-sm text-center cursor-pointer"
        style="border-bottom: 1px dashed; padding-bottom: 0; width: 125px; margin: 0 auto;"
        @click="scrollDown"
      >
        Show all messages
      </p>
      <!-- chat -->
      <TaskPropsChatMessages
        v-if="taskMessages?.length"
        id="content"
        class="mt-3"
        :task-messages="taskMessages"
        :current-user-uid="user.current_user_uid"
        :showAllMessages="showAllMessages"
      />
      <!-- input -->
      <TaskPropsInputForm
        :task="task"
      />
    </div>
  </div>
  <!-- subtasks -->
  <div
    v-if="subTasks.length"
    class="flex flex-col items-end"
  >
    <div
      class="group task-node flex-col items-center w-[99%] bg-white p-2 rounded-lg dark:bg-gray-900 dark:border-gray-700 border border-gray-300 my-0.5 relative font-SfProTextNormal"
      v-for="(subTask, i) in subTasks"
      :key="i - 1"
      @click="showChat"
    >
      <div class="flex flex-col">
        <div
          class="flex items-center"
        >
          <!-- <TaskStatus :task="subTask"/> -->
          <span>{{ subTask.name }}</span>
          <Icon
            @click="onClick(subTask)"
            :path="taskoptions.path"
            class="text-gray-600 dark:text-white cursor-pointer h-full ml-2"
            :box="taskoptions.viewBox"
            :width="taskoptions.width"
            :style="{ color: 'gray' }"
            :height="taskoptions.height"
          />
        </div>
        <article
          v-if="subTask.comment.length"
          class="flex flex-col break-words text-sm"
        >
          <span class="font-semibold">Описание подзадачи:</span>
          {{ subTask.comment }}
        </article>
      </div>
      <div
        class="flex flex-col max-w-1/2"
        v-if="isChatVisible"
      >
        <!-- subtask chat -->
        <!-- <TaskPropsChatMessages
          v-if="taskMessages?.length"
          id="content"
          class="mt-3"
          :task-messages="taskMessages"
          :current-user-uid="user.current_user_uid"
        /> -->
        <!-- input -->
        <!-- <TaskPropsInputForm
          :task="subTask"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
// import TaskListIconLabel from '@/components/TasksList/TaskListIconLabel.vue'
// import TaskListTagLabel from '@/components/TasksList/TaskListTagLabel.vue'
import contenteditable from 'vue-contenteditable'
import TaskPropsButtonPerform from '@/components/TaskProperties/TaskPropsButtonPerform.vue'
import TaskPropsButtonSetDate from '@/components/TaskProperties/TaskPropsButtonSetDate.vue'
import TaskPropsChatMessages from '@/components/TaskProperties/TaskPropsChatMessages.vue'
import TaskPropsInputForm from '@/components/TaskProperties/TaskPropsInputForm'
import TaskPropsButtonAccess from '@/components/TaskProperties/TaskPropsButtonAccess.vue'
import TaskPropsButtonTags from '@/components/TaskProperties/TaskPropsButtonTags.vue'
import TaskPropsButtonFocus from '@/components/TaskProperties/TaskPropsButtonFocus.vue'
import TaskPropsButtonColor from '@/components/TaskProperties/TaskPropsButtonColor.vue'
import TaskPropsButtonProject from '@/components/TaskProperties/TaskPropsButtonProject.vue'
// import TaskStatus from '@/components/TasksList/TaskStatus.vue'
import Popper from 'vue3-popper'
import Icon from '@/components/Icon.vue'

import * as TASK from '@/store/actions/tasks'

/* Icons */
import taskoptions from '@/icons/taskoptions.js'
import file from '@/icons/file.js'
import inaccess from '@/icons/inaccess.js'
import checkmark from '@/icons/checkmark.js'
import doublecheck from '@/icons/doublecheck.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import project from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import clock from '@/icons/clock.js'
// Statuses icons
import readyStatus from '@/icons/ready-status.js'
import note from '@/icons/note.js'
import inwork from '@/icons/inwork.js'
import pause from '@/icons/pause.js'
import canceled from '@/icons/canceled.js'
import improve from '@/icons/improve.js'
import repeat from '@/icons/repeat.js'
/* /Icons */

export default {
  components: {
    // TaskListIconLabel,
    // TaskListTagLabel,
    Icon,
    // TaskStatus,
    TaskPropsButtonPerform,
    TaskPropsButtonSetDate,
    TaskPropsButtonColor,
    TaskPropsButtonAccess,
    TaskPropsButtonTags,
    TaskPropsButtonFocus,
    TaskPropsButtonProject,
    TaskPropsChatMessages,
    TaskPropsInputForm,
    contenteditable,
    Popper
  },
  emits: ['clickTask', 'nextTask', 'changeValue'],
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    subTasks: {
      type: Array,
      default: () => ([])
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    tags: {
      type: Object,
      default: () => ({})
    },
    employees: {
      type: Object,
      default: () => ({})
    },
    projects: {
      type: Object,
      default: () => ({})
    },
    user: {
      type: Object,
      default: () => ({})
    },
    taskMessages: {
      type: Array,
      default: () => ([])
    }
  },
  setup (props) {
    const name = ref(props.task.name)
    const isTaskHoverPopperActive = ref(false)
    const checklistshow = ref(false)
    const toggleTaskHoverPopper = (val) => {
      isTaskHoverPopperActive.value = val
    }
    const showConfirm = ref(false)
    const showAllMessages = ref(false)
    const isChatVisible = ref(false)
    const createChecklist = () => {
      checklistshow.value = true
    }
    const statuses = [
      undefined, // we don't have 0 status
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
      isTaskHoverPopperActive,
      toggleTaskHoverPopper,
      isChatVisible,
      createChecklist,
      showConfirm,
      checklistshow,
      showAllMessages,
      taskoptions,
      statuses,
      file,
      inaccess,
      msgs,
      name,
      checkmark,
      doublecheck,
      taskcomment,
      checklist,
      project,
      tagIcon,
      performerRead,
      performerNotRead,
      taskfocus,
      clock,
      readyStatus,
      note,
      inwork,
      pause,
      canceled,
      improve,
      repeat
    }
  },
  mutations: {
    PopperState (val) {
      this.isTaskHoverPopperActive = val
    }
  },
  watch: {
    task (newval, oldval) {
      this.showAllMessages = false
      this.isChatVisible = false
      this.name = this.task.name
    }
  },
  computed: {
    isAccessVisible () {
      if (this.task.emails) return true
      if (this.task.type === 1 || this.task.type === 2) return true
      return false
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    statusColor () {
      const statusColor = {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600',
        9: 'text-blue-500'
      }
      return statusColor[this.task.status]
        ? statusColor[this.task.status]
        : 'text-gray-500 dark:text-gray-100'
    },
    performerName () {
      return this.employees[this.task.uid_performer]?.name ?? '???'
    },
    customerName () {
      return this.employees[this.task.uid_customer]?.name ?? '???'
    },
    isTaskComplete () {
      return this.task.status === 1 || this.task.status === 7
    },
    backgroundColor () {
      return this.getValidBackColor(
        this.colors[this.task.uid_marker]?.back_color
      )
    },
    checkBoxText () {
      return `${this.countChecklist(this.task.checklist).done} / ${
        this.countChecklist(this.task.checklist).undone
      }`
    },
    forecolor () {
      return this.getValidForeColor(
        this.colors[this.task.uid_marker]?.fore_color
      )
    },
    uppercase () {
      return this.colors[this.task.uid_marker]?.uppercase ?? false
    }
  },
  methods: {
    removeTask (uid) {
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      this.$store.dispatch(TASK.REMOVE_TASK, uid)
    },
    updateTask (event, task) {
      this.$store.dispatch(TASK.CHANGE_TASK_NAME, { uid: task.uid, value: this.name.replace(/\r?\n|\r/g, '') })
      if (task.name.length > 0) {
        if (task._justCreated) {
          this.$store.dispatch(TASK.CREATE_TASK, task)
        } else {
          this.$store.dispatch(TASK.CHANGE_TASK_NAME, { uid: task.uid, value: this.name })
        }
        const data = {
          _isEditing: false
        }
        this.$emit('changeValue', data)
      } else if (task.name.length === 0) {
        if (task._justCreated) {
          if (this.isPropertiesMobileExpanded) {
            this.$store.dispatch('asidePropertiesToggle', false)
          }
          this.$store.commit(TASK.REMOVE_TASK, task.uid)
        } else {
          this.showConfirm = true
          // removeTask(task.uid)
        }
      }
    },
    editTaskName (task) {
      const data = {
        _isEditable: this.user.current_user_uid === task.uid_customer
      }
      this.$emit('changeValue', data)
    },
    clearTaskFocus (task) {
      if (task.name === '') {
        this.removeTask(task.uid)
      } else if (task.name !== '' && !task.enterPress) {
        this.updateTask(event, task)
      }
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      const data = {
        _isEditing: false
      }
      this.$emit('changeValue', data)
    },
    print (message) {
      alert(message)
    },
    showChat () {
      if (!this.isChatVisible) {
        this.isChatVisible = true
      } else {
        this.isChatVisible = false
      }
    },
    scrollDown () {
      this.showAllMessages = true
      this.infoComplete = true
      setTimeout(() => {
        const elem = document.getElementById('content').lastElementChild
        elem.scrollIntoView()
      }, 200)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    countChecklist (checklist) {
      const data = { done: 0, undone: 0 }
      for (const line of checklist.split('\r\n\r\n')) {
        data.undone++
        if (+line.split('\r\n')[0] === 1) {
          data.done++
        }
      }
      return data
    },
    changeValue (value) {
      this.$emit('changeValue', value)
    },
    nextTask () {
      this.$emit('nextTask')
    },
    changeFocus (uid, value) {
      this.$store.dispatch(TASK.CHANGE_TASK_FOCUS, { uid: uid, value: value })
        .then(() => {
          const data = {
            focus: value
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeAccess (checkEmails) {
      const emails = checkEmails.join('..')
      const data = {
        uid: this.task.uid,
        value: emails
      }
      this.$store.dispatch(TASK.CHANGE_TASK_ACCESS, data)
        .then((resp) => {
          const data = {
            emails: emails
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeProject (projectUid) {
      const data = {
        uid: this.task.uid,
        value: projectUid
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PROJECT, data)
        .then((resp) => {
          const data = {
            uid_project: projectUid
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeColor (colorUid) {
      const data = {
        uid: this.task.uid,
        value: colorUid
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COLOR, data)
        .then((resp) => {
          const data = {
            uid_marker: colorUid
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeTags (tags) {
      const data = {
        uid: this.task.uid,
        tags: tags
      }
      this.$store.dispatch(TASK.CHANGE_TASK_TAGS, data)
        .then((resp) => {
          const data = {
            tags: [...tags]
          }
          this.$emit('changeValue', data)
        })
    },
    onClick (task) {
      this.$emit('clickTask', task)
    },
    reDo () {
      if (this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: this.task.uid, value: 7 })
      }
      if (this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer !== this.user.current_user_uid) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: this.task.uid, value: 8 })
      }
      if (this.task.uid_performer !== this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: this.task.uid, value: 8 })
      }
      this.nextTask()
    },
    accept () {
      if ((this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) ||
      (this.task.uid_performer !== this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid)) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: this.task.uid, value: 1 })
      } else {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: this.task.uid, value: 5 })
      }
      this.nextTask()
    },
    decline () {
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: this.task.uid, value: 6 })
      this.nextTask()
    },
    onReAssignToUser: function (userEmail) {
      console.log('onReAssignToUser', userEmail)
      console.log('onReAssignToUser is not resolved')
      const data = {
        uid: this.task.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_REDELEGATE, data)
        .then(
          resp => {
            console.log(resp.data)
            this.$store.commit(TASK.SUBTASKS_REQUEST, resp.data)
          }
        )
    },
    onChangePerformer: function (userEmail) {
      console.log('onChangePerformer', userEmail)
      const user = this.$store.state.user.user
      const taskUid = this.task.uid
      const data = {
        uid: this.task.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, data)
        .then(
          resp => {
            const data = {
              email_performer: resp.data.email_performer,
              perform_time: resp.data.perform_time,
              performerreaded: resp.data.performerreaded,
              uid_performer: resp.data.uid_performer,
              type: resp.data.type
            }
            this.changeValue(data)
            // this.selectedTask.email_performer = resp.data.email_performer
            // this.selectedTask.perform_time = resp.data.perform_time
            // this.selectedTask.performerreaded = resp.data.performerreaded
            // this.selectedTask.uid_performer = resp.data.uid_performer
            // this.selectedTask.type = resp.data.type
          }
        )
      if (user.current_user_email !== userEmail) {
        this.$store.commit(TASK.REMOVE_TASK, taskUid)
        this.$store.dispatch('asidePropertiesToggle', false)
      }
    },
    onChangeDates: function (begin, end) {
      const data = {
        uid_task: this.task.uid,
        str_date_begin: begin,
        str_date_end: end,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data)
        .then(
          resp => {
            const data = {
              term_user: resp.term,
              date_begin: resp.str_date_begin,
              date_end: resp.str_date_end
            }
            this.$emit('changeValue', data)
            // this.selectedTask.term_user = resp.term
            // this.selectedTask.date_begin = resp.str_date_begin
            // this.selectedTask.date_end = resp.str_date_end
          })
    }
  }
}
</script>

<style scoped>
</style>
