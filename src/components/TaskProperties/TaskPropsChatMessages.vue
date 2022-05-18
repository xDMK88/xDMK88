<template>
  <div class="messages">
    <div
      v-for="(message, index) in taskMessages"
      :key="index"
      class="message"
    >
      <div
        v-if="
          index == taskMessages.length - 1 ||
            index == taskMessages.length - 2 ||
            showAllMessages
        "
      >
        <div
          v-if="
            index == 0 ||
              (taskMessages[index - 1] &&
                new Date(taskMessages[index - 1].date_create).toDateString() !=
                new Date(message.date_create).toDateString())
          "
          class="text-center"
        >
          <p class="text-xs text-gray-500 dark:text-gray-300 my-3">
            {{
              new Date(message.date_create).toLocaleString('default', {
                weekday: 'long'
              })
            }},
            {{ new Date(message.date_create).getDate() }}
            {{
              new Date(message.date_create).toLocaleString('default', {
                month: 'short'
              })
            }}
          </p>
        </div>

        <!-- Chat message interlocutor -->
        <div
          v-if="
            message.uid_creator !== currentUserUid &&
              message.uid_creator !== 'inspector' &&
              !message.uid_file &&
              !showOnlyFiles
          "
        >
          <div
            v-if="
              index == 0 ||
                (taskMessages[index - 1] &&
                  taskMessages[index - 1].uid_creator != message.uid_creator)
            "
            class="flex"
          >
            <p
              v-if="employees[message.uid_creator]"
              class="name-chat-custom dark:text-gray-100"
            >
              {{ employees[message.uid_creator].name }}
            </p>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-left text-sm bg-[#EDF7ED] dark:bg-gray-800 dark:text-gray-100"
            >
              <div
                v-linkify:options="{ className: 'text-blue-600' }"
                v-html="message.msg.replaceAll('\n', '<br/>')"
              />
              <div
                v-if="message.date_create"
                class="time-chat dark:text-gray-300"
              >
                {{ getMessageTimeString(message.date_create) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chat message inspector -->
        <div
          v-if="message.uid_creator === 'inspector' && !message.uid_file && !showOnlyFiles"
        >
          <div
            v-if="
              index == 0 ||
                (taskMessages[index - 1] &&
                  taskMessages[index - 1].uid_creator != message.uid_creator)
            "
            class="flex"
          >
            <p
              class="name-chat-custom dark:text-gray-100 font-bold"
            >
              Inspector
            </p>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-left font-semibold text-sm bg-blue-50 dark:bg-gray-800 dark:text-gray-100"
            >
              <div
                v-linkify:options="{ className: 'text-blue-600' }"
                v-html="getInspectorMessage(message.type, selectedTask).replaceAll('\n', '<br/>')"
              />

              <!-- Origin message -->
              <div
                v-if="message.type == 1"
                class="flex mt-2"
              >
                <div
                  class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1"
                  @click="answerInspectorMessage(message, 1, 'Да'); message.performer_answer = 1"
                >
                  <span class="text-sm text-gray-600"> Да </span>
                </div>
                <div
                  class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1"
                  @click="answerInspectorMessage(message, 0, 'Нет'); message.performer_answer = 0"
                >
                  <span class="text-sm text-gray-600"> Нет </span>
                </div>
              </div>

              <!-- Ignore message -->
              <div
                v-if="message.type == 2"
                class="flex mt-2"
              >
                <div
                  class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1"
                  @click="answerInspectorMessage(message, 1, 'Вопросов нет - приступаю - будет готово ' + dateToLabelFormat(new Date(selectedTask.customer_date_end)) + ' до ' + dateToTimeFormat(new Date(selectedTask.customer_date_end))); message.performer_answer = 1"
                >
                  <span class="text-sm text-gray-600"> Вопросов нет - приступаю - будет готово {{ dateToLabelFormat(new Date(selectedTask.customer_date_end)) }} до {{ dateToTimeFormat(new Date(selectedTask.customer_date_end)) }} </span>
                </div>
              </div>

              <div
                v-if="message.date_create"
                class="time-chat dark:text-gray-300"
              >
                {{ getMessageTimeString(message.date_create) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chat file interlocutor -->
        <div v-if="message.uid_creator !== currentUserUid && message.uid_file">
          <div
            v-if="
              index == 0 ||
                (taskMessages[index - 1] &&
                  taskMessages[index - 1].uid_creator != message.uid_creator)
            "
            class="flex"
          >
            <p
              v-if="employees[message.uid_creator]"
              class="name-chat-custom"
            >
              {{ employees[message.uid_creator].name }}
            </p>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-left bg-[#EDF7ED] dark:bg-gray-800 text-sm items-center"
            >
              <FileMessage :file="message" />
              <div>
                <div>
                  {{ message.msg }}
                </div>
                <div
                  v-if="message.date_create"
                  class="mt-1 flex justify-between text-gray-400 dark:text-gray-300 text-xs"
                >
                  <p>{{ formatBytes(message.file_size) }}</p>
                  <p>{{ getMessageTimeString(message.date_create) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat message from myself -->
        <div
          v-if="
            message.uid_creator == currentUserUid &&
              !message.uid_file &&
              !showOnlyFiles
          "
        >
          <div class="table-cell float-right">
            <div
              v-if="
                index == 0 ||
                  (taskMessages[index - 1] &&
                    taskMessages[index - 1].uid_creator != message.uid_creator)
              "
              class="chat-author-custom-right"
            >
              <p
                v-if="employees[message.uid_creator]"
                class="name-chat-custom dark:text-gray-100"
              >
                {{ employees[message.uid_creator].name }}
              </p>
            </div>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-right bg-[#FCEAEA] dark:bg-gray-800 text-sm dark:text-gray-100"
            >
              <ChatLoader v-if="uploadStarted && message.loading" />
              <div
                v-linkify
                v-linkify:options="{ className: 'text-blue-600' }"
                v-html="message.msg.replaceAll('\n', '<br/>')"
              />
              <div
                v-if="message.date_create"
                class="time-chat dark:text-gray-300"
              >
                {{ getMessageTimeString(message.date_create) }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="message.uid_creator == currentUserUid && message.uid_file">
          <div class="table-cell float-right">
            <div
              v-if="
                index == 0 ||
                  (taskMessages[index - 1] &&
                    taskMessages[index - 1].uid_creator != message.uid_creator)
              "
              class="chat-author-custom-right"
            >
              <p
                v-if="employees[message.uid_creator]"
                class="name-chat-custom dark:text-gray-100"
              >
                {{ employees[message.uid_creator].name }}
              </p>
            </div>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-right bg-[#FCEAEA] dark:bg-gray-800 text-sm"
            >
              <FileMessage :file="message" />
              <div>
                <div>
                  {{ message.msg }}
                </div>
                <div
                  v-if="message.date_create && message.file_size"
                  class="mt-1 flex justify-between text-gray-400 dark:text-gray-300 text-xs"
                >
                  <p>{{ formatBytes(message.file_size) }}</p>
                  <p>{{ getMessageTimeString(message.date_create) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatLoader from '@/components/properties/ChatLoader'
import FileMessage from '@/components/properties/FileMessage.vue'
import { getInspectorMessage } from '@/inspector/message'
import linkify from 'vue-linkify'

import * as INSPECTOR from '@/store/actions/inspector'
import { CREATE_MESSAGE_REQUEST } from '@/store/actions/taskmessages'

export default {
  directives: {
    linkify
  },
  components: {
    ChatLoader,
    FileMessage
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    taskMessages: {
      type: Object,
      default: () => ({})
    },
    showAllMessages: {
      type: Boolean,
      default: true
    },
    showOnlyFiles: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return { getInspectorMessage }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    employees () {
      return this.$store.state.employees.employees
    },
    // need for inspector messages
    selectedTask () {
      return this.$store.state.tasks.selectedTask
    },
    uploadStarted () {
      return this.$store.state.taskfilesandmessages.uploadStarted
    }
  },
  methods: {
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    sendTaskMsg (msg) {
      const date = new Date()
      const month = this.pad2(date.getUTCMonth() + 1)
      const day = this.pad2(date.getUTCDate())
      const year = this.pad2(date.getUTCFullYear())
      const hours = this.pad2(date.getUTCHours())
      const minutes = this.pad2(date.getUTCMinutes())
      const seconds = this.pad2(date.getUTCSeconds())
      const dateCreate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
      const data = {
        uid_task: this.selectedTask.uid,
        uid_creator: this.user.current_user_uid,
        uid_msg: this.uuidv4(),
        date_create: dateCreate,
        text: msg,
        msg: msg
      }
      this.$store.dispatch(CREATE_MESSAGE_REQUEST, data).then(
        resp => {
          this.selectedTask.has_msgs = true
          if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
            if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
              this.selectedTask.status = 9
            }
          }
          const elment = document.getElementById('content').lastElementChild
          elment.scrollIntoView({ behavior: 'smooth' })
        })
    },
    answerInspectorMessage (message, answerType, answer) {
      if (message.performer_answer === null) {
        this.$store.dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, { id: message.id, answer: answerType }).then(() => {
          message.peformer_answer = answerType
          this.sendTaskMsg(answer)
        })
      }
    },
    pad2 (n) {
      return (n < 10 ? '0' : '')
    },
    dateToTimeFormat (date) {
      const hours = this.pad2(date.getHours())
      const seconds = this.pad2(date.getSeconds())
      return hours + ':' + seconds
    },
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      return day + ' ' + month
    },
    getMessageTimeString (dateCreate) {
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      if (dateCreate[dateCreate.length - 1] !== 'Z') {
        dateCreate += 'Z'
      }
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  }
}
</script>

<style scoped>
.name-chat-custom {
  font-size: 13px;
  color: #a6a6a6;
}
.chat-author-custom-right {
  text-align: right;
  float: right;
  /* width: 100%; */
  display: flex;
}
.chat-main {
  width: 100%;
  display: inline-block;
}
.msg-custom-chat-left {
  float: left;
  padding: 8px 10px;
  width: 80%;
  min-height: 40px;
  display: table-cell;
  max-width: 85%;
  min-width: 150px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.msg-custom-chat-right {
  float: right;
  padding: 8px 10px;
  min-height: 40px;
  display: table-cell;
  max-width: 85%;
  min-width: 150px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.time-chat {
  text-align: right;
  font-size: 12px;
  color: #a8afca;
}
</style>
