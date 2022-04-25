import { createProject } from '@/websync/project.js'
import { createTask } from '@/websync/task.js'
import { createMessage } from '@/websync/task_message.js'
import * as TYPES from '@/websync/types.js'
import { notify } from 'notiwind'

function showNotify (notification) {
  notify(notification, 30000)
  const nt = new Audio(require('@/assets/sounds/notification.mp3'))
  nt.volume = 0.5
  nt.play()
}

export default function processCreate (obj) {
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_TAG:
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      showNotify({
        group: 'top',
        title: 'Новый проект',
        obj: obj,
        text: obj.obj.name
      })
      createProject(obj)
      break
    case TYPES.TYPE_OBJECT_TASK:
      if (obj.obj.type !== 1 && obj.obj.type !== 2) {
        showNotify({
          group: 'top',
          title: 'Новая задача',
          obj: obj,
          text: obj.obj.name
        })
      }
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
      console.log('TYPE_OBJECT_TASK_MSG', obj)
      showNotify({
        group: 'top',
        title: 'Новое сообщение',
        obj: obj,
        text: obj.obj.msg
      })
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
