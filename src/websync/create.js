import store from '@/store/index.js'
import { createProject } from '@/websync/project.js'
import { createTask } from '@/websync/task.js'
import { createCard } from '@/websync/card.js'
import { createMessage } from '@/websync/task_message.js'
import { createCardMessage } from '@/websync/card_message.js'
import * as TYPES from '@/websync/types.js'
import { showNotify } from '@/store/helpers/functions'
import { createColor } from '@/websync/colors_dop.js'
import { createTag } from '@/websync/tag.js'

function currentUserUid () {
  return store?.state?.user?.user?.current_user_uid
}

function isNotificationSoundOn () {
  return store?.state?.inspector?.is_notification_sound_on
}

function currentUserEmail () {
  return store?.state?.user?.user?.current_user_email
}

export default function processCreate (obj) {
  console.log('create type', obj.type)
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_TAG:
      createTag(obj)
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      console.log('TYPE_OBJECT_PROJECT', obj)
      if (obj.obj.email_creator !== currentUserEmail()) {
        showNotify({
          group: 'top',
          title: 'Новый проект',
          obj: obj,
          text: obj.obj.name
        }, isNotificationSoundOn.value)
        const websyncNotification = new Notification('Новый проект', { body: obj.obj.name })
        console.log(websyncNotification)
      }
      createProject(obj)
      break
    case TYPES.TYPE_OBJECT_TASK:
      if (
        obj.obj.uid_customer !== currentUserUid() &&
        obj.obj.email_performer === currentUserEmail()
      ) {
        showNotify({
          group: 'top',
          title: 'Новое поручение',
          obj: obj,
          text: obj.obj.name
        }, isNotificationSoundOn.value)
        const websyncNotification = new Notification('Новое поручение', {
          body: obj.obj.name,
          icon: '/favicon.ico'
        })
        websyncNotification.onclick = () => {
          const link = `${window.location.origin}/task/${obj.obj.uid}`
          window.open(link)
        }
        console.log('notify', websyncNotification)
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
      createColor(obj)
      break
    case TYPES.TYPE_OBJECT_PERIOD:
      break
    case TYPES.TYPE_OBJECT_PROJECT_MEMBER:
      break
    case TYPES.TYPE_OBJECT_TASK_FILE:
      break
    case TYPES.TYPE_OBJECT_TASK_MSG:
      // выводит вообще все сообщения - а надо только те что для меня
      // в текущем api не сделать
      // if (obj.obj.uid_creator !== currentUserUid()) {
      //   showNotify({
      //     group: 'top',
      //     title: 'Новое сообщение',
      //     obj: obj,
      //     text: obj.obj.msg
      //   })
      // }
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
      createCard(obj)
      break
    case TYPES.TYPE_OBJECT_CARD_FILE:
      createCardMessage(obj)
      break
    case TYPES.TYPE_OBJECT_CARD_MSG:
      createCardMessage(obj)
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
