import store from '@/store/index.js'
import { notify } from 'notiwind'
import { computed } from 'vue'
import { getInspectorMessage } from '@/inspector/message.js'

function showNotify (notification) {
  notify(notification, 30000)
  const nt = new Audio(require('@/assets/sounds/notification.mp3'))
  nt.volume = 0.5
  nt.play()
}

const user = computed(() => store.state.user.user)

export default function initInspectorSocket () {
  const socket = new WebSocket(process.env.VUE_APP_INSPECTOR_WS)
  socket.onopen = function (event) {
    const auth = {
      type: 'auth',
      message: user.value.current_user_uid,
      data: user.value.current_user_email
    }
    socket.send(JSON.stringify(auth))
  }
  socket.onmessage = function (event) {
    parseMessage(event.data)
  }
  socket.onclose = function (event) {
    setTimeout(function () {
      initInspectorSocket()
    }, 2500)
  }
  socket.onerror = function () {
    socket.close()
  }
}

function parseMessage (data) {
  try {
    const parsedData = JSON.parse(data)
    showNotify({ group: 'inspector', title: 'Инспектор', text: getInspectorMessage(parsedData.message, parsedData.task.taskJson), task: parsedData.task.taskJson })
  } catch (e) {
    console.log(e)
  }
}
