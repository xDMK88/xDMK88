<template>
<div
  class="bg-white py-6 px-5 rounded-lg flex justify-between"
  :style="{ backgroundColor: backgroundColor }"
  :class="{
    'bg-gray-200 dark:bg-gray-800':
      isTaskComplete &&
      task.uid_marker == '00000000-0000-0000-0000-000000000000'
  }"
>
  <div class="w-1/2">
    <div class="flex justify-between items-center">
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
          :class="{ 'uppercase': !task._isEditable && colors[task.uid_marker] && colors[task.uid_marker].uppercase, 'text-gray-500': task.status == 1 || task.status == 7, 'line-through': task.status == 1 || task.status == 7 }"
          :style="{ color: getValidForeColor(colors[task.uid_marker]?.fore_color) }"
          @focusout="clearTaskFocus(task)"
          @dblclick.stop="editTaskName(task)"
          @keydown.enter="updateTask($event, task); this.$emit('changeValue', {_isEditable: false})"
        />
      </div>
      <Popper
        class="items-center"
        :class="isDark ? 'dark' : 'light'"
        placement="bottom"
        @click.stop="toggleTaskHoverPopper(true)"
        @open:popper="toggleTaskHoverPopper(true)"
        @close:popper="toggleTaskHoverPopper(false)"
      >
        <Icon
          :path="dots.path"
          class="text-gray-600 dark:text-white cursor-pointer ml-1"
          :box="dots.viewBox"
          :width="dots.width"
          :style="{ color: 'gray' }"
          :height="dots.height"
        />
        <template #content>
          <div class="flex flex-col">
            <!-- performer -->
            <span
              v-if="task.uid_customer === user.current_user_uid"
            >
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
    </div>
    <div class="flex text-sm">
      <div class="flex flex-col text-gray-500 justify-between">
        <!-- customer -->
        <div class="flex mb-2">
          <span>Заказчик:</span>
          <img
            :src="employees[task.uid_customer] ? employees[task.uid_customer].fotolink : ''"
            class="rounded-lg ml-1 h-[20px] w-[20px]"
          />
          <span class="ml-1 text-black font-medium">{{ employees[task.uid_customer].name }}</span>
        </div>
        <!-- performer -->
        <div class="flex mb-2">
          Исполнитель:
          <img
            :src="employees[task.uid_performer] ? employees[task.uid_performer].fotolink : ''"
            class="rounded-lg ml-1 h-[20px] w-[20px]"
          />
          <span class="ml-1 text-black font-medium">{{ employees[task.uid_performer].name }}</span>
        </div>
        <!-- days -->
        <div class="flex mb-2" v-show="dateClear(task.date_end) !== '1.1.1'">
          Выполнить до: <span class="ml-1 text-black font-medium">{{ dateClear(task.date_end) }}</span>
        </div>
        <div
          class="mb-2"
          v-show="typeof plural === 'string' && task.date_end !== '0001-01-01T00:00:00'"
        >
          Просрочено: <span class="text-red-500 font-medium">{{ plural }}</span>
        </div>
      </div>
    </div>
    <TaskPropsCommentEditor
      class="border-2 border-gray-300 p-2 rounded-lg"
      :comment="task.comment"
      :can-edit="task.uid_customer === user.current_user_uid"
      @endChangeComment="endChangeComment"
      @changeComment="onChangeComment"
    />
    <Checklist
      v-if="task.checklist"
      class="mt-3 checklist-custom text-sm font-medium"
      :task-uid="task.uid"
      :checklist="task.checklist"
      :isCustomer="task.uid_customer === user.current_user_uid"
      :task="task"
    />
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
  <!-- accept/redo/decline -->
  <div>
    <div
      class="flex flex-col min-w-[200px]"
      v-if="task.uid_customer === user.current_user_uid || task.uid_performer === user.current_user_uid"
    >
      <!-- accept -->
      <button
        class="flex items-center justify-center text-sm bg-white hover:bg-green-100 hover:bg-opacity-90 font-medium border-green-400 h-[40px] w-[250px] rounded-lg border-2 text-green-500 hover:text-black mb-2"
        @click="accept"
      >
        {{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Завершить' : 'Принять и завершить задачу') : 'Готово к сдаче'}}
        <Icon
          :path="check.path"
          :width="check.width"
          :height="check.height"
          :box="check.viewBox"
          class="ml-2"
        />
      </button>
      <!-- redo -->
      <button
        class="flex items-center justify-center text-sm bg-gray-200 hover:bg-red-200 hover:border-2 hover:border-gray-500 hover:bg-opacity-90 font-medium h-[40px] w-[250px] rounded-lg hover:text-red-500 mb-2"
        @click="reDo"
      >
        {{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Отменить' : 'Отправить на доработку') : 'Отклонить'}}
        <Icon
          :path="close.path"
          :width="close.width"
          :height="close.height"
          :box="close.viewBox"
          class="ml-2"
        />
      </button>
      <!-- decline -->
      <button
        class="flex items-center justify-center text-sm bg-gray-200 hover:bg-gray-300 hover:border-2 hover:border-gray-500 hover:bg-opacity-90 font-medium h-[40px] w-[250px] rounded-lg mb-2"
        @click="decline"
      >
        Отложить
        <Icon
          :path="pauseD.path"
          :width="pauseD.width"
          :height="pauseD.height"
          :box="pauseD.viewBox"
          class="ml-2"
        />
      </button>
      <PerformButton
        v-if="task.status !== 3 && task.type !== 4 && task.uid_customer === user.current_user_uid"
        :task-type="task.type"
        :current-user-uid="user.current_user_uid"
        :performer-email="task.email_performer"
        @changePerformer="onChangePerformer"
        @reAssign="onReAssignToUser"
      />
    </div>
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
import PerformButton from '@/components/Doitnow/PerformButton.vue'
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
import doublecheck from '@/icons/doublecheck.js'
import close from '@/icons/doitnow/close.js'
import dots from '@/icons/doitnow/dots.js'
import pauseD from '@/icons/doitnow/pause.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import project from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import check from '@/icons/doitnow/check.js'
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
    TaskPropsButtonSetDate,
    TaskPropsChatMessages,
    TaskPropsCommentEditor,
    PerformButton,
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
      close,
      statuses,
      file,
      dots,
      pause,
      inaccess,
      msgs,
      name,
      pauseD,
      check,
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
    },
    plural () {
      const date = Math.floor((new Date() - new Date(this.task.date_end)) / (60 * 60 * 24 * 1000))
      const dayName = date % 10 === 1 && date % 100 !== 11 ? 'день' : (((date >= 2) && (date % 10 <= 4)) && (date % 100 < 10 || date % 100 >= 20) ? 'дня' : 'дней')
      if (date < 0) {
        return date
      } else if (date === 0) {
        return '1 день'
      } else {
        return date + ' ' + dayName
      }
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
