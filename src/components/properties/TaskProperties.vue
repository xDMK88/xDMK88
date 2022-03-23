<script>
import Popper from 'vue3-popper'
import { computed, ref } from 'vue'
import { DatePicker } from 'v-calendar'
import { useStore } from 'vuex'
import TreeItem from '@/components/TreeItem.vue'
import close from '@/icons/close.js'
import TreeTagsItem from '@/components/TreeTagsItem.vue'
import { CREATE_MESSAGE_REQUEST } from '@/store/actions/taskmessages'
import { CREATE_FILES_REQUEST, GETFILES } from '@/store/actions/taskfiles'
import * as TASK from '@/store/actions/tasks'
export default {
  components: {
    DatePicker,
    TreeItem,
    TreeTagsItem,
    Popper
  },
  filters: {
    shorten: (val, words = 2) => val.split(' ').slice(0, words).join(' ')
  },
  props: {
    selectTags: Array
  },
  data () {
    const store = useStore()
    const taskMessages = computed(() => store.state.taskmessages.messages)
    const taskFiles = computed(() => store.state.taskfiles.files)
    const myFiles = computed(() => store.state.taskfiles.files.myFiles)
    const selectedTask = computed(() => store.state.tasks.selectedTask)
    const user = computed(() => store.state.user.user)
    const navigator = computed(() => store.state.navigator.navigator)
    const tasks = computed(() => store.state.tasks.newtasks)
    const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
    const isDark = computed(() => store.state.darkMode)
    const getfiles = computed(() => store.state.taskfiles.file)
    //  const test2 = toRef(this.props, 'selectTags')
    const closeProperties = () => {
      store.dispatch('asidePropertiesToggle', false)
    }
    const taskMsg = ref('')
    // TODO: we use these functions at 2 components
    // should move them to data helpers or to the store module
    const pad2 = (n) => {
      return (n < 10 ? '0' : '') + n
    }
    const getTodaysDate = (val = null) => {
      if (val == null) {
        val = new Date()
      }
      const month = pad2(val.getMonth() + 1)
      const day = pad2(val.getDate())
      const year = pad2(val.getFullYear())
      const hours = pad2(val.getHours())
      const minutes = pad2(val.getMinutes())
      const seconds = pad2(val.getSeconds())
      return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
    }

    function uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
    function emailtomass (emails) {
      emails += '..' + emails
      console.log(emails)
      return emails
    }
    const changeEmployee = (uid, email) => {
      store.dispatch(TASK.CHANGE_TASK_PERFORMER, { uid: uid, value: email }).then(
        resp => {
          selectedTask.value.email_performer = email
        }
      )
    }
    const ClickAccessEmail = () => {
      const emails = this.checkEmail.join('..')
      store.dispatch(TASK.CHANGE_TASK_ACCESS, { uid: selectedTask.value.uid, value: emails }).then(
        resp => {
          selectedTask.value.emails = emails
        }
      )
      this.popoverShowAccess = false
    }
    const changeColors = (uid, marker) => {
      store.dispatch(TASK.CHANGE_TASK_COLOR, { uid: uid, value: marker }).then(
        resp => {
          selectedTask.value.uid_marker = marker
        }
      )
    }
    const changeFocus = (uid, value) => {
      selectedTask.value.focus = value
      store.dispatch(TASK.CHANGE_TASK_FOCUS, { uid: uid, value: value }).then(
        resp => {
          selectedTask.value.focus = value
        })
    }
    const changeCheck = (uid, value) => {
      store.dispatch(TASK.CHANGE_TASK_CHEKCLIST, { uid: uid, value: value }).then(
        resp => {
          selectedTask.value.checklist = value
        })
    }
    const ClickTagsChange = () => {
      console.log(selectedTask.value.tags)
      const data = {
        uid: selectedTask.value.uid,
        tags: selectedTask.value.tags
      }
      store.dispatch(TASK.CHANGE_TASK_TAGS, data)
    }
    const changetags = (uid, tags) => {
      const data = {
        uid: uid,
        tags: tags
      }
      store.dispatch(TASK.CHANGE_TASK_TAGS, data)
    }
    const createTaskFile = (event) => {
      const data = {
        uid_task: selectedTask.value.uid,
        name: event.target.files[0]
      }
      store.dispatch(CREATE_FILES_REQUEST, data).then(
        resp => {
          taskFiles.value.uid = data.uid_task
        })
    }
    const changeComment = (comment, event) => {
      const data = {
        uid: selectedTask.value.uid,
        value: comment
      }
      store.dispatch(TASK.CHANGE_TASK_COMMENT, data).then(
        resp => {
          selectedTask.value.comment = comment
        })
      event.target.value = comment
    }
    const unchecked = () => {

    }
    const createTaskMsg = () => {
      const data = {
        uid_task: selectedTask.value.uid,
        uid_creator: user.value.current_user_uid,
        uid_msg: uuidv4(),
        date_create: getTodaysDate(),
        text: taskMsg.value,
        msg: taskMsg.value
      }
      store.dispatch(CREATE_MESSAGE_REQUEST, data)
      taskMsg.value = ''
    }
    const changeName = (name, event) => {
      const data = {
        uid: selectedTask.value.uid,
        value: name
      }
      store.dispatch(TASK.CHANGE_TASK_NAME, data).then(
        resp => {
          selectedTask.value.name = name
        })
      event.target.value = name
    }
    const resetProject = () => {
      store.dispatch(TASK.CHANGE_TASK_PROJECT, { uid: selectedTask.value.uid, value: '00000000-0000-0000-0000-000000000000' }).then(
        resp => {
          selectedTask.value.uid_project = '00000000-0000-0000-0000-000000000000'
        }
      )
    }
    const resetColor = () => {
      store.dispatch(TASK.CHANGE_TASK_COLOR, { uid: selectedTask.value.uid, value: '00000000-0000-0000-0000-000000000000' }).then(
        resp => {
          selectedTask.value.uid_marker = '00000000-0000-0000-0000-000000000000'
        }
      )
    }
    const resetTags = (key) => {
      selectedTask.value.tags.push(key)
      store.dispatch(TASK.CHANGE_TASK_TAGS, { uid: selectedTask.value.uid, value: selectedTask.value.tags }).then(
        resp => {
          selectedTask.value.tags = key
        }
      )
    }
    const resetAccess = () => {
      store.dispatch(TASK.CHANGE_TASK_ACCESS, { uid: selectedTask.value.uid, value: '' }).then(
        resp => {
          selectedTask.value.emails = ''
        }
      )
    }
    const resetEmployes = () => {
      store.dispatch(TASK.CHANGE_TASK_PERFORMER, { uid: selectedTask.value.uid, value: '' }).then(
        resp => {
          selectedTask.value.email_performer = ''
        }
      )
    }
    const resetCalendar = () => {
      console.log(new Date(this.range.start).toLocaleDateString())
      console.log(new Date(this.range.start).toLocaleTimeString() + '-' + new Date(this.range.end).toLocaleTimeString())
      const data = {
        uid: selectedTask.value.uid,
        str_date_begin: '0001-01-01',
        str_date_end: '0001-01-01',
        str_time_begin: '00:00:00',
        str_time_end: '00:00:00',
        reset: 0
      }
      store.dispatch(TASK.CHANGE_TASK_DATE, data).then(
        resp => {
          selectedTask.value.customer_date_begin = new Date(this.range.start)
          selectedTask.value.customer_date_end = new Date(this.range.end)
        })
    }
    const getImgUrl = (uid, extension, filename) => {
      store.dispatch(GETFILES, uid).then(resp => {
        const fileURL = window.URL.createObjectURL(new Blob([resp.data]))
        var myImage = new Image()
        myImage.src = fileURL
        document.getElementById(uid).appendChild(myImage)
        document.getElementById(uid).setAttribute('href', fileURL)
        document.getElementById(uid).setAttribute('download', filename + '.' + extension)
        return myImage
      })
    }
    const getAudioUrl = (uid, extension, filename) => {
      store.dispatch(GETFILES, uid).then(resp => {
        const fileURL = window.URL.createObjectURL(new Blob([resp.data], { type: 'text/plain' }))
        var myAudio = new Audio()
        myAudio.src = fileURL
        document.getElementById(uid).appendChild(myAudio)
        document.getElementById(uid).setAttribute('src', fileURL)
        document.getElementById(uid).setAttribute('download', filename + '.' + extension)
        return myAudio
      })
    }
    const getDocUrl = (uid, extension, filename) => {
      store.dispatch(GETFILES, uid).then(resp => {
        const fileURL = window.URL.createObjectURL(new Blob([resp.data], { type: 'text/plain' }))
        var myDoc = new Document()
        myDoc.src = fileURL
        document.getElementById(uid).appendChild(myDoc)
        document.getElementById(uid).setAttribute('href', fileURL)
        document.getElementById(uid).setAttribute('download', filename + '.' + extension)
        return myDoc
      })
    }
    const getMovUrl = (uid, extension, filename) => {
      store.dispatch(GETFILES, uid).then(resp => {
        const fileURL = window.URL.createObjectURL(new Blob([resp.data], { type: 'text/plain' }))
        document.getElementById(uid).setAttribute('href', fileURL)
        document.getElementById(uid).setAttribute('download', filename + '.' + extension)
        return fileURL
      })
    }
    const getAnyUrl = (uid, extension, filename) => {
      store.dispatch(GETFILES, uid).then(resp => {
        const fileURL = window.URL.createObjectURL(new Blob([resp.data], { type: 'text/plain' }))
        document.getElementById(uid).setAttribute('href', fileURL)
        document.getElementById(uid).setAttribute('download', filename + '.' + extension)
        return fileURL
      })
    }
    const handleInput = () => {
      console.log(new Date(this.range.start).toLocaleDateString())
      console.log(new Date(this.range.start).toLocaleTimeString() + '-' + new Date(this.range.end).toLocaleTimeString())
      const data = {
        uid: selectedTask.value.uid,
        str_date_begin: new Date(this.range.start).toLocaleDateString(),
        str_date_end: new Date(this.range.end).toLocaleDateString(),
        str_time_begin: new Date(this.range.start).toLocaleTimeString(),
        str_time_end: new Date(this.range.end).toLocaleTimeString(),
        reset: 0
      }
      store.dispatch(TASK.CHANGE_TASK_DATE, data).then(
        resp => {
          selectedTask.value.customer_date_begin = new Date(this.range.start)
          selectedTask.value.customer_date_end = new Date(this.range.end)
        })
    }
    const showHide = () => {
      for (var i = 0; i < taskMessages.value.length; i++) {
        document.getElementById('hidden_' + i).style.display = 'block'
      }
      for (var n = 0; n < taskFiles.value.length; n++) {
        document.getElementById('hidden_' + n).style.display = 'block'
      }
      document.getElementById('showall').style.display = 'none'
    }
    const hide = () => {
      for (var i = taskMessages.value.length; i > 1; i--) {
        document.getElementById('hidden_' + i).style.display = 'none'
      }
      for (var n = taskFiles.value.length; n > 1; n--) {
        document.getElementById('hidden_' + n).style.display = 'none'
      }
    }
    return {
      hide,
      getAnyUrl,
      getAudioUrl,
      getMovUrl,
      getDocUrl,
      showHide,
      isDark,
      unchecked,
      changeName,
      createTaskMsg,
      createTaskFile,
      closeProperties,
      ClickAccessEmail,
      changetags,
      ClickTagsChange,
      emailtomass,
      changeColors,
      changeEmployee,
      changeFocus,
      changeCheck,
      changeComment,
      handleInput,
      resetProject,
      resetColor,
      resetTags,
      resetAccess,
      resetEmployes,
      resetCalendar,
      getImgUrl,
      getfiles: getfiles,
      checkEmail: selectedTask.value.emails.split('..'),
      close,
      file: '',
      taskMsg,
      anymenuShow: false,
      isFullScreen: computed(() => store.state.isFullScreen),
      isPropertiesMobileExpanded: computed(() => store.state.isPropertiesMobileExpanded),
      isAsideLgActive: computed(() => store.state.isAsideLgActive),
      selectedTask,
      taskMessages,
      taskFiles: taskFiles,
      myFiles: myFiles,
      tasks: tasks,
      navigator: navigator,
      employeesByEmail: employeesByEmail,
      tags: computed(() => store.state.tasks.tags),
      employees: computed(() => store.state.employees.employees),
      projects: computed(() => store.state.projects.projects),
      localization: computed(() => store.state.localization.localization),
      colors: computed(() => store.state.colors.colors),
      mycolors: computed(() => store.state.colors.mycolors),
      cusers: computed(() => store.state.user.user),
      newArray: taskMessages.value.concat(taskFiles.value),
      months: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
      day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      firstcount: ['последний', 'первый', 'второй', 'третий', 'четвертый', 'последний'],
      myday: ['вчера', 'cегодня', 'завтра'],
      statuses: [
        'status_not_begin',
        'status_ready',
        'task_by_link',
        'status_note',
        'status_in_work',
        'status_task_ready',
        'status_paused',
        'status_cancelled',
        'status_reject',
        'status_refine'
      ],
      remi: {
        date: new Date(),
        timezone: 'Europe/Moscow'
      },
      replay: {
        date: new Date(),
        timezone: 'Europe/Moscow'
      },
      range: [],
      masks: {
        input: 'D MMM',
        weekdays: 'WW'
      },
      modelConfig: {
        type: 'string',
        mask: 'D MMM' // Uses 'iso' if missing
      },
      firstDayOfWeek: 2,
      mode: 'single',
      selected: {},
      isOpen: false,
      activeTab: '',
      tabs: [],
      isActive: false
    }
  },
  mounted () {
    this.$refs.comment.style.minHeight = this.$refs.comment.scrollHeight + 'px'
    this.$refs.nameTask.style.minHeight = this.$refs.nameTask.scrollHeight + 'px'
    this.hide()
  },
  methods: {
    activate (tab) {
      this.activeTab = tab.name
      this.$emit('activateTab', tab.name)
    },
    formatBytes: function (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    tabfunction: function (tab) {
      this.isActive = tab
    },
    textareaResize () {
      this.$refs.comment.style.minHeight = this.$refs.comment.scrollHeight + 'px'
      this.$refs.nameTask.style.minHeight = this.$refs.nameTask.scrollHeight + 'px'
    },
    extension: function (filename) {
      let ext = 'не определилось'
      const parts = filename.value.split('.')
      if (parts.length > 1) ext = parts.pop()
      document.getElementById('e-fileinfo').innerHTML = [
        'Размер файла: ' + filename.size + ' B',
        'Расширение: ' + ext,
        'MIME тип: ' + filename.type
      ].join('<br>')
    }
  }
}
</script>
<template>
  <div class="break-words">
    <div class="column-resize">
      <div />
      <div
        v-if="selectedTask.uid_parent!=='00000000-0000-0000-0000-000000000000' && selectedTask.has_children===false"
        class="user_customer_custom"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 14.3125C12 13.9328 11.6922 13.625 11.3125 13.625H7.5L7.5 5.5H9.99877C10.1795 5.5 10.2675 5.27934 10.1365 5.15494L6.8125 2L3.8194 5.16252C3.69873 5.29002 3.78912 5.5 3.96466 5.5H6.125L6.125 15H11.3125C11.6922 15 12 14.6922 12 14.3125Z"
            fill="#7F7F80"
          />
        </svg>
        <a
          href="#"
          class="parent-name"
        >{{ tasks[selectedTask.uid_parent].info.name }}</a>
        <div
          v-if="selectedTask.focus===1"
          class="infocus-task"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 44 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.47887 0H41.5211C42.8845 0 44 1.1195 44 2.48777V57.0416C44 58.0782 43.339 59.0318 42.3681 59.3843C42.0995 59.4879 41.8103 59.5294 41.5211 59.5294C40.7775 59.5294 40.0958 59.1977 39.6207 58.638L22 41.1088L4.37934 58.638C3.90423 59.1977 3.20188 59.5294 2.47887 59.5294C2.18967 59.5294 1.90047 59.4879 1.63192 59.3843C0.661033 59.0111 0 58.0782 0 57.0416V2.48777C0 1.1195 1.11549 0 2.47887 0ZM21.5922 11.4076C19.5672 11.4076 17.9255 13.0492 17.9255 15.0743C17.9255 17.0993 19.5672 18.7409 21.5922 18.7409C23.6173 18.7409 25.2589 17.0993 25.2589 15.0743C25.2589 13.0492 23.6173 11.4076 21.5922 11.4076Z"
              fill="#F2543F"
            />
          </svg>
        </div>
      </div>
      <div class="user_child_customer_custom">
        <strong><textarea
          ref="nameTask"
          :value="selectedTask.name"
          class="form-control taskName-custom"
          @keyup.enter="changeName($refs.nameTask.value, $event)"
          @input="textareaResize"
        /></strong>
      </div>
      <!--   <p class="mt-3"><strong>{{ localization.task_created }}:</strong> {{ selectedTask.date_create }}</p>
      <p><strong>Исполнитель:</strong> {{ selectedTask.email_performer }}</p>-->
      <p style="display: none">
        {{ selectedTask.status }}
        <strong>{{ localization.gc_status }}: </strong> {{ localization[statuses[selectedTask.status]] }}
      </p>
      <!--   <p v-if="selectedTask.plan"><strong>План:</strong> {{ selectedTask.plan }}</p>
      <p v-if="selectedTask.email"><strong>Задача открыта для:</strong> {{ selectedTask.email }}</p>
      <p><strong>Задачу создал:</strong> {{ selectedTask.customer_name }}</p>-->
      <div
        class="mt-3 custom-list-tags"
      >
        <!-- Всплывающее окно сотрудник -->
        <Popper
          class="popper-employees"
          arrow
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
            <span v-if="selectedTask.status!==3">
            <!-- <p class="text-center">{{ localization.Labels }}</p>-->
            <button
              v-if="selectedTask.type===1"
              ref="btnRefEmployee"
              class="mt-3 tags-custom active"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
                  fill="white"
                  fill-opacity="1"
                />
              </svg>
              <span
                class="rounded"
              >Поручить</span>
            </button>
            <button
              v-else-if="selectedTask.type===2"
              ref="btnRefEmployee"
              class="mt-3 tags-custom"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
                  fill="#86D69D"
                  fill-opacity="1"
                />
              </svg>
              <span>{{ selectedTask.email_performer }}</span>
            </button>
            <button
              v-else-if="selectedTask.type===3"
              ref="btnRefEmployee"
              class="mt-3 tags-custom active"
            >

              <svg
                width="24"
                height="24"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
                  fill="white"
                  fill-opacity="1"
                />
              </svg>
              <span
                class="rounded"
              >Перепоручить</span>
            </button>
            <button
              v-else-if="selectedTask.type===4"
              ref="btnRefEmployee"
              class="mt-3 tags-custom active"
            >

              <svg
                width="24"
                height="24"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
                  fill="white"
                  fill-opacity="1"
                />
              </svg>
              <span
                class="rounded"
              >Взять на исполнение</span>
            </button>
          </span>
          <template
            #content="{ employee }"
            class="bottom"
          >

            <div class="popper">
              <button @click="employee"></button>
              <div class="text-white body-popover-custom">
                <div class="container-employee-popover">
                  <form>
                    <div
                      v-for="(key,value) in employees"
                      :key="value"
                    >
                      <div
                        class="list-employee-access"
                        @click="changeEmployee(selectedTask.uid, key.email)"
                      >
                        <img
                          :src="key.fotolink"
                          class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                          width="30"
                          height="30"
                        >
                        <label class="employee-name-custom">
                          {{ key.name }}
                          <div class="popover-employee-email">{{ key.email }}</div>
                        </label>
                        <input
                          type="radio"
                          name="check_so_employee"
                          class="check-custom-empployee"
                          :checked="selectedTask.email_performer!=='' && selectedTask.email_performer===key.email"
                          @click="unchecked"
                          @change="changeEmployee(selectedTask.uid, key.email)"
                        >
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </template>
        </Popper>
        <!-- Всплывающее окно доступ -->
        <Popper
          class="popper-access"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div class="text-white opacity-75 font-semibold title-popover-main">
                <div @click="close"></div>
                <button
                  class="btn-clear-popover"
                  @change="resetAccess"
                >
                  Отменить
                </button>
                <button class="btn-save-popover">
                  <span
                    class="title-z-popover"
                    @click="ClickAccessEmail"
                  >Применить</span>
                </button>
              </div>
              <div class="text-white">
                <div class="container-employee-popover">
                  <form>
                    <div
                      v-for="(key,value, index) in employees"
                      :key="index"
                    >
                      <div class="list-employee-access">
                        <img
                          :src="key.fotolink"
                          class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                          width="30"
                          height="30"
                        >
                        <label class="employee-name-custom">

                          <div class="popover-employee-email"><div style="color: black;">{{ key.name }}</div>{{ key.email }}</div>
                        </label>
                        <input
                          v-model="checkEmail"
                          type="checkbox"
                          name="check_access_employee"
                          :value="key.email"
                          class="check-custom-empployee"
                          :checked="selectedTask.emails.split('..').filter(email=>email===key.email)[0]===key.email"
                        >
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </template>
          <a
            v-if="selectedTask.emails!=='' && selectedTask.emails!=='null'"
            ref="btnRef"
            style="position: relative"
          >
            <div
              v-for="(key,value) in selectedTask.emails.split('..')"
              :key="value"
              :class=" key !=='null' ? 'mt-3 tags-custom' : ''"
            >
              <svg v-if="key!=='null'"
                width="24"
                height="24"
                viewBox="0 0 91 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M73.9839 48.8864C73.9839 50.6954 72.5056 52.1754 70.6989 52.1754C68.8921 52.1754 67.4139 50.6954 67.4139 48.8864V44.4723C67.4139 40.8379 64.4738 37.8943 60.8439 37.8943H13.5399C9.90998 37.8943 6.9699 40.8379 6.9699 44.4723V78.7765C6.9699 82.4109 9.90998 85.3545 13.5399 85.3545H46.2096C48.026 85.3545 49.4986 86.827 49.4986 88.6435C49.4986 90.4599 48.026 91.9324 46.2096 91.9324H13.5399C6.29648 91.9324 0.399902 86.0287 0.399902 78.7765V44.4723C0.399902 37.2201 6.29648 31.3164 13.5399 31.3164H17.4819V19.7227C17.4819 9.06645 26.335 0.400002 37.1919 0.400002C48.0488 0.400002 56.9019 9.06645 56.9019 19.7227V31.3164H60.8439C68.0873 31.3164 73.9839 37.2201 73.9839 44.4723V48.8864ZM50.3319 31.3164H24.0519V19.7227C24.0519 12.7008 29.9485 6.97795 37.1919 6.97795C44.4353 6.97795 50.3319 12.7008 50.3319 19.7227V31.3164ZM39.6617 74.5013C39.2039 72.1608 37.9572 70.1461 36.2429 68.7334C35.9442 68.4873 35.8725 68.0521 36.0635 67.7155C38.5384 63.3546 35.4507 57.5131 30.3371 57.5369C25.2466 57.5131 22.1379 63.3545 24.6108 67.7154C24.8018 68.0521 24.7301 68.4873 24.4312 68.7331C22.713 70.1458 21.4486 72.1606 21.0126 74.5013L20.0665 79.3638C19.9824 79.796 20.3133 80.1975 20.7536 80.1975H39.9207C40.3609 80.1975 40.6919 79.796 40.6078 79.3638L39.6617 74.5013ZM28.1445 64.3525C28.1445 63.1087 29.1324 62.0889 30.3371 62.0889C33.2526 62.2133 33.2526 66.4917 30.3371 66.616C29.1324 66.616 28.1445 65.5962 28.1445 64.3525ZM26.0807 75.6703C25.6477 75.6703 25.3161 75.2764 25.4414 74.8619C26.9349 69.9202 33.7153 69.9202 35.2088 74.8619C35.334 75.2764 35.0024 75.6703 34.5695 75.6703H26.0807ZM64.4788 74.5013C64.021 72.1608 62.7743 70.1461 61.06 68.7334C60.7613 68.4873 60.6896 68.0521 60.8806 67.7155C63.3555 63.3546 60.2678 57.5131 55.1542 57.5369C50.0637 57.5131 46.955 63.3545 49.4279 67.7154C49.6189 68.0521 49.5472 68.4873 49.2483 68.7331C47.5301 70.1458 46.2657 72.1606 45.8297 74.5013L44.8836 79.3638C44.7995 79.796 45.1304 80.1975 45.5707 80.1975H64.7378C65.178 80.1975 65.509 79.796 65.4249 79.3638L64.4788 74.5013ZM52.9616 64.3525C52.9616 63.1087 53.9495 62.0889 55.1542 62.0889C58.0697 62.2133 58.0697 66.4917 55.1542 66.616C53.9495 66.616 52.9616 65.5962 52.9616 64.3525ZM50.8978 75.6703C50.4648 75.6703 50.1332 75.2764 50.2585 74.8619C51.752 69.9202 58.5324 69.9202 60.0259 74.8619C60.1511 75.2764 59.8195 75.6703 59.3866 75.6703H50.8978ZM85.8771 68.7334C87.5914 70.1461 88.8381 72.1608 89.2959 74.5013L90.242 79.3638C90.3261 79.796 89.9951 80.1975 89.5549 80.1975H70.3878C69.9475 80.1975 69.6166 79.796 69.7006 79.3638L70.6468 74.5013C71.0828 72.1606 72.3472 70.1458 74.0654 68.7331C74.3643 68.4873 74.4359 68.0521 74.245 67.7154C71.7721 63.3545 74.8808 57.5131 79.9713 57.5369C85.0849 57.5131 88.1726 63.3546 85.6977 67.7155C85.5067 68.0521 85.5784 68.4873 85.8771 68.7334ZM79.9713 62.0889C78.7666 62.0889 77.7787 63.1087 77.7787 64.3525C77.7787 65.5962 78.7666 66.616 79.9713 66.616C82.8868 66.4917 82.8868 62.2133 79.9713 62.0889ZM75.0756 74.8619C74.9503 75.2764 75.2819 75.6703 75.7149 75.6703H84.2037C84.6366 75.6703 84.9682 75.2764 84.843 74.8619C83.3495 69.9202 76.5691 69.9202 75.0756 74.8619Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>
              <span class="rounded" v-if="key!=='null'">{{employeesByEmail[key].name}}</span>

            </div>
          </a>
          <a
            v-else
            ref="btnRef"
            class="mt-3 tags-custom"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 91 92"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M73.9839 48.8864C73.9839 50.6954 72.5056 52.1754 70.6989 52.1754C68.8921 52.1754 67.4139 50.6954 67.4139 48.8864V44.4723C67.4139 40.8379 64.4738 37.8943 60.8439 37.8943H13.5399C9.90998 37.8943 6.9699 40.8379 6.9699 44.4723V78.7765C6.9699 82.4109 9.90998 85.3545 13.5399 85.3545H46.2096C48.026 85.3545 49.4986 86.827 49.4986 88.6435C49.4986 90.4599 48.026 91.9324 46.2096 91.9324H13.5399C6.29648 91.9324 0.399902 86.0287 0.399902 78.7765V44.4723C0.399902 37.2201 6.29648 31.3164 13.5399 31.3164H17.4819V19.7227C17.4819 9.06645 26.335 0.400002 37.1919 0.400002C48.0488 0.400002 56.9019 9.06645 56.9019 19.7227V31.3164H60.8439C68.0873 31.3164 73.9839 37.2201 73.9839 44.4723V48.8864ZM50.3319 31.3164H24.0519V19.7227C24.0519 12.7008 29.9485 6.97795 37.1919 6.97795C44.4353 6.97795 50.3319 12.7008 50.3319 19.7227V31.3164ZM39.6617 74.5013C39.2039 72.1608 37.9572 70.1461 36.2429 68.7334C35.9442 68.4873 35.8725 68.0521 36.0635 67.7155C38.5384 63.3546 35.4507 57.5131 30.3371 57.5369C25.2466 57.5131 22.1379 63.3545 24.6108 67.7154C24.8018 68.0521 24.7301 68.4873 24.4312 68.7331C22.713 70.1458 21.4486 72.1606 21.0126 74.5013L20.0665 79.3638C19.9824 79.796 20.3133 80.1975 20.7536 80.1975H39.9207C40.3609 80.1975 40.6919 79.796 40.6078 79.3638L39.6617 74.5013ZM28.1445 64.3525C28.1445 63.1087 29.1324 62.0889 30.3371 62.0889C33.2526 62.2133 33.2526 66.4917 30.3371 66.616C29.1324 66.616 28.1445 65.5962 28.1445 64.3525ZM26.0807 75.6703C25.6477 75.6703 25.3161 75.2764 25.4414 74.8619C26.9349 69.9202 33.7153 69.9202 35.2088 74.8619C35.334 75.2764 35.0024 75.6703 34.5695 75.6703H26.0807ZM64.4788 74.5013C64.021 72.1608 62.7743 70.1461 61.06 68.7334C60.7613 68.4873 60.6896 68.0521 60.8806 67.7155C63.3555 63.3546 60.2678 57.5131 55.1542 57.5369C50.0637 57.5131 46.955 63.3545 49.4279 67.7154C49.6189 68.0521 49.5472 68.4873 49.2483 68.7331C47.5301 70.1458 46.2657 72.1606 45.8297 74.5013L44.8836 79.3638C44.7995 79.796 45.1304 80.1975 45.5707 80.1975H64.7378C65.178 80.1975 65.509 79.796 65.4249 79.3638L64.4788 74.5013ZM52.9616 64.3525C52.9616 63.1087 53.9495 62.0889 55.1542 62.0889C58.0697 62.2133 58.0697 66.4917 55.1542 66.616C53.9495 66.616 52.9616 65.5962 52.9616 64.3525ZM50.8978 75.6703C50.4648 75.6703 50.1332 75.2764 50.2585 74.8619C51.752 69.9202 58.5324 69.9202 60.0259 74.8619C60.1511 75.2764 59.8195 75.6703 59.3866 75.6703H50.8978ZM85.8771 68.7334C87.5914 70.1461 88.8381 72.1608 89.2959 74.5013L90.242 79.3638C90.3261 79.796 89.9951 80.1975 89.5549 80.1975H70.3878C69.9475 80.1975 69.6166 79.796 69.7006 79.3638L70.6468 74.5013C71.0828 72.1606 72.3472 70.1458 74.0654 68.7331C74.3643 68.4873 74.4359 68.0521 74.245 67.7154C71.7721 63.3545 74.8808 57.5131 79.9713 57.5369C85.0849 57.5131 88.1726 63.3546 85.6977 67.7155C85.5067 68.0521 85.5784 68.4873 85.8771 68.7334ZM79.9713 62.0889C78.7666 62.0889 77.7787 63.1087 77.7787 64.3525C77.7787 65.5962 78.7666 66.616 79.9713 66.616C82.8868 66.4917 82.8868 62.2133 79.9713 62.0889ZM75.0756 74.8619C74.9503 75.2764 75.2819 75.6703 75.7149 75.6703H84.2037C84.6366 75.6703 84.9682 75.2764 84.843 74.8619C83.3495 69.9202 76.5691 69.9202 75.0756 74.8619Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <span class="rounded"> Доступ</span>
          </a>
        </Popper>
        <!-- Всплывающее окно Календарь -->
        <Popper
          class="popper-calendar"
          arrow
          append-to-body="true"
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <button @click="close"></button>
            <div class="popper">
              <DatePicker
                ref="calendar"
                v-model="range"
                is-range
                mode="dateTime"
                is24hr
                class="border-none text-xs"
                style="border: none!important;"
                title-position="left"
                :masks="masks"
                is-dragging="false"
                offset-distance="30"
                :class="{ 'is-not-in-month':false }"
                @click="handleInput" />
            </div>
          </template>
          <a class="mt-3 tags-custom any-calendar project-hover-close">
              <span
                v-if="selectedTask.customer_date_begin!=='0001-01-01T00:00:00' && selectedTask.customer_date_end!=='0001-01-01T00:00:00'"
                class="flex"
              >
                <button
                  class="btn-calendar"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 88 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.5998 4.80001C17.5998 2.48041 19.4802 0.600006 21.7998 0.600006C24.1194 0.600006 25.9998 2.48041 25.9998 4.80001V7.8H61.9998V4.80001C61.9998 2.48041 63.8802 0.600006 66.1998 0.600006C68.5194 0.600006 70.3998 2.48041 70.3998 4.8V7.8H77.5998C82.9017 7.8 87.1998 12.0981 87.1998 17.4V79.8C87.1998 85.1019 82.9017 89.4 77.5998 89.4H10.3998C5.09787 89.4 0.799805 85.1019 0.799805 79.8V17.4C0.799805 12.0981 5.09787 7.8 10.3998 7.8H17.5998V4.80001ZM61.9998 14.4V19.2C61.9998 21.5196 63.8802 23.4 66.1998 23.4C68.5194 23.4 70.3998 21.5196 70.3998 19.2V14.4H77.5998C79.2567 14.4 80.5998 15.7431 80.5998 17.4V79.8C80.5998 81.4568 79.2567 82.8 77.5998 82.8H10.3998C8.74295 82.8 7.3998 81.4568 7.3998 79.8V17.4C7.3998 15.7431 8.74295 14.4 10.3998 14.4H17.5998V19.2C17.5998 21.5196 19.4802 23.4 21.7998 23.4C24.1194 23.4 25.9998 21.5196 25.9998 19.2V14.4H61.9998ZM19.9998 42.2348C19.9998 40.5779 21.343 39.2348 22.9998 39.2348H26.3911C28.048 39.2348 29.3911 40.5779 29.3911 42.2348V45.6261C29.3911 47.2829 28.048 48.6261 26.3911 48.6261H22.9998C21.343 48.6261 19.9998 47.2829 19.9998 45.6261V42.2348ZM39.8259 42.2348C39.8259 40.5779 41.1691 39.2348 42.8259 39.2348H46.2172C47.8741 39.2348 49.2172 40.5779 49.2172 42.2348V45.6261C49.2172 47.2829 47.8741 48.6261 46.2172 48.6261H42.8259C41.1691 48.6261 39.8259 47.2829 39.8259 45.6261V42.2348ZM61.6085 39.2348C59.9517 39.2348 58.6085 40.5779 58.6085 42.2348V45.6261C58.6085 47.2829 59.9517 48.6261 61.6085 48.6261H64.9998C66.6567 48.6261 67.9998 47.2829 67.9998 45.6261V42.2348C67.9998 40.5779 66.6567 39.2348 64.9998 39.2348H61.6085ZM22.9998 58.4348C21.343 58.4348 19.9998 59.7779 19.9998 61.4348V64.8261C19.9998 66.4829 21.343 67.8261 22.9998 67.8261H26.3911C28.048 67.8261 29.3911 66.4829 29.3911 64.8261V61.4348C29.3911 59.7779 28.048 58.4348 26.3911 58.4348H22.9998ZM42.8259 58.4348C41.1691 58.4348 39.8259 59.7779 39.8259 61.4348V64.8261C39.8259 66.4829 41.1691 67.8261 42.8259 67.8261H46.2172C47.8741 67.8261 49.2172 66.4829 49.2172 64.8261V61.4348C49.2172 59.7779 47.8741 58.4348 46.2172 58.4348H42.8259ZM58.6085 61.4348C58.6085 59.7779 59.9517 58.4348 61.6085 58.4348H64.9998C66.6567 58.4348 67.9998 59.7779 67.9998 61.4348V64.8261C67.9998 66.4829 66.6567 67.8261 64.9998 67.8261H61.6085C59.9517 67.8261 58.6085 66.4829 58.6085 64.8261V61.4348Z"
                      fill="#3FBF64"
                      fill-opacity="1"
                    />
                  </svg>
                </button>
                <span v-if="new Date(selectedTask.customer_date_begin).toLocaleDateString() !== new Date(selectedTask.customer_date_end).toLocaleDateString()">
                  <span>{{ new Date(selectedTask.customer_date_begin).getDate() }}<span v-if="new Date(selectedTask.customer_date_end).toLocaleString()!==new Date(selectedTask.customer_date_begin).toLocaleString()">-{{ new Date(selectedTask.customer_date_end).getDate() }}</span> {{ months[new Date(selectedTask.customer_date_end).getMonth()] }}</span>
                </span>
                <span v-else>
                  <span>{{ new Date(selectedTask.customer_date_begin).getDate() }} {{ months[new Date(selectedTask.customer_date_end).getMonth()] }}</span>
                </span>
                <button @click="resetCalendar" class="btn-close-popover"><svg width="5" height="5" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z" fill="black" fill-opacity="0.5"/>
          </svg>
          </button>
              </span>
              <span
                v-else
                class="flex"
              >
                <button
                  class="btn-calendar"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 88 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.5998 4.80001C17.5998 2.48041 19.4802 0.600006 21.7998 0.600006C24.1194 0.600006 25.9998 2.48041 25.9998 4.80001V7.8H61.9998V4.80001C61.9998 2.48041 63.8802 0.600006 66.1998 0.600006C68.5194 0.600006 70.3998 2.48041 70.3998 4.8V7.8H77.5998C82.9017 7.8 87.1998 12.0981 87.1998 17.4V79.8C87.1998 85.1019 82.9017 89.4 77.5998 89.4H10.3998C5.09787 89.4 0.799805 85.1019 0.799805 79.8V17.4C0.799805 12.0981 5.09787 7.8 10.3998 7.8H17.5998V4.80001ZM61.9998 14.4V19.2C61.9998 21.5196 63.8802 23.4 66.1998 23.4C68.5194 23.4 70.3998 21.5196 70.3998 19.2V14.4H77.5998C79.2567 14.4 80.5998 15.7431 80.5998 17.4V79.8C80.5998 81.4568 79.2567 82.8 77.5998 82.8H10.3998C8.74295 82.8 7.3998 81.4568 7.3998 79.8V17.4C7.3998 15.7431 8.74295 14.4 10.3998 14.4H17.5998V19.2C17.5998 21.5196 19.4802 23.4 21.7998 23.4C24.1194 23.4 25.9998 21.5196 25.9998 19.2V14.4H61.9998ZM19.9998 42.2348C19.9998 40.5779 21.343 39.2348 22.9998 39.2348H26.3911C28.048 39.2348 29.3911 40.5779 29.3911 42.2348V45.6261C29.3911 47.2829 28.048 48.6261 26.3911 48.6261H22.9998C21.343 48.6261 19.9998 47.2829 19.9998 45.6261V42.2348ZM39.8259 42.2348C39.8259 40.5779 41.1691 39.2348 42.8259 39.2348H46.2172C47.8741 39.2348 49.2172 40.5779 49.2172 42.2348V45.6261C49.2172 47.2829 47.8741 48.6261 46.2172 48.6261H42.8259C41.1691 48.6261 39.8259 47.2829 39.8259 45.6261V42.2348ZM61.6085 39.2348C59.9517 39.2348 58.6085 40.5779 58.6085 42.2348V45.6261C58.6085 47.2829 59.9517 48.6261 61.6085 48.6261H64.9998C66.6567 48.6261 67.9998 47.2829 67.9998 45.6261V42.2348C67.9998 40.5779 66.6567 39.2348 64.9998 39.2348H61.6085ZM22.9998 58.4348C21.343 58.4348 19.9998 59.7779 19.9998 61.4348V64.8261C19.9998 66.4829 21.343 67.8261 22.9998 67.8261H26.3911C28.048 67.8261 29.3911 66.4829 29.3911 64.8261V61.4348C29.3911 59.7779 28.048 58.4348 26.3911 58.4348H22.9998ZM42.8259 58.4348C41.1691 58.4348 39.8259 59.7779 39.8259 61.4348V64.8261C39.8259 66.4829 41.1691 67.8261 42.8259 67.8261H46.2172C47.8741 67.8261 49.2172 66.4829 49.2172 64.8261V61.4348C49.2172 59.7779 47.8741 58.4348 46.2172 58.4348H42.8259ZM58.6085 61.4348C58.6085 59.7779 59.9517 58.4348 61.6085 58.4348H64.9998C66.6567 58.4348 67.9998 59.7779 67.9998 61.4348V64.8261C67.9998 66.4829 66.6567 67.8261 64.9998 67.8261H61.6085C59.9517 67.8261 58.6085 66.4829 58.6085 64.8261V61.4348Z"
                      fill="black"
                      fill-opacity="0.5"
                    />
                  </svg>
                </button><span><span ref="dateval">Дата</span></span>
              </span>
            </a>
        </Popper>
        <!-- Повтор -->
        <Popper
          class="popper-repeat"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div class="text-white opacity-75 font-semibold title-popover-main">
                <div
                  class="dissmiss_popover"
                  @click="close"
                >
                  <svg
                    viewBox="0 0 14 14"
                    width="14"
                    height="14"
                    class="inline-block"
                  ><path
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z"
                  /></svg>
                  Отменить
                </div>
                <div class="title-project-custom">
                  <span
                    class="title-z-popover"
                  >Применить</span>
                </div>
              </div>
              <div class="text-white p-3 body-popover-custom body-repeat-custom rounded-b-lg">
                <button
                  ref="tabnorepeat"
                  class="btn-width-custom"
                  :class="selectedTask.SeriesType===0 ? {active:true} : {active:isActive==='#tabnorepeat'}"
                  type="button"
                  value="0"
                  @click="tabfunction('#tabnorepeat')"
                >
                  Не повторять
                </button>
                <button
                  ref="tabeveryday"
                  class="btn-width-custom"
                  :class="selectedTask.SeriesType===1 ? {active:true} : {active:isActive==='#tabeveryday'}"
                  type="button"
                  value="1"
                  @click="tabfunction('#tabeveryday')"
                >
                  Ежедневно
                </button>
                <button
                  ref="tabeveryweek"
                  class="btn-width-custom"
                  :class="selectedTask.SeriesType===2 ? {active:true} : {active:isActive==='#tabeveryweek'}"
                  type="button"
                  value="2"
                  @click="tabfunction('#tabeveryweek')"
                >
                  Еженедельно
                </button>
                <button
                  ref="tabverymonth"
                  class="btn-width-custom"
                  :class="selectedTask.SeriesType===3 ? {active:true} : {active:isActive==='#tabverymonth'}"
                  type="button"
                  value="3"
                  @click="tabfunction('#tabeverymonth')"
                >
                  Ежемесячно
                </button>
                <button
                  ref="tabeveryyear"
                  class="btn-width-custom"
                  :class="selectedTask.SeriesType===4 ? {active:true} : {active:isActive==='#tabeveryyear'}"
                  type="button"
                  value="4"
                  @click="tabfunction('#tabeveryyear')"
                >
                  Ежегодно
                </button>
              </div>
              <div class="tab-content">
                <div
                  id="tabnorepeat"
                  class="tab-content-repeat"
                  :class="selectedTask.SeriesType===0 ? {active:true} : {active:isActive==='#tabnorepeat'}"
                />
                <div
                  id="tabeveryday"
                  class="tab-content-repeat"
                  :class="selectedTask.SeriesType===1 ? {active:true} : {active:isActive==='#tabeveryday'}"
                >
                  <div class="every-content flex">
                    <label>Каждый </label>
                    <div class="form-group">
                      <select
                        class="form-control form-control-select"
                        name=""
                      >
                        <option
                          v-for="item in 365"
                          :key="item"
                          selected="{{selectedTask.SeriesAfterCount===item ? true :false}}"
                        >
                          {{ item }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <select class="form-control form-control-select">
                        <option value="1">
                          День
                        </option>
                        <option value="2">
                          Неделю
                        </option>
                        <option value="3">
                          Месяц
                        </option>
                        <option value="4">
                          Год
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  id="tabeveryweek"
                  class="tab-content-repeat"
                  :class="selectedTask.SeriesType===2 ? {active:true} : {active:isActive==='#tabeveryweek'}"
                >
                  <div class="everyweek-content">
                    <div class="flex">
                      <label>Каждую </label>
                      <div class="form-group">
                        <select
                          class="form-control form-control-select"
                          name=""
                        >
                          <option
                            v-for="item in 365"
                            :key="item"
                          >
                            {{ item }} неделю
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-everyweek-container">
                        <button class="btn-day-week">
                          Вт.
                        </button>
                        <button class="btn-day-week">
                          Ср.
                        </button>
                        <button class="btn-day-week">
                          Чт.
                        </button>
                        <button class="btn-day-week">
                          Пт.
                        </button>
                        <button class="btn-day-week">
                          Сб.
                        </button>
                        <button class="btn-day-week">
                          Вск.
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="tabeverymonth"
                  class="tab-content-repeat"
                  :class="selectedTask.SeriesType===3 ? {active:true} : {active:isActive==='#tabeverymonth'}"
                >
                  <div class="everymonth-content">
                    <div class="flex">
                      <label>Повтор </label>
                      <div class="form-group">
                        <select
                          class="form-control form-control-select"
                          name=""
                        >
                          <option>Каждый</option>
                          <option>Первый</option>
                          <option>Второй</option>
                          <option>Третий</option>
                          <option>Четвертый</option>
                          <option>Последний</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <select
                          class="form-control form-control-select"
                          name=""
                        >
                          <option
                            v-for="item in 365"
                            :key="item"
                          >
                            {{ item }} месяц
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-everymonth-container">
                        <button
                          v-for="day in 31"
                          :key="day"
                          class="btn-day-month"
                        >
                          {{ day }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="tabeveryyear"
                  class="tab-content-repeat"
                  :class="selectedTask.SeriesType===4 ? {active:true} : {active:isActive==='#tabeveryyear'}"
                >
                  <div class="everyyear-content">
                    <div class="flex">
                      <label>Повтор </label>
                      <div
                        class="form-group"
                        aria-valuemax="SeriesYearType"
                      >
                        <select
                          class="form-control form-control-select"
                          name="SeriesYearWeekType"
                        >
                          <option value="1">
                            Каждый
                          </option>
                          <option>Первый</option>
                          <option>Второй</option>
                          <option>Третий</option>
                          <option>Четвертый</option>
                          <option>Последний</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <select
                          class="form-control form-control-select"
                          name=""
                        >
                          <option
                            v-for="item in months"
                            :key="item"
                          >
                            {{ item }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-everyyear-container">
                        <button
                          v-for="day in 31"
                          :key="day"
                          class="btn-day-year"
                        >
                          {{ day }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group-button">
                  <div class="form-group">
                    <button class="btn-save">
                      Сохранить
                    </button>
                  </div>
                  <div class="form-group">
                    <button
                      class="btn-cancel"
                      @click="togglePopover_repeat()"
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="selectedTask.customer_date_begin!=='' && selectedTask.customer_date_end!==''">
            <a
              v-if="selectedTask.SeriesEnd!==''"
              ref="btnRefRepeat"
              class="mt-3 tags-custom"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 92 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.595 71.68H76.4048V66.5015C76.4048 64.3145 78.1735 62.5415 80.3554 62.5415C82.5373 62.5415 84.306 64.3145 84.306 66.5015V71.68C84.306 76.0541 80.7685 79.6 76.4048 79.6H15.595C11.2313 79.6 7.69378 76.0541 7.69378 71.68L7.69378 40H2.83583C0.728566 40 -0.380779 37.4961 1.03222 35.929L9.84079 26.1602C10.8061 25.0897 12.4827 25.0897 13.448 26.1602L22.2566 35.929C23.6696 37.4961 22.5602 40 20.453 40H15.595L15.595 71.68Z"
                  fill="#5D94F7"
                  fill-opacity="1"
                />
                <path
                  d="M76.4048 8.32H15.595V13.4985C15.595 15.6855 13.8263 17.4585 11.6444 17.4585C9.46253 17.4585 7.69378 15.6855 7.69378 13.4985V8.32C7.69378 3.94591 11.2313 0.400002 15.595 0.400002H76.4048C80.7685 0.400002 84.306 3.9459 84.306 8.32V40H89.164C91.2712 40 92.3806 42.5039 90.9676 44.071L82.159 53.8398C81.1937 54.9103 79.5171 54.9103 78.5518 53.8398L69.7432 44.071C68.3302 42.5039 69.4396 40 71.5469 40H76.4048V8.32Z"
                  fill="#5D94F7"
                  fill-opacity="1"
                />
              </svg>
              <span v-if="selectedTask.SeriesType===0">Не повторять</span>
              <span v-if="selectedTask.SeriesType===1"><span v-if="selectedTask.SeriesAfterType===1"><span v-if="selectedTask.SeriesAfterCount===1">Ежедневно </span><span v-else>Каждый {{ selectedTask.SeriesAfterCount }} день.</span></span><span v-else-if="selectedTask.SeriesAfterType===2"><span v-if="selectedTask.SeriesAfterCount===1">Еженедельно </span><span v-else>Каждый {{ selectedTask.SeriesAfterCount }} неделю.</span></span><span v-else-if="selectedTask.SeriesAfterType===3"><span v-if="selectedTask.SeriesAfterCount===1">Ежемесячно </span><span v-else>Каждый {{ selectedTask.SeriesAfterCount }} месяц.</span></span><span v-else-if="selectedTask.SeriesAfterType===4"><span v-if="selectedTask.SeriesAfterCount===1">Ежегодно </span><span v-else>Каждый {{ selectedTask.SeriesAfterCount }} год.</span></span> </span>
              <span v-if="selectedTask.SeriesType===2">Каждую {{ selectedTask.SeriesWeekCount }} неделю, по: <span v-if="selectedTask.SeriesWeekMon===1">Пн. </span>
              <span v-if="selectedTask.SeriesWeekTue===1">Вт. </span>
              <span v-if="selectedTask.SeriesWeekWed===1">Ср. </span>
              <span v-if="selectedTask.SeriesWeekThu===1">Чт. </span>
              <span v-if="selectedTask.SeriesWeekFri===1">Пт. </span>
              <span v-if="selectedTask.SeriesWeekSat===1">Сб. </span>
              <span v-if="selectedTask.SeriesWeekSun===1">Вск. </span>
            </span>
              <span v-if="selectedTask.SeriesType===3"><span v-if="selectedTask.SeriesMonthType===1">Каждый {{ selectedTask.SeriesMonthCount }} месяц {{ selectedTask.SeriesYearMonthDay }} числа</span><span v-else>
              {{ firstcount[selectedTask.SeriesMonthWeekType] }} <span>{{ day[selectedTask.SeriesMonthDayOfWeek] }} каждый {{ selectedTask.SeriesMonthCount }} месяц</span>
            </span></span>
              <span v-if="selectedTask.SeriesType===4"><span v-if="selectedTask.SeriesYearType===1">Каждый год {{ selectedTask.SeriesYearMonthDay }}  {{ months[selectedTask.SeriesYearMonth-1] }}</span><span v-else>
              Каждый {{ months[selectedTask.SeriesYearMonth-1] }} {{ firstcount[selectedTask.SeriesYearWeekType] }}
              {{ day[selectedTask.SeriesYearDayOfWeek] }}
            </span></span>
            </a>
          </div>
          <div
            v-else
            ref="btnRefRepeat"
            class="mt-3 tags-custom"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 92 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.595 71.68H76.4048V66.5015C76.4048 64.3145 78.1735 62.5415 80.3554 62.5415C82.5373 62.5415 84.306 64.3145 84.306 66.5015V71.68C84.306 76.0541 80.7685 79.6 76.4048 79.6H15.595C11.2313 79.6 7.69378 76.0541 7.69378 71.68L7.69378 40H2.83583C0.728566 40 -0.380779 37.4961 1.03222 35.929L9.84079 26.1602C10.8061 25.0897 12.4827 25.0897 13.448 26.1602L22.2566 35.929C23.6696 37.4961 22.5602 40 20.453 40H15.595L15.595 71.68Z"
                fill="black"
                fill-opacity="0.5"
              />
              <path
                d="M76.4048 8.32H15.595V13.4985C15.595 15.6855 13.8263 17.4585 11.6444 17.4585C9.46253 17.4585 7.69378 15.6855 7.69378 13.4985V8.32C7.69378 3.94591 11.2313 0.400002 15.595 0.400002H76.4048C80.7685 0.400002 84.306 3.9459 84.306 8.32V40H89.164C91.2712 40 92.3806 42.5039 90.9676 44.071L82.159 53.8398C81.1937 54.9103 79.5171 54.9103 78.5518 53.8398L69.7432 44.071C68.3302 42.5039 69.4396 40 71.5469 40H76.4048V8.32Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <span class="rounded"> Повтор</span>
          </div>
        </Popper>
        <!-- Всплывающее окно Напоминание -->
        <Popper
          class="popper-reminder"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div @click="close"></div>
               <div class="text-white p-3 body-popover-custom">
                <DatePicker
                  v-model="remi"
                  mode="dateTime"
                  locale="ru"
                  is24hr
                />
              </div>
            </div>
          </template>
          <a
            v-if="selectedTask.date_reminder!==''"
            ref="btnRefReminder"
            class="mt-3 tags-custom"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 81 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.12 5.72C66.52 5.12 65.8 4.88 65.08 4.88C64.24 4.88 63.52 5.24 63.04 5.72C61.84 6.92 61.84 8.72 63.04 9.92C70.36 17.24 74.32 26.84 74.32 37.16C74.32 38.84 75.64 40.16 77.32 40.16C79 40.16 80.32 38.84 80.32 37.16C80.08 25.16 75.52 14 67.12 5.72Z"
                fill="#3FBF64"
                fill-opacity="1"
              />
              <path
                d="M6.28002 37.04C6.28002 26.72 10.24 17.12 17.56 9.8C18.16 9.32 18.4 8.6 18.4 7.76C18.4 6.92 18.04 6.2 17.56 5.72C17.08 5.24 16.24 4.88 15.52 4.88C14.8 4.88 13.96 5.24 13.48 5.72C4.96002 14 0.400024 25.16 0.400024 37.04C0.400024 38.72 1.72002 40.04 3.40002 40.04C5.08002 40.04 6.28002 38.72 6.28002 37.04Z"
                fill="#3FBF64"
                fill-opacity="1"
              />
              <path
                d="M74.2 65.36C68.8 60.8 65.68 54.2 65.68 47.12V37.04C65.68 24.08 56.08 13.28 43.24 11.72V3.8C43.24 2.12 41.92 0.800003 40.24 0.800003C38.56 0.800003 37.24 2.12 37.24 3.8V11.84C24.4 13.28 14.8 24.08 14.8 37.04V47.12C14.8 54.2 11.68 60.8 6.28002 65.36C4.84002 66.56 4.00002 68.48 4.00002 70.4C4.00002 74 6.88002 77 10.6 77H26.8C28.12 83.24 33.76 87.8 40.24 87.8C46.72 87.8 52.24 83.24 53.68 77H70C73.6 77 76.48 74.12 76.48 70.4C76.48 68.48 75.64 66.56 74.2 65.36ZM40.24 81.8C37 81.8 34.12 79.88 32.92 76.88H47.44C46.36 79.88 43.48 81.8 40.24 81.8ZM70 71H10.6C10.24 71 10 70.64 10 70.4C10 70.16 10.12 70.04 10.24 69.92C16.96 64.28 20.8 56 20.8 47.12V37.04C20.8 26.24 29.56 17.48 40.36 17.48C51.16 17.48 59.92 26.24 59.92 37.04V47.12C59.92 55.88 63.76 64.16 70.48 69.92C70.6 70.04 70.72 70.16 70.72 70.4C70.6 70.64 70.24 71 70 71Z"
                fill="#3FBF64"
                fill-opacity="1"
              />
            </svg>
            <span class="rounded">{{ new Date(selectedTask.date_reminder).getDate() }}, {{ new Date(selectedTask.date_reminder).getMonth() }}, {{ new Date(selectedTask.date_reminder).getHours() }}</span>
          </a>
          <a
            v-else
            ref="btnRefReminder"
            class="mt-3 tags-custom"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 81 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.12 5.72C66.52 5.12 65.8 4.88 65.08 4.88C64.24 4.88 63.52 5.24 63.04 5.72C61.84 6.92 61.84 8.72 63.04 9.92C70.36 17.24 74.32 26.84 74.32 37.16C74.32 38.84 75.64 40.16 77.32 40.16C79 40.16 80.32 38.84 80.32 37.16C80.08 25.16 75.52 14 67.12 5.72Z"
                fill="black"
                fill-opacity="0.5"
              />
              <path
                d="M6.28002 37.04C6.28002 26.72 10.24 17.12 17.56 9.8C18.16 9.32 18.4 8.6 18.4 7.76C18.4 6.92 18.04 6.2 17.56 5.72C17.08 5.24 16.24 4.88 15.52 4.88C14.8 4.88 13.96 5.24 13.48 5.72C4.96002 14 0.400024 25.16 0.400024 37.04C0.400024 38.72 1.72002 40.04 3.40002 40.04C5.08002 40.04 6.28002 38.72 6.28002 37.04Z"
                fill="black"
                fill-opacity="0.5"
              />
              <path
                d="M74.2 65.36C68.8 60.8 65.68 54.2 65.68 47.12V37.04C65.68 24.08 56.08 13.28 43.24 11.72V3.8C43.24 2.12 41.92 0.800003 40.24 0.800003C38.56 0.800003 37.24 2.12 37.24 3.8V11.84C24.4 13.28 14.8 24.08 14.8 37.04V47.12C14.8 54.2 11.68 60.8 6.28002 65.36C4.84002 66.56 4.00002 68.48 4.00002 70.4C4.00002 74 6.88002 77 10.6 77H26.8C28.12 83.24 33.76 87.8 40.24 87.8C46.72 87.8 52.24 83.24 53.68 77H70C73.6 77 76.48 74.12 76.48 70.4C76.48 68.48 75.64 66.56 74.2 65.36ZM40.24 81.8C37 81.8 34.12 79.88 32.92 76.88H47.44C46.36 79.88 43.48 81.8 40.24 81.8ZM70 71H10.6C10.24 71 10 70.64 10 70.4C10 70.16 10.12 70.04 10.24 69.92C16.96 64.28 20.8 56 20.8 47.12V37.04C20.8 26.24 29.56 17.48 40.36 17.48C51.16 17.48 59.92 26.24 59.92 37.04V47.12C59.92 55.88 63.76 64.16 70.48 69.92C70.6 70.04 70.72 70.16 70.72 70.4C70.6 70.64 70.24 71 70 71Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <span class="rounded"> Напоминание</span>
          </a>
        </Popper>
        <!--Всплывающее окно Проекты-->
        <Popper
          class="popper-project"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
          :options="{
            placement: 'top',
            modifiers: { offset: { offset: '0,10px' } }
          }"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div @click="close">
              </div>
              <div class="text-white body-popover-custom">
                <div class="container-project-popover">
                  <ul
                    v-for="(value,index, ind) in projects"
                    :key="ind"
                  >
                    <TreeItem
                      v-if="value.uid_parent==='00000000-0000-0000-0000-000000000000'"
                      class="item"
                      :model="value"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </template>
          <a
            v-if="selectedTask.uid_project !== '00000000-0000-0000-0000-000000000000' && projects[selectedTask.uid_project].name!==''"
            ref="btnRefProject"
            class="mt-3 tags-custom project-hover-close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 90 81"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                v-if="projects[selectedTask.uid_project].color!==11114678 && projects[selectedTask.uid_project].color!==-4056036 && projects[selectedTask.uid_project].color!==-2679009"
                d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
                :fill="projects[selectedTask.uid_project].color"
                fill-opacity="1"
              />
              <path
                v-else
                d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            {{ projects[selectedTask.uid_project].name }}
            <button @click="resetProject" class="btn-close-popover"><svg width="5" height="5" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z" fill="black" fill-opacity="0.5"/>
          </svg>
          </button>
          </a>
          <a
            v-else
            ref="btnRefProject"
            class="mt-3 tags-custom"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 90 81"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <span class="rounded"> Проект</span>
          </a>
        </Popper>
        <!--Всплывающее окно Цвета-->
        <Popper
          class="popper-color"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
          :options="{
            placement: 'top',
            modifiers: { offset: { offset: '0,10px' } }
          }"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div @click="close"></div>
              <div class="text-white body-popover-custom">
                <div class="container-color-popover">
                  <div
                    v-for="(key,value) in colors"
                    :key="value"
                    class="list-color-access"
                    :class="{active:isActive=key.uid===selectedTask.uid_marker}"
                    @click="changeColors(selectedTask.uid, key.uid)"
                    :style="{'background-color': key.back_color, 'border:1px solid ': key.back_color}"
                  >
                        <span
                          v-if="uppercase===1"
                          style="text-transform:uppercase; display: none;"
                          :style="{'color': key.force_color}"
                        >{{ key.name }}</span>
                        <span
                          v-else style="display: none;"
                          :style="{'color': key.force_color}"
                        >{{ key.name }}</span>
                    <span class="inline-flex justify-center items-center checkcolor"><svg viewBox="0 0 26 20" width="15" height="15" class="inline-block"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299Z"></path></svg><!--v-if--></span>
                      <input style="display: none;"
                        type="radio"
                        name="check_colors"
                        :value="key.uid"
                        class="check-custom-project"
                        :checked="key.uid===selectedTask.uid_marker"
                        @change="changeColors(selectedTask.uid, key.uid)"
                      >
                  </div>
                </div>
              </div>
            </div>
          </template>
          <a
            ref="btnRefColor"
            class="mt-3 tags-custom project-hover-close"
          >
            <span v-if="selectedTask.uid_marker !== '00000000-0000-0000-0000-000000000000'">
              <svg
                width="24"
                height="24"
                viewBox="0 0 89 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M86.4883 31.2718L82.1334 26.8569C80.6576 25.3607 78.5769 24.8211 76.6656 25.2871C77.1253 23.3249 76.593 21.2155 75.1172 19.7438L65.6574 10.1535C64.7864 9.27053 63.6735 8.7064 62.5122 8.51017C62.3187 7.33285 61.7622 6.20458 60.8912 5.32158L57.9396 2.32921C55.6653 0.0236062 51.9879 0.0236062 49.7378 2.32921L20.0278 32.4492C17.7536 34.7548 17.7536 38.483 20.0278 40.764L26.3666 47.1903C26.9714 47.8035 27.2375 48.6129 27.165 49.4714C27.0682 50.3053 26.6085 51.0657 25.9069 51.5317C7.03567 63.7219 5.26951 65.5124 4.5195 66.2728C-0.706372 71.5708 -0.706372 80.18 4.5195 85.4779C9.74538 90.7759 18.2374 90.7759 23.4633 85.4779C24.2133 84.7176 25.9795 82.9271 38.0038 63.7955C38.4635 63.0842 39.1893 62.6182 40.0361 62.5201C40.8829 62.422 41.7055 62.7163 42.2861 63.3049L48.6249 69.7312C50.8992 72.0368 54.5766 72.0368 56.8266 69.7312L86.5367 39.6112C88.7626 37.2811 88.7626 33.5529 86.4883 31.2718ZM52.6895 65.537L46.3507 59.1107C44.512 57.2466 41.9474 56.3391 39.3587 56.6334C36.7699 56.9278 34.4715 58.3749 33.0683 60.5824C27.7456 69.069 21.0197 79.5177 19.302 81.2592C16.3503 84.2516 11.5357 84.2516 8.58407 81.2592C5.63242 78.2668 5.63242 73.3858 8.58407 70.3934C10.3018 68.652 20.6326 61.8578 28.9795 56.4372C31.157 55.0146 32.6086 52.6845 32.8989 50.06C33.1892 47.4356 32.2699 44.8356 30.4553 42.9715L24.1165 36.5453L28.7376 31.8605L57.2863 60.8031L52.6895 65.537ZM61.3993 56.707L32.8505 27.7644L53.8266 6.49891L56.8025 9.49128L53.4879 16.9477C53.3669 17.193 53.4395 17.5118 53.6331 17.708C53.8266 17.9043 54.1411 17.9533 54.3831 17.8307L61.5686 14.3232L71.0285 23.9135L61.9992 39.3961C61.8299 39.6659 61.8541 40.0092 62.0718 40.23C62.2896 40.4507 62.6525 40.4998 62.9186 40.3036L78.0447 31.002L82.3996 35.417L61.3993 56.707Z"
                  :fill="colors[selectedTask.uid_marker].back_color"
                  fill-opacity="0.5"
                />
                <path
                  d="M18.2858 74.9311C18.2858 76.8442 16.7616 78.3895 14.8745 78.3895C12.9874 78.3895 11.4631 76.8442 11.4631 74.9311C11.4631 73.0179 12.9874 71.4727 14.8745 71.4727C16.7616 71.4727 18.2858 73.0179 18.2858 74.9311Z"
                  :fill="colors[selectedTask.uid_marker].back_color"
                  fill-opacity="1"
                />
              </svg>
              <span class="rounded"> {{ colors[selectedTask.uid_marker].name }}</span>
               <button @click="resetColor" class="btn-close-popover"><svg width="5" height="5" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z" fill="black" fill-opacity="0.5"/>
          </svg>
          </button>
            </span>
            <span v-else>
              <svg
                width="24"
                height="24"
                viewBox="0 0 89 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M86.4883 31.2718L82.1334 26.8569C80.6576 25.3607 78.5769 24.8211 76.6656 25.2871C77.1253 23.3249 76.593 21.2155 75.1172 19.7438L65.6574 10.1535C64.7864 9.27053 63.6735 8.7064 62.5122 8.51017C62.3187 7.33285 61.7622 6.20458 60.8912 5.32158L57.9396 2.32921C55.6653 0.0236062 51.9879 0.0236062 49.7378 2.32921L20.0278 32.4492C17.7536 34.7548 17.7536 38.483 20.0278 40.764L26.3666 47.1903C26.9714 47.8035 27.2375 48.6129 27.165 49.4714C27.0682 50.3053 26.6085 51.0657 25.9069 51.5317C7.03567 63.7219 5.26951 65.5124 4.5195 66.2728C-0.706372 71.5708 -0.706372 80.18 4.5195 85.4779C9.74538 90.7759 18.2374 90.7759 23.4633 85.4779C24.2133 84.7176 25.9795 82.9271 38.0038 63.7955C38.4635 63.0842 39.1893 62.6182 40.0361 62.5201C40.8829 62.422 41.7055 62.7163 42.2861 63.3049L48.6249 69.7312C50.8992 72.0368 54.5766 72.0368 56.8266 69.7312L86.5367 39.6112C88.7626 37.2811 88.7626 33.5529 86.4883 31.2718ZM52.6895 65.537L46.3507 59.1107C44.512 57.2466 41.9474 56.3391 39.3587 56.6334C36.7699 56.9278 34.4715 58.3749 33.0683 60.5824C27.7456 69.069 21.0197 79.5177 19.302 81.2592C16.3503 84.2516 11.5357 84.2516 8.58407 81.2592C5.63242 78.2668 5.63242 73.3858 8.58407 70.3934C10.3018 68.652 20.6326 61.8578 28.9795 56.4372C31.157 55.0146 32.6086 52.6845 32.8989 50.06C33.1892 47.4356 32.2699 44.8356 30.4553 42.9715L24.1165 36.5453L28.7376 31.8605L57.2863 60.8031L52.6895 65.537ZM61.3993 56.707L32.8505 27.7644L53.8266 6.49891L56.8025 9.49128L53.4879 16.9477C53.3669 17.193 53.4395 17.5118 53.6331 17.708C53.8266 17.9043 54.1411 17.9533 54.3831 17.8307L61.5686 14.3232L71.0285 23.9135L61.9992 39.3961C61.8299 39.6659 61.8541 40.0092 62.0718 40.23C62.2896 40.4507 62.6525 40.4998 62.9186 40.3036L78.0447 31.002L82.3996 35.417L61.3993 56.707Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M18.2858 74.9311C18.2858 76.8442 16.7616 78.3895 14.8745 78.3895C12.9874 78.3895 11.4631 76.8442 11.4631 74.9311C11.4631 73.0179 12.9874 71.4727 14.8745 71.4727C16.7616 71.4727 18.2858 73.0179 18.2858 74.9311Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>
              <span class="rounded">Цвет</span>
            </span>
          </a>
        </Popper>
        <!--Всплывающее окно Метки-->
        <Popper
          class="popper-tags"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
          :options="{
            placement: 'top',
            modifiers: { offset: { offset: '0,10px' } }
          }"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div @click="close">
                <button @click="ClickTagsChange" class="btn-save-popover">Применить</button>
              </div>
              <div class="text-white body-popover-custom">
                <div class="container-tags-popover">
                  <form
                    id="formdatatags"
                    ref="form_tags"
                    @submit.prevent="ClickTagsChange"
                  >
                    <div
                      v-for="(value, index) in selectedTask.tags"
                      :key="index"
                    />
                    <!--<div v-for="(value, key, index) in tags" :key="index">
                        <div>
                        <div class="list-tags-access active" v-if="selectedTask.tags.filter(tag=>tag===value.uid)[0]===value.uid" >
                          <svg width="24" height="24" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z" :fill="value.back_color" fill-opacity="1"></path>
                            <path d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z" :fill="value.back_color" fill-opacity="1"></path>
                          </svg>
                          <label>{{value.name}}</label>
                          <input type="checkbox" name="check_employee" v-bind:value="value.uid" class="check-custom-project" checked="checked">
                        </div>
                        <div class="list-tags-access" v-else >
                          <svg width="24" height="24" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z" :fill="value.back_color" fill-opacity="1"></path>
                            <path d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z" :fill="value.back_color" fill-opacity="1"></path>
                          </svg>
                          <label>{{value.name}}</label>
                          <input type="checkbox" name="check_employee" class="check-custom-project">
                        </div>
                      </div>
                      </div>-->
                    <ul
                      v-for="(value,index, ind) in tags"
                      :key="ind"
                    >
                      <TreeTagsItem
                        v-if="value.uid_parent==='00000000-0000-0000-0000-000000000000'"
                        class="item"
                        :model="value"
                      />
                    </ul>
                  </form>
                </div>
              </div>
            </div>
          </template>
          <span
            v-if="selectedTask.tags.length"
            ref="btnRefTags0"
          >
            <a
              v-for="(key, value) in selectedTask.tags"
              :key="value"
              class="mt-3 tags-custom project-hover-close"
            >
              <svg
                v-if="tags[key].back_color!==-129876 && tags[key].back_color!==-6268231 && tags[key].back_color!==-12169111 && tags[key].back_color!==-2160377 && tags[key].back_color!==-16741998 && tags[key].back_color!==-11075513 && tags[key].back_color!==-12366748"
                width="24"
                height="24"
                viewBox="0 0 88 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z"
                  :fill="tags[key].back_color"
                  fill-opacity="1"
                />
                <path
                  d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z"
                  :fill="tags[key].back_color"
                  fill-opacity="1"
                />
              </svg>
              <svg
                v-else
                width="24"
                height="24"
                viewBox="0 0 88 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z"
                  fill="#6C6C6C"
                  fill-opacity="1"
                />
                <path
                  d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z"
                  fill="#6C6C6C"
                  fill-opacity="1"
                />
              </svg>
              <span class="rounded custom-method">{{ tags[key].name }}</span>
                <button @click="resetTags(key)" class="btn-close-popover"><svg width="5" height="5" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z" fill="black" fill-opacity="0.5"/>
          </svg>
          </button>
            </a>
          </span>
          <a
            v-else
            ref="btnRefTags0"
            class="mt-3 tags-custom"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 88 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z"
                fill="black"
                fill-opacity="0.5"
              />
              <path
                d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <span class="rounded custom-method">Метки</span>
          </a>
        </Popper>
        <!-- Чек лист -->
        <div
          v-if="!selectedTask.checklist"
          class="mt-3 tags-custom"
          @click="createChecklist"
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
          <span class="rounded"> Чек-лист</span>
        </div>
        <!-- Фокус -->
        <div
          v-if="selectedTask.focus===1"
          class="mt-3 tags-custom"
          @click="changeFocus(selectedTask.uid, 0)"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 44 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.47887 0H41.5211C42.8845 0 44 1.1195 44 2.48777V57.0416C44 58.0782 43.339 59.0318 42.3681 59.3843C42.0995 59.4879 41.8103 59.5294 41.5211 59.5294C40.7775 59.5294 40.0958 59.1977 39.6207 58.638L22 41.1088L4.37934 58.638C3.90423 59.1977 3.20188 59.5294 2.47887 59.5294C2.18967 59.5294 1.90047 59.4879 1.63192 59.3843C0.661033 59.0111 0 58.0782 0 57.0416V2.48777C0 1.1195 1.11549 0 2.47887 0ZM21.5922 11.4076C19.5672 11.4076 17.9255 13.0492 17.9255 15.0743C17.9255 17.0993 19.5672 18.7409 21.5922 18.7409C23.6173 18.7409 25.2589 17.0993 25.2589 15.0743C25.2589 13.0492 23.6173 11.4076 21.5922 11.4076Z"
              fill="#F2543F"
            />
          </svg>

          <span class="rounded"> В фокусе</span>
        </div>
        <div
          v-else
          class="mt-3 tags-custom"
          @click="changeFocus(selectedTask.uid, 1)"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 66 89"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M61.7494 0.599998H4.2508C2.24291 0.599998 0.600098 2.24871 0.600098 4.2638V84.6068C0.600098 86.1334 1.57362 87.5073 3.00348 88.0569C3.39897 88.2095 3.82489 88.2706 4.2508 88.2706C5.31559 88.2706 6.34996 87.7821 7.04968 86.9577L33.0001 61.142L58.9505 86.9577C59.6503 87.7821 60.6542 88.2706 61.7494 88.2706C62.1753 88.2706 62.6012 88.2095 62.9967 88.0569C64.4266 87.5378 65.4001 86.1334 65.4001 84.6068V4.2638C65.4001 2.24871 63.7573 0.599998 61.7494 0.599998ZM30.2012 54.3122L6.70151 76.9619V6.72761H59.2987V76.9619L35.799 54.3122C35.0993 53.4878 34.0953 52.9993 33.0001 52.9993C31.9049 52.9993 30.9009 53.4878 30.2012 54.3122Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded"> В фокус</span>
        </div>
        <!-- Три точки -->
        <div
          class="mt-3 tags-custom any-list-custom relative"
          @click="anymenuShow = !anymenuShow"
        >
          <svg
            style="width:24px;height:24px"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
            />
          </svg>
          <span class="rounded" />
          <Transition>
            <div
              v-show="anymenuShow"
              class="
          absolute
          custom-dropdown
          py-2
          mt-2
          rounded-md
          shadow-xl
          w-44
        "
            >
              <!--   <router-link v-if="selectedTask.checklist"
              to="/"
              class="
            block
            px-4
            py-2
            text-sm
                    "
            >
              Добавить чек-лист
            </router-link>-->
              <router-link
                to="/"
                class="
            block
            px-4
            py-2
            text-sm
          "
              >
                Копировать как ссылку
              </router-link>
              <!-- <router-link
              to="/"
              class="
            block
            px-4
            py-2
            text-sm

          "
            >
             Показать только файлы
            </router-link>-->
              <router-link
                to="/"
                class="
            block
            px-4
            py-2
            text-sm

          "
              >
                Удалить
              </router-link>
            </div>
          </Transition>
        </div>
      </div>
      <div
        v-if="selectedTask.checklist"
        class="mt-3 checklist-custom"
      >
        <ul class="check-padding">
          <li
            v-for="(key,value) in selectedTask.checklist.split('\r\n\r\n')"
            :key="value"
          >
            <div v-if="selectedTask.checklist.split('\r\n\r\n')[value]!==''">
              <span v-if="selectedTask.checklist.split('\r\n\r\n')[value][0]==='1'">
                <del> <input
                  type="checkbox"
                  value="value"
                  checked="checked"
                  @click="changeCheck(selectedTask.uid,'0' + '\r\n' + selectedTask.checklist.split('\r\n\r\n')[value].replace('1','') + '\r\n\r\n')"
                >&nbsp;{{ selectedTask.checklist.split('\r\n\r\n')[value].replace('1','') }}</del>
              </span>
              <span v-else><input
                type="checkbox"
                value="value"
                @click="changeCheck(selectedTask.uid,'1' + '\r\n' + selectedTask.checklist.split('\r\n\r\n')[value].replace('0','') + '\r\n\r\n')"
              >&nbsp;{{ selectedTask.checklist.split('\r\n\r\n')[value].replace('0','') }}</span>
            </div>
          </li>
        </ul>
        <div>
          <button class="btn btn-transperant">
            Добавить
          </button>
        </div>
      </div>
      <div class="mt-3 description-content">
        <textarea v-html="selectedTask.comment"
          ref="comment"
          :value="selectedTask.comment"
          rows="10"
          cols="40"
          style="height: 100%"
          class="form-control comment-custom"
          @keyup="changeComment($refs.comment.value, $event)"
          @input="textareaResize"
        />
      </div>
      <div class="messages-and-files-custom">
        <div style="display: inline-block;width: 100%" id="showall"><p class="text-center date-messages-chat divider uppercase" @click="showHide">Показать все</p></div>
      <div
        v-if="taskFiles.length>0"
        class="mt-3 list-files-custom"
      >
        <div
          v-for="(key, value) in taskFiles.sort()"
          :key="value"
          class="mt-3 list-files-custom-item" :id="'hidden_'+value"
        >
          <div v-if="key.uid_creator!==cusers.current_user_uid">
            <div
              v-if="value===0"
              class="date-section"
            >
              <p
                class="text-center date-messages-chat divider "
              >
                {{ days[new Date(key.date_create.split('T')[0]).getDay()] }}, {{ new Date(key.date_create.split('T')[0]).getDate() }} {{ months[new Date(key.date_create).getMonth()] }}
              </p>
            </div>
            <div
              v-if="value===0"
              class="flex"
            >
              <p class="name-chat-custom">
                {{ employees[key.uid_creator].name }}
              </p>
              <img
                :src="employees[key.uid_creator].fotolink"
                class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                width="30"
                height="30"
              >
            </div>
            <div class="mt-1 chat-main">
              <div
                class="mt-1 file-custom_attach-left"
                :style="(key.file_name.split('.').pop()==='doc' || key.file_name.split('.').pop()==='xls' || key.file_name.split('.').pop()==='xlsx' || key.file_name.split('.').pop()==='txt' || key.file_name.split('.').pop()==='pdf' || key.file_name.split('.').pop()==='mov' || key.file_name.split('.').pop()==='mp4') ? 'background-color:#EDF7ED' : ''"
              >
                  <span v-if="key.file_name.split('.').pop()==='jpg' || key.file_name.split('.').pop()==='png' || key.file_name.split('.').pop()==='jpeg' || key.file_name.split('.').pop()==='gif' || key.file_name.split('.').pop()==='bmp'">
                  <a
                    :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid"
                    :id="key.uid">
                    {{getImgUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                </a>
                <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()==='mov' || key.file_name.split('.').pop()==='mp4'">
                  <a :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid" :id="key.uid">{{ key.file_name }}
                  {{getMovUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  </a>
                  <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()==='doc' || key.file_name.split('.').pop()==='xls' || key.file_name.split('.').pop()==='xlsx' || key.file_name.split('.').pop()==='txt' || key.file_name.split('.').pop()==='pdf'">
<a :id="key.uid"
  :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid"
>
  {{getDocUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  <svg
                    width="22"
                    height="27"
                    viewBox="0 0 22 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.6459 8.28333C21.675 8.3125 21.7042 8.37083 21.7334 8.42917C21.7625 8.51667 21.7917 8.63333 21.7917 8.75V24.7917C21.7917 25.9292 20.8875 26.8333 19.75 26.8333H2.25004C1.11254 26.8333 0.208374 25.9292 0.208374 24.7917V2.91667C0.208374 1.77917 1.11254 0.875 2.25004 0.875H13.9167C14.0334 0.875 14.15 0.904167 14.2084 0.933333H14.2375C14.2667 0.947917 14.2886 0.9625 14.3105 0.977083C14.3323 0.991667 14.3542 1.00625 14.3834 1.02083C14.4417 1.05 14.5 1.10833 14.5292 1.1375L21.5292 8.1375L21.5292 8.13751C21.5875 8.19584 21.6167 8.225 21.6459 8.28333ZM2.25004 2.625C2.07504 2.625 1.95837 2.74167 1.95837 2.91667V24.7917C1.95837 24.9667 2.07504 25.0833 2.25004 25.0833H19.75C19.925 25.0833 20.0417 24.9667 20.0417 24.7917V9.625H15.0834C13.9459 9.625 13.0417 8.72083 13.0417 7.58333V2.625H2.25004ZM14.7917 7.58333C14.7917 7.75833 14.9084 7.875 15.0834 7.875H18.8167L14.7917 3.85V7.58333ZM5.22504 11.375C4.70957 11.375 4.29171 11.7929 4.29171 12.3083C4.29171 12.8238 4.70957 13.2417 5.22504 13.2417H16.4834C16.9988 13.2417 17.4167 12.8238 17.4167 12.3083C17.4167 11.7929 16.9988 11.375 16.4834 11.375H5.22504ZM4.29171 9.1C4.29171 8.58453 4.70957 8.16667 5.22504 8.16667H10.65C11.1655 8.16667 11.5834 8.58453 11.5834 9.1C11.5834 9.61547 11.1655 10.0333 10.65 10.0333H5.22504C4.70957 10.0333 4.29171 9.61547 4.29171 9.1ZM5.22504 14.5833C4.70957 14.5833 4.29171 15.0012 4.29171 15.5167C4.29171 16.0321 4.70957 16.45 5.22504 16.45H16.4834C16.9988 16.45 17.4167 16.0321 17.4167 15.5167C17.4167 15.0012 16.9988 14.5833 16.4834 14.5833H5.22504ZM4.29171 18.725C4.29171 18.2095 4.70957 17.7917 5.22504 17.7917H16.4834C16.9988 17.7917 17.4167 18.2095 17.4167 18.725C17.4167 19.2405 16.9988 19.6583 16.4834 19.6583H5.22504C4.70957 19.6583 4.29171 19.2405 4.29171 18.725ZM5.22504 21C4.70957 21 4.29171 21.4179 4.29171 21.9333C4.29171 22.4488 4.70957 22.8667 5.22504 22.8667H16.4834C16.9988 22.8667 17.4167 22.4488 17.4167 21.9333C17.4167 21.4179 16.9988 21 16.4834 21H5.22504Z"
                      fill="#757575"
                    />
                  </svg>
  {{ key.file_name }}
                </a>
                  <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()==='mp3' || key.file_name.split('.').pop()==='wav' || key.file_name.split('.').pop()==='m4a'">
                 {{getAudioUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  <audio :id="key.uid"
                         :src="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid"
                         ref="audioPlayer"
                         controls
                  >
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                  <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()!=='app'">
                   <a :id="key.uid" :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid">{{ key.file_name }}
                            {{getAnyUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  </a>
                     <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
              </div>
            </div>
          </div>
          <div
            v-else
          >
            <div class="date-section">
              <p
                class="text-center date-messages-chat "
              >
                {{ days[new Date(key.date_create.split('T')[0]).getDay()] }}, {{ new Date(key.date_create.split('T')[0]).getDate() }} {{ months[new Date(key.date_create).getMonth()] }}
              </p>
            </div>
            <div class="table-cell float-right">
              <div class="chat-author-custom-right">
                <p class="name-chat-custom">
                  {{ employees[key.uid_creator].name }}
                </p>
                <img
                  :src="employees[key.uid_creator].fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
              </div>
            </div>
            <div class="mt-1 chat-main">
              <div
                class="mt-1 file-custom_attach-right"
              :style="(key.file_name.split('.').pop()==='doc' || key.file_name.split('.').pop()==='xls' || key.file_name.split('.').pop()==='xlsx' || key.file_name.split('.').pop()==='txt' || key.file_name.split('.').pop()==='pdf' || key.file_name.split('.').pop()==='mov' || key.file_name.split('.').pop()==='mp4') ? 'background-color:#FCEAEA;' : ''">
                <span v-if="key.file_name.split('.').pop()==='jpg' || key.file_name.split('.').pop()==='png' || key.file_name.split('.').pop()==='jpeg' || key.file_name.split('.').pop()==='gif' || key.file_name.split('.').pop()==='bmp'">
                  <a
                    :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid"
                    :id="key.uid">
                    {{getImgUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                </a>
                <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()==='mov' || key.file_name.split('.').pop()==='mp4'">
                  <a :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid" :id="key.uid" >
                         {{getMovUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}{{ key.file_name }}
                  </a>

                  <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()==='doc' || key.file_name.split('.').pop()==='xls' || key.file_name.split('.').pop()==='xlsx' || key.file_name.split('.').pop()==='txt' || key.file_name.split('.').pop()==='pdf'">
<a :id="key.uid"

  :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid"
>
        {{getDocUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  <svg
                    width="22"
                    height="27"
                    viewBox="0 0 22 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.6459 8.28333C21.675 8.3125 21.7042 8.37083 21.7334 8.42917C21.7625 8.51667 21.7917 8.63333 21.7917 8.75V24.7917C21.7917 25.9292 20.8875 26.8333 19.75 26.8333H2.25004C1.11254 26.8333 0.208374 25.9292 0.208374 24.7917V2.91667C0.208374 1.77917 1.11254 0.875 2.25004 0.875H13.9167C14.0334 0.875 14.15 0.904167 14.2084 0.933333H14.2375C14.2667 0.947917 14.2886 0.9625 14.3105 0.977083C14.3323 0.991667 14.3542 1.00625 14.3834 1.02083C14.4417 1.05 14.5 1.10833 14.5292 1.1375L21.5292 8.1375L21.5292 8.13751C21.5875 8.19584 21.6167 8.225 21.6459 8.28333ZM2.25004 2.625C2.07504 2.625 1.95837 2.74167 1.95837 2.91667V24.7917C1.95837 24.9667 2.07504 25.0833 2.25004 25.0833H19.75C19.925 25.0833 20.0417 24.9667 20.0417 24.7917V9.625H15.0834C13.9459 9.625 13.0417 8.72083 13.0417 7.58333V2.625H2.25004ZM14.7917 7.58333C14.7917 7.75833 14.9084 7.875 15.0834 7.875H18.8167L14.7917 3.85V7.58333ZM5.22504 11.375C4.70957 11.375 4.29171 11.7929 4.29171 12.3083C4.29171 12.8238 4.70957 13.2417 5.22504 13.2417H16.4834C16.9988 13.2417 17.4167 12.8238 17.4167 12.3083C17.4167 11.7929 16.9988 11.375 16.4834 11.375H5.22504ZM4.29171 9.1C4.29171 8.58453 4.70957 8.16667 5.22504 8.16667H10.65C11.1655 8.16667 11.5834 8.58453 11.5834 9.1C11.5834 9.61547 11.1655 10.0333 10.65 10.0333H5.22504C4.70957 10.0333 4.29171 9.61547 4.29171 9.1ZM5.22504 14.5833C4.70957 14.5833 4.29171 15.0012 4.29171 15.5167C4.29171 16.0321 4.70957 16.45 5.22504 16.45H16.4834C16.9988 16.45 17.4167 16.0321 17.4167 15.5167C17.4167 15.0012 16.9988 14.5833 16.4834 14.5833H5.22504ZM4.29171 18.725C4.29171 18.2095 4.70957 17.7917 5.22504 17.7917H16.4834C16.9988 17.7917 17.4167 18.2095 17.4167 18.725C17.4167 19.2405 16.9988 19.6583 16.4834 19.6583H5.22504C4.70957 19.6583 4.29171 19.2405 4.29171 18.725ZM5.22504 21C4.70957 21 4.29171 21.4179 4.29171 21.9333C4.29171 22.4488 4.70957 22.8667 5.22504 22.8667H16.4834C16.9988 22.8667 17.4167 22.4488 17.4167 21.9333C17.4167 21.4179 16.9988 21 16.4834 21H5.22504Z"
                      fill="#757575"
                    />
                  </svg>
  {{ key.file_name }}
                </a>
                  <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span v-else-if="key.file_name.split('.').pop()==='mp3' || key.file_name.split('.').pop()==='wav' || key.file_name.split('.').pop()==='m4a'">
                 {{getAudioUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  <audio :id="key.uid"
                    :src="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid"
                    ref="audioPlayer"
                    controls
                  >
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                  <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
                <span  v-else-if="key.file_name.split('.').pop()!=='app'">
                  <a :id="key.uid" :href="'https://web.leadertask.com/User/Files/GetFile?uid='+key.uid">{{ key.file_name }}
                            {{getAnyUrl(key.uid,key.file_name.split('.').pop(),key.file_name)}}
                  </a>
                     <div style="color:black"><strong>{{ new Date(key.date_create).toLocaleDateString() }} {{ new Date(key.date_create).toLocaleTimeString() }}</strong></div>
                <div style="color:#3E3D3B;">{{ formatBytes(key.file_size) }}</div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="taskMessages"
        class="mt-3 chat-custom"
      >

        <div
          v-for="(key,value) in taskMessages.sort()"
          :key="value"
          class="mt-3 display-none" @input.self="hide" :id="'hidden_'+value"
        >
          <div v-if="key.uid_creator!==cusers.current_user_uid">
            <div class="date-section">
              <p
                class="text-center date-messages-chat"
              >
                {{ days[new Date(key.date_create.split('T')[0]).getDay()] }}, {{ new Date(key.date_create.split('T')[0]).getDate() }} {{ months[new Date(key.date_create).getMonth()] }}
              </p>
            </div>
            <div class="flex">
              <p class="name-chat-custom">
                {{ employees[key.uid_creator].name }}
              </p>
              <img
                :src="employees[key.uid_creator].fotolink"
                class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                width="30"
                height="30"
              >
            </div>
            <div
              class="chat-main"
            >
              <div
                class="mt-1 msg-custom-chat-left"
                style="background-color:#EDF7ED;"
              >
                {{ key.msg }}
                <div class="time-chat">
                  {{ key.date_create.split('T')[1].split(":")[0] }}:{{ key.date_create.split('T')[1].split(":")[1] }}
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="date-section">
              <p
                class="text-center date-messages-chat"
              >
                {{ days[new Date(key.date_create.split('T')[0]).getDay()] }}, {{ new Date(key.date_create.split('T')[0]).getDate() }} {{ months[new Date(key.date_create).getMonth()] }}
              </p>
            </div>
            <div class="table-cell float-right">
              <div class="chat-author-custom-right">
                <p class="name-chat-custom">
                  {{ employees[key.uid_creator].name }}
                </p>
                <img
                  :src="employees[key.uid_creator].fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
              </div>
            </div>
            <div
              class="chat-main"
            >
              <div
                class="mt-1 msg-custom-chat-right"
                style="background-color:#FCEAEA;"
              >
                {{ key.msg }}
                <div class="time-chat">
                  {{ key.date_create.split('T')[1].split(":")[0] }}:{{ key.date_create.split('T')[1].split(":")[1] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="form-send-message">
      <div class="input-group">
        <span class="input-group-addon input-group-attach">
          <div class="example-1">
            <label class="label">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.94475 17.443C3.17452 18.6611 4.78671 19.2627 6.3989 19.2627C8.0111 19.2627 9.62329 18.6537 10.8531 17.4356L18.5841 9.77812C20.3388 8.04015 20.3388 5.21038 18.5841 3.47241C17.7368 2.63313 16.6045 2.16522 15.4047 2.16522C14.2049 2.16522 13.0726 2.6257 12.2253 3.47241L5.12415 10.506C4.07435 11.5458 4.07435 13.2466 5.12415 14.2865C6.17395 15.3263 7.89112 15.3263 8.94092 14.2865L13.6125 9.65929C13.965 9.31021 13.965 8.74574 13.6125 8.39666C13.2601 8.04758 12.6902 8.04758 12.3378 8.39666L7.67366 13.0313C7.32123 13.3803 6.75134 13.3803 6.3989 13.0313C6.04647 12.6822 6.04647 12.1177 6.3989 11.7686L13.4926 4.74246C14.0025 4.23741 14.6773 3.96261 15.4047 3.96261C16.1246 3.96261 16.8069 4.23741 17.3168 4.74246C18.3666 5.78228 18.3666 7.48311 17.3168 8.52292L9.5783 16.1804C7.82364 17.9184 4.96668 17.9184 3.21201 16.1804C2.36467 15.3411 1.89976 14.2196 1.89976 13.0313C1.89976 11.8429 2.36467 10.7214 3.21951 9.88211L10.943 2.22463C11.2955 1.87555 11.2955 1.31108 10.943 0.962005C10.5906 0.612925 10.0207 0.612925 9.66829 0.962005L1.94475 8.61948C0.752474 9.79298 0.100098 11.3601 0.100098 13.0313C0.100098 14.695 0.752474 16.2621 1.94475 17.443Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>
              <input
                ref="file_attach"
                type="file"
                name="file_attach"
                @change="createTaskFile($event)"
              >
            </label>
          </div>
        </span>
        <input
          v-model="taskMsg"
          type="text"
          class="form-control text-group-design"
          placeholder="Введите сообщение"
          @keyup.enter="createTaskMsg"
        >
        <span class="input-group-addon input-group-btn-send">
          <button
            type="button"
            name="btn-send"
            class="btn-send-custom"
            @click="createTaskMsg"
          >
            <svg
              width="24"
              height="26"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.8021 10.5763C23.541 10.054 23.1166 9.59697 22.5617 9.33583L3.82473 0.261142C3.43302 0.0979283 3.07395 0 2.64959 0C1.63767 0 0.723669 0.58757 0.26667 1.50157C-0.0597576 2.18707 -0.0924003 2.93785 0.201385 3.65599L3.43302 11.7514L0.201385 19.8142C-0.353542 21.1852 0.331955 22.7194 1.70295 23.2743C1.99674 23.4049 2.32316 23.4701 2.68223 23.4701C3.07395 23.4701 3.46566 23.3722 3.82473 23.209L22.5943 14.1343C23.2472 13.8405 23.7042 13.2856 23.9327 12.6327C24.1612 11.9473 24.1285 11.1965 23.8021 10.5763ZM2.02938 20.5649L5.16308 12.7307H20.8969L2.94338 21.4137C2.84545 21.4463 2.74752 21.4789 2.64959 21.4789C2.38845 21.4789 2.15995 21.3157 2.06202 21.0872C1.96409 20.924 1.96409 20.7282 2.02938 20.5649ZM5.16308 10.7395L2.02938 2.90521C1.93145 2.64406 1.99674 2.35028 2.19259 2.15442C2.32316 2.02385 2.48638 1.95857 2.64959 1.95857C2.74752 1.95857 2.84545 1.99121 2.94338 2.02385L20.8969 10.7068H5.16308V10.7395Z"
                fill="#666666"
              />
            </svg>

          </button>
        </span>
      </div>
    </div>
  </div>
</template>
<style>
.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
</style>
