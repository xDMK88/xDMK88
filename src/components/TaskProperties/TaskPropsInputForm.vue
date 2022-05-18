<template>
<div class="form-send-message">
    <img
      v-if="this.isloading"
      src="/ajaxloader.gif"
    >
    <div
      :id="'copypaste_' + task.uid"
      class="сopypastefiles"
    />
    <div class="quote-request" />
    <div class="input-group bg-gray-100 rounded-3xl">
      <span class="input-group-addon input-group-attach dark:bg-gray-800 dark:text-gray-100">
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
              multiple="multiple"
              name="file_attach"
              @change="createTaskFile($event)"
            >
          </label>
        </div>
      </span>
      <textarea
        ref="taskMsgEdit"
        v-model="taskMsg"
        class="form-control mt-[7px] text-group-design task-msg overflow-auto scroll-style dark:bg-gray-800 dark:text-gray-100"
        placeholder="Введите сообщение"
        rows="58"
        @input="onInputTaskMsg"
        @keydown.enter.exact.prevent="sendTaskMsg"
      />
      <span class="input-group-addon input-group-btn-send dark:bg-gray-800 dark:text-gray-100">
        <button
          type="button"
          name="btn-send"
          class="btn-send-custom"
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
</template>
<script>
import { ref } from 'vue'
import * as INSPECTOR from '@/store/actions/inspector.js'
import * as TASK from '@/store/actions/tasks.js'
import * as FILES from '@/store/actions/taskfiles.js'
import * as MSG from '@/store/actions/taskmessages'

export default {
  data: () => ({
    isloading: false,
    files: [],
    taskMsg: ref('')
  }),
  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
    })
  },
  methods: {
    pad2: function (n) {
      return (n < 10 ? '0' : '') + n
    },
    uuidv4: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    _linkify: function (text) {
      return text.replace(/(lt?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    },
    onPasteEvent: function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      let loadFile = false
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_task: this.task.uid,
            name: formData
          }
          loadFile = true
          this.isloading = true
          this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data)
            .then((resp) => {
              this.isloading = false
              if (this.task.type === 2 || this.task.uid.type === 3) {
                if ([1, 5, 7, 8].includes(this.task.status)) {
                  const status = {
                    uid: this.task.uid,
                    value: 9
                  }
                  this.$store.commit(TASK.CHANGE_TASK_STATUS, status)
                }
              }
              this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
            })
        }
      }
      if (!loadFile) {
        this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
      }
    },
    onInputTaskMsg: function () {
      this.$refs.taskMsgEdit.style.height = '40px'
      const defSendHeight = 105
      const defEditHeight = 40
      const defEditHeightMax = 100
      const scrollHeight = this.$refs.taskMsgEdit.scrollHeight
      const scrollHeightFix = scrollHeight < defEditHeight ? defEditHeight : scrollHeight > defEditHeightMax ? defEditHeightMax : scrollHeight
      const sendHeight = defSendHeight + scrollHeightFix - defEditHeight
      this.$refs.taskMsgEdit.style.height = scrollHeight + 'px'
      document.documentElement.style.setProperty('--hex-parent-height', sendHeight + 'px')
    },
    sendTaskMsg: function () {
      const date = new Date()
      const month = this.pad2(date.getUTCMonth() + 1)
      const day = this.pad2(date.getUTCDate())
      const year = this.pad2(date.getUTCFullYear())
      const hours = this.pad2(date.getUTCHours())
      const minutes = this.pad2(date.getUTCMinutes())
      const seconds = this.pad2(date.getUTCSeconds())
      const dateCreate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
      const msgtask = this._linkify(this.taskMsg)

      const data = {
        uid_task: this.task.uid,
        uid_creator: this.user.current_user_uid,
        uid_msg: this.uuidv4(),
        date_create: dateCreate,
        text: this.taskMsg,
        msg: msgtask
      }

      this.$store.dispatch(MSG.CREATE_MESSAGE_REQUEST, data)
        .then((resp) => {
          const lastInspectorMessage = this.taskMessagesAndFiles[this.taskMessagesAndFiles.length - 2].uid_creator === 'inspector' ? this.taskMessagesAndFiles[this.taskMessagesAndFiles.length - 2] : false
          console.log('lastInspectorMessage: ', lastInspectorMessage)
          if (lastInspectorMessage) {
            this.$store.dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, { id: lastInspectorMessage.id, answer: 1 }).then(() => {
              lastInspectorMessage.performer_answer = 1
            })
          }

          this.$store.commit(TASK.HAS_MSGS, this.task.uid, true)
          if (this.task.type === 2 || this.task.type === 3) {
            if ([1, 5, 7, 8].includes(this.task.status)) {
              const status = {
                uid: this.task.uid,
                value: 9
              }
              this.$store.commit(TASK.CHANGE_TASK_STATUS, status)
            }
          }
          this.$store.commit(TASK.MSG_EQUAL, this.task.uid, decodeURIComponent(this.taskMsg))
        })
      this.taskMsg = ''
    },
    createTaskFile: function (event) {
      console.log(event.target.files)
      this.files = event.target.files
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        uid_task: this.task.uid,
        name: formData
      }

      for (const formItem of formData) {
        this.$store.commit(
          'createLoadingFile',
          {
            msg: formItem[1].name,
            uid_creator: this.user.current_user_uid,
            date_create: new Date().toISOString(),
            file_size: formItem[1].size
          })
      }

      this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data)
        .then((resp) => {
          if (this.task.type === 2 || this.task.type === 3) {
            if ([1, 5, 7, 8].includes(this.task.status)) {
              const status = {
                uid: this.task.uid,
                value: 9
              }
              this.$store.commit(TASK.CHANGE_TASK_STATUS, status)
            }
          }
          this.$store.commit(TASK.HAS_FILES, this.task, true)
          if (this.task.uid_customer === this.user.current_user_uid && (this.task.status === 5 || this.task.status === 7)) {
            const status = {
              uid: this.task.uid,
              value: 9
            }
            this.$store.commit(TASK.CHANGE_TASK_STATUS, status)
          }
        })
    }
  }
}
</script>
