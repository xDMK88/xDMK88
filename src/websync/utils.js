import store from '@/store/index.js'
import { computed } from 'vue'

const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)

function isTaskIsSharedForMe (task) {
  return (task.emails.includes(user.value.current_user_email) && (task.type === 1 || task.type === 2))
}

export function shouldAddTaskIntoList (task, lastNavStackElement) {
  // если у задачи есть uid_parent то сначала попытаться его вставить его в родительскую задачу текущего списка

  // Adding new task by date request
  // first look date_end in selected day
  //  check type 2 then check date_end < than selected date then add, if date_end > then throw away

  if (
    lastNavStackElement.key === 'taskListSource' &&
    lastNavStackElement.value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b'
  ) {
    if (
      task.date_begin &&
      task.date_begin !== '0001-01-01T00:00:00'
    ) {
      const navStackDate = new Date(lastNavStackElement.value.param)
      navStackDate.setHours(0, 0, 0, 0)
      const taskDateEnd = new Date(task.date_end)
      taskDateEnd.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      if (
        task.type !== 2 &&
        new Date(lastNavStackElement.value.param).toLocaleString().split(',')[0] === new Date(task.date_begin).toLocaleString().split(',')[0]
      ) {
        return true
      } else if (
        navStackDate <= currentDate
      ) {
        const isTaskCompleted = (task.status === 1 || task.status === 7) ||
                                (task.type === 3 && (task.status === 5 || task.status === 8))

        if (!isTaskCompleted && taskDateEnd < navStackDate) {
          return true
        }
      }
    } else if (
      task.customer_date_begin &&
      task.customer_date_begin !== '0001-01-01T00:00:00' &&
      (isTaskIsSharedForMe(task) || task.type === 3)
    ) {
      const navStackDate = new Date(lastNavStackElement.value.param)
      navStackDate.setHours(0, 0, 0, 0)
      const taskDateEnd = new Date(task.customer_date_end)
      taskDateEnd.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      if (
        task.type !== 2 &&
        new Date(lastNavStackElement.value.param).toLocaleString().split(',')[0] === new Date(task.customer_date_begin).toLocaleString().split(',')[0]
      ) {
        return true
      } else if (
        navStackDate <= currentDate
      ) {
        const isTaskCompleted = (task.status === 1 || task.status === 7) ||
                                (task.type === 3 && (task.status === 5 || task.status === 8))

        if (!isTaskCompleted && taskDateEnd < navStackDate) {
          return true
        }
      }
    }
    return false
  }

  if (
    task.date_begin &&
    task.date_begin !== '0001-01-01T00:00:00'
  ) {
    if (
      task.type === 2 &&
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b' &&
      new Date(lastNavStackElement.value.param).toLocaleString().split(',')[0] === new Date(task.date_begin).toLocaleString().split(',')[0]
    ) {
      return true
    }
  }
  // Adding new task by assigned to property
  if (
    task.email_performer &&
    task.email_performer !== user.value.current_user_email &&
    task.uid_customer === user.value.current_user_uid
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '169d728b-b88b-462d-bd8e-3ac76806605b' &&
      lastNavStackElement.value.param === task.email_performer
    ) {
      return true
    }
  }
  // Adding new task by assigned by property
  if (
    task.email_performer &&
    task.email_performer === user.value.current_user_email &&
    task.uid_customer !== user.value.current_user_uid
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '511d871c-c5e9-43f0-8b4c-e8c447e1a823' &&
      lastNavStackElement.value.param === employees.value[task.uid_customer]?.email
    ) {
      return true
    }
  }
  // Adding new task by private project
  if (
    task.uid_project &&
    task.uid_project !== '00000000-0000-0000-0000-000000000000'
  ) {
    if (
      lastNavStackElement.key === 'greedSource' &&
      lastNavStackElement.global_property_uid === '7af232ff-0e29-4c27-a33b-866b5fd6eade' &&
      lastNavStackElement.uid === task.uid_project
    ) {
      return true
    }
  }
  // Adding new task by shared project
  if (
    task.uid_project &&
    task.uid_project !== '00000000-0000-0000-0000-000000000000'
  ) {
    if (
      lastNavStackElement.key === 'greedSource' &&
      lastNavStackElement.global_property_uid === '431a3531-a77a-45c1-8035-f0bf75c32641' &&
      lastNavStackElement.uid === task.uid_project
    ) {
      return true
    }
  }
  // Adding new task by overdue flag
  if (
    task.email_performer &&
    task.email_performer === user.value.current_user_email &&
    new Date(task.customer_date_end) < new Date() // is_overdue is false by default TODO: say to alex to fix this in websync
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '46418722-a720-4c9e-b255-16db4e590c34'
    ) {
      return true
    }
  }
  // Adding new task by unread flag
  if (task.readed === 0) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === 'fa042915-a3d2-469c-bd5a-708cf0339b89'
    ) {
      return true
    }
  }
  // Adding new task by access
  if (task.emails) {
    if (
      task.emails.split('..').includes(user.value.current_user_email) &&
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === 'fa042915-a3d2-469c-bd5a-708cf0339b89'
    ) {
      return true
    }
  }
  // Adding new task by focus flag
  if (task.focus === 1) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === '6fc44cc6-9d45-4052-917e-25b1189ab141'
    ) {
      return true
    }
  }
  // Adding new task by tag
  if (
    task.tags.includes(lastNavStackElement.value.param) &&
    lastNavStackElement.key === 'taskListSource' &&
    lastNavStackElement.value.uid === '00a5b3de-9474-404d-b3ba-83f488ac6d30'
  ) {
    return true
  }
  // Adding new task by color
  if (
    task.uid_marker &&
    task.uid_marker !== '00000000-0000-0000-0000-000000000000'
  ) {
    if (
      lastNavStackElement.key === 'taskListSource' &&
      lastNavStackElement.value.uid === 'ed8039ae-f3de-4369-8f32-829d401056e9' &&
      lastNavStackElement.value.param === task.uid_marker
    ) {
      return true
    }
  }
  // Add to unsorted list
  if (
    lastNavStackElement.key === 'taskListSource' &&
    lastNavStackElement.value.uid === '5183b619-3968-4c3a-8d87-3190cfaab014'
  ) {
    return true
  }
  return false
}
