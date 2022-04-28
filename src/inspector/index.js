import store from '@/store/index.js'
import { computed } from 'vue'
const user = computed(() => store.state.user.user)

export default function initInspectorSocket () {
  const socket = new WebSocket(process.env.VUE_APP_INSPECTOR_WS)
  socket.onopen = function (event) {
    const auth = { type: 'auth', message: user.value.current_user_uid }
    socket.send(JSON.stringify(auth))
  }
  socket.onmessage = function (event) {
    parseMessage(event.data)
  }
}

function parseMessage (data) {
  console.log(data)
}
