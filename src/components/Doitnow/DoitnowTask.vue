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
      <!-- task info/status -->
      <div class="flex items-center">
        <TaskStatus :task="task"/>
        <contenteditable
          v-model="name"
          tag="div"
          class="taskName p-0.5 ring-0 outline-none max-w-7xl mt-0.5"
          :contenteditable="task._isEditable"
          v-linkify:options="{ className: 'text-blue-600', tagName: 'a' }"
          placeholder="Введите название задачи"
          :no-nl="false"
          :no-html="false"
          :class="{ 'uppercase': !task._isEditable && colors[task.uid_marker] && colors[task.uid_marker].uppercase, 'text-gray-500': task.status == 1 || task.status == 7, 'line-through': task.status == 1 || task.status == 7, 'font-extrabold': task.readed == 0 }"
          :style="{ color: getValidForeColor(colors[task.uid_marker]?.fore_color) }"
          @focusout="clearTaskFocus(task)"
          @dblclick.stop="editTaskName(task)"
          @keydown.enter="updateTask($event, task); this.$emit('changeValue', {_isEditable: false})"
        />
        <Popper
          class="items-center"
          :class="isDark ? 'dark' : 'light'"
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
            <div class="flex flex-col">
              <!-- performer -->
              <span
                v-if="task.uid_customer === user.current_user_uid"
              >
                <TaskPropsButtonPerform
                  v-if="task.status !== 3 && task.type !== 4 && task.uid_customer === user.current_user_uid"
                  :task-type="task.type"
                  :current-user-uid="user.current_user_uid"
                  :performer-email="task.email_performer"
                  @changePerformer="onChangePerformer"
                  @reAssign="onReAssignToUser"
                />
              </span>
              <!-- date -->
              <span>
                <TaskPropsButtonSetDate
                  :name="'Назначить срок'"
                  :date-begin="task.date_begin"
                  :date-end="task.date_end"
                  :date-text="task.term_user"
                  @changeDates="onChangeDates"
                />
              </span>
              <!-- link -->
              <span
                @click="copyUrl(task)"
                class="hover:cursor-pointer hover:bg-gray-100 bg-gray-50 p-2 rounded-xl text-sm"
              >
                Ссылка
              </span>
            </div>
          </template>
        </Popper>
        <!-- <img
          class="h-[32px] w-[32px] rounded-full"
          :src="employees[task.uid_performer] ? employees[task.uid_performer].fotolink : ''"
        />
        <span
          class="py-1 px-3 rounded-lg ml-1 text-white"
          :class="task.uid_performer === user.current_user_uid ? 'bg-green-400' : 'bg-yellow-400'"
        >
          {{ employees[task.uid_performer] ? employees[task.uid_performer].name : '' }}
        </span> -->
        <!-- overdue -->
        <!-- <span
          v-if="task.is_overdue"
          class="text-white py-1 px-3 rounded-full ml-1 bg-red-400"
        >
          Просрочено
        </span> -->
        <!-- <div class="flex bg-gray-200 ml-1 px-2 rounded-full"> -->
          <!-- readed -->
          <!-- <Icon
            v-if="task.readed"
            :height="doublecheck.height"
            :width="doublecheck.width"
            :view="doublecheck.viewbox"
            :path="doublecheck.path"
          />
          <Icon
            v-if="!task.readed"
            :height="checkmark.height"
            :width="checkmark.width"
            :view="checkmark.viewbox"
            :path="checkmark.path"
          /> -->
        <!-- </div> -->
      </div>
      <!-- next -->
      <button
        class="bg-orange-500 py-1 px-3 rounded-full text-white mr-1 hover:bg-orange-600 bg-opacity-70 w-[200px]"
        @click="nextTask"
      >
        Следующая задача
      </button>
    </div>
    <div class="flex">
      <div class="flex flex-col">
        <div class="flex flex-col">
          <article class="text-sm break-all whitespace-pre-line">
            <span class="font-bold block">Заметки к задаче:</span>
            <TaskPropsCommentEditor
              :comment="task.comment"
              :can-edit="task.uid_customer === user.current_user_uid"
              @endChangeComment="endChangeComment"
              @changeComment="onChangeComment"
            />
          </article>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="flex justify-between w-full mt-3">
        <div class="flex flex-col text-sm">
          <!-- info -->
          <div class="flex flex-col">
            <div class="mb-1 flex items-center">
              <span class="p-1.5 bg-white rounded-xl border-2">Заказчик:</span><span class="bg-gray-300 p-1.5 ml-1 rounded-xl text-white">{{ employees[task.uid_customer].name }}</span>
            </div>
            <div class="mb-1 flex items-center">
              <span class="p-1.5 bg-white rounded-xl border-2">Исполнитель:</span><span class="p-1.5 ml-1 bg-green-400 text-white rounded-xl">{{ employees[task.uid_performer].name }}</span>
            </div>
            <div
              v-if="dateClear(task.date_end) !== '1.1.1'"
              class="mb-1 flex items-center"
            >
              <span class="p-1.5 bg-white rounded-xl border-2">Выполнить до:</span><span class="bg-cyan-400 text-white p-1.5 ml-1 rounded-xl"> {{ dateClear(task.date_end) }}</span>
            </div>
            <div
              v-if="task.is_overdue"
              class="mb-1 flex items-center"
            >
              <span class="p-1.5 bg-white rounded-xl border-2">Просрочено на:</span><span class="bg-red-500 ml-1 text-white p-1.5 rounded-xl">{{ plural(task) }}!</span>
            </div>
          </div>
          <!-- checklist -->
          <Checklist
            v-if="task.checklist"
            class="mt-3 checklist-custom"
            :task-uid="task.uid"
            :checklist="task.checklist"
            :isCustomer="task.uid_customer === user.current_user_uid"
            :task="task"
          />
        </div>
        <!-- accept/redo/decline/popper -->
        <div
          class="flex flex-col min-w-[200px]"
          v-if="task.uid_customer === user.current_user_uid || task.uid_performer === user.current_user_uid"
        >
          <!-- accept -->
          <button
            class="bg-green-500 py-1 px-3 rounded-xl text-white mr-1 mb-1 hover:bg-green-600"
            @click="accept"
          >
            {{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Завершить' : 'Принять и завершить задачу') : 'Готово к сдаче'}}
          </button>
          <!-- redo -->
          <button
            class="bg-red-500 py-1 px-3 rounded-xl text-white mr-1 mb-1 hover:bg-red-600"
            @click="reDo"
          >
            {{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Отменить' : 'Отправить на доработку') : 'Отклонить'}}
          </button>
          <!-- decline -->
          <button
            class="bg-indigo-400 py-1 px-3 rounded-xl text-white mr-1 mb-1 hover:bg-indigo-500"
            @click="decline"
          >
            Отложить
          </button>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col max-w-1/2 "
      :class="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? 'bg-white p-1 mt-1 rounded-lg' : ''"
    >
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
        :task="task"
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
  <!-- <div
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
          <TaskStatus :task="subTask"/>
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
         subtask chat -->
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
        />
      </div>
    </div>
  </div> -->
</template>

<script>
import { ref } from 'vue'
// import TaskListIconLabel from '@/components/TasksList/TaskListIconLabel.vue'
// import TaskListTagLabel from '@/components/TasksList/TaskListTagLabel.vue'
import { copyText } from 'vue3-clipboard'
import contenteditable from 'vue-contenteditable'
import linkify from 'vue-linkify'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import TaskPropsButtonPerform from '@/components/TaskProperties/TaskPropsButtonPerform.vue'
import Popper from 'vue3-popper'
import TaskPropsButtonSetDate from '@/components/TaskProperties/TaskPropsButtonSetDate.vue'
import Checklist from '@/components/properties/Checklist.vue'
import TaskPropsChatMessages from '@/components/TaskProperties/TaskPropsChatMessages.vue'
import TaskPropsInputForm from '@/components/TaskProperties/TaskPropsInputForm'
import TaskStatus from '@/components/TasksList/TaskStatus.vue'
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
    TaskPropsButtonPerform,
    TaskPropsButtonSetDate,
    TaskPropsChatMessages,
    TaskPropsCommentEditor,
    Checklist,
    TaskPropsInputForm,
    contenteditable,
    Popper,
    TaskStatus
  },
  directives: {
    linkify
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
    const checklistshow = ref(true)
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
    resetFocusChecklist () {
      this.checklistshow = false
    },
    endChangeComment (text) {
      this.$emit('changeValue', { comment: text })
    },
    onChangeComment (text) {
      const data = {
        uid: this.task.uid,
        value: text
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COMMENT, data)
    },
    plural (task) {
      const date = Math.floor((new Date() - new Date(task.perform_time)) / (60 * 60 * 24 * 1000))
      const dayName = date % 10 === 1 && date % 100 !== 11 ? 'день' : (((date >= 2) && (date % 10 <= 4)) && (date % 100 < 10 || date % 100 >= 20) ? 'дня' : 'дней')
      return date + ' ' + dayName
    },
    _linkify (text) {
      return text.replace(/(lt?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    },
    copyUrl (task) {
      copyText(`${window.location.origin}/task/${task.uid}`, undefined, (error, event) => {
      // copyText('lt://planning?{' + selectedTask.value.uid.toUpperCase() + '}', undefined, (error, event) => {
        if (error) {
          alert('Can not copy')
          console.log(error)
        } else {
          alert('Copied')
          console.log(event)
        }
      })
    },
    dateClear (time) {
      return new Date(time).getDate() + '.' + (new Date(time).getMonth() + 1) + '.' + new Date(time).getFullYear()
    },
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
