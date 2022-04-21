import * as TYPES from '@/websync/types.js'
import { createMessage } from '@/websync/task_message.js'
import { createTask } from '@/websync/task.js'
import { notify } from 'notiwind'

export default function processCreate (obj) {
  const nt = new Audio(require('@/assets/sounds/notification.mp3'))
  nt.volume = 0.5
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_TAG:
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      break
    case TYPES.TYPE_OBJECT_TASK:
      createTask(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT:
      break
    case TYPES.TYPE_OBJECT_CONTACT_GROUP:
      break
    case TYPES.TYPE_OBJECT_CONTACT_COMMUNICATION:
      break
    case TYPES.TYPE_OBJECT_GROUP:
      break
    case TYPES.TYPE_OBJECT_FILTER:
      break
    case TYPES.TYPE_OBJECT_MARKER:
      break
    case TYPES.TYPE_OBJECT_PERIOD:
      break
    case TYPES.TYPE_OBJECT_PROJECT_MEMBER:
      break
    case TYPES.TYPE_OBJECT_TASK_FILE:
      break
    case TYPES.TYPE_OBJECT_TASK_MSG:
      notify({
        group: 'top',
        title: 'Новое сообщение',
        obj: obj,
        text: obj.obj.msg
      }, 30000)
      nt.play()
      createMessage(obj)
      break
    case TYPES.TYPE_OBJECT_TASK_TAG:
      break
    case TYPES.TYPE_OBJECT_GROUP_MEMBER:
      break
    case TYPES.TYPE_OBJECT_LABEL:
      break
    case TYPES.TYPE_OBJECT_TASK_LABEL:
      break
    case TYPES.TYPE_OBJECT_FILE:
      break
    case TYPES.TYPE_OBJECT_EMP:
      break
    case TYPES.TYPE_OBJECT_CONTACT_FILE:
      break
    case TYPES.TYPE_OBJECT_CONTACT_FOTO:
      break
    case TYPES.TYPE_OBJECT_USER_GROUP:
      break
    case TYPES.TYPE_OBJECT_INVITE:
      break
    case TYPES.TYPE_OBJECT_NOTIFICATION:
      break
    case TYPES.TYPE_OBJECT_BOARD:
      break
    case TYPES.TYPE_OBJECT_CARD:
      break
    case TYPES.TYPE_OBJECT_CARD_FILE:
      break
    case TYPES.TYPE_OBJECT_CARD_MSG:
      break
    case TYPES.TYPE_OBJECT_CLIENT:
      break
    case TYPES.TYPE_OBJECT_CLIENT_FILE:
      break
    case TYPES.TYPE_OBJECT_CLIENT_MSG:
      break
    case TYPES.TYPE_OBJECT_CLIENT_EXT_FIELD:
      break
    case TYPES.TYPE_OBJECT_LOCALIZE:
      break
    case TYPES.TYPE_OBJECT_OPTIONS:
      break
  }
}
