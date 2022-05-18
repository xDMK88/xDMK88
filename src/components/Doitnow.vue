<template>
  <TasksSkeleton
    v-if="isLoading"
  />
  <div
    v-if="tasksCount"
    class="font-normal"
  >
    В очереди задач: {{ tasksCount }}
  </div>
  <div
    v-if="unreadTasks.length"
    class="font-normal mt-10"
  >
    Команда ждет ваших действий по задачам. Пожалуйста, ответьте им
  </div>
  <div
    v-else-if="overdueTasks.length"
    class="font-normal mt-10"
  >
    У вас есть просроченные задачи. Примите решение, что с ними делать
  </div>
  <div
    v-else-if="todayTasks.length"
    class="font-normal mt-10"
  >
    У вас запланированы дела на сегодня. Пора приступить к делу
  </div>
  <DoitnowTask
    v-if="tasksCount"
    :task="firstTask"
    :subTasks="subTasks"
    :colors="colors"
    :tags="tags"
    :user="user"
    :taskMessages="taskMessages"
    :employees="employees"
    :projects="projects"
    @clickTask="onClickTask"
    @nextTask="nextTask"
  />
  <DoitnowEmpty
    v-if="tasksCount === 0 && !isLoading"
    @clickPlanning="goToNextDay"
  />
</template>

<script>
import * as MSG from '@/store/actions/taskmessages.js'
import * as TASK from '@/store/actions/tasks.js'
import DoitnowEmpty from '@/components/Doitnow/DoitnowEmpty.vue'
import DoitnowTask from '@/components/Doitnow/DoitnowTask.vue'
import TasksSkeleton from '@/components/TasksList/TasksSkeleton.vue'

export default {
  components: {
    DoitnowEmpty,
    DoitnowTask,
    TasksSkeleton
  },
  data: () => ({
    unreadTasks: [],
    overdueTasks: [],
    todayTasks: []
  }),
  computed: {
    tasksCount () {
      return (
        this.unreadTasks.length +
        this.overdueTasks.length +
        this.todayTasks.length
      )
    },
    firstTask () {
      if (this.unreadTasks.length) {
        return this.unreadTasks[0]
      }
      if (this.overdueTasks.length) {
        return this.overdueTasks[0]
      }
      if (this.todayTasks.length) {
        return this.todayTasks[0]
      }
      return null
    },
    taskMessages () {
      if (this.firstTask) {
        this.$store.dispatch(MSG.MESSAGES_REQUEST, this.firstTask.uid)
        return this.$store.state.taskfilesandmessages.messages
      }
      return null
    },
    employees () {
      return this.$store.state.employees.employees
    },
    projects () {
      return this.$store.state.projects.projects
    },
    colors () {
      return this.$store.state.colors.colors
    },
    tags () {
      return this.$store.state.tasks.tags
    },
    isLoading () {
      return this.$store.state.tasks.status === 'loading'
    },
    user () {
      return this.$store.state.user.user
    },
    subTasks () {
      if (this.firstTask) {
        this.$store.dispatch(TASK.SUBTASKS_REQUEST, this.firstTask.uid)
        return this.$store.state.tasks.subtasks.tasks
      }
      return null
    }
  },
  mounted: function () {
    this.loadAllTasks()
  },
  methods: {
    loadAllTasks: function () {
      this.$store.dispatch(TASK.DOITNOW_TASKS_REQUEST)
        .then((result) => {
          console.log('loadAllTasks', result)
          this.unreadTasks = [...result[0]]
          this.overdueTasks = [...result[1]]
          this.todayTasks = [...result[2]]
        })
    },
    dateToLabelFormat: function (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', {
        weekday: 'short'
      })
      return day + ' ' + month + ', ' + weekday
    },
    nextTask: function () {
      this.$store.dispatch('asidePropertiesToggle', false)

      if (this.unreadTasks.length) {
        this.unreadTasks.shift()
        return
      }
      if (this.overdueTasks.length) {
        this.overdueTasks.shift()
        return
      }
      if (this.todayTasks.length) {
        this.todayTasks.shift()
      }
    },
    goToNextDay: function () {
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))

      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.dispatch(TASK.TASKS_REQUEST, tomorrow)
      // hardcoded and messy
      const navElem = {
        name: this.dateToLabelFormat(tomorrow),
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow }
      })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    },
    onClickTask: function (task) {
      this.$store.commit('basic', { key: 'propertiesState', value: 'task' })
      this.$store.dispatch(TASK.SELECT_TASK, task)
      this.$store.dispatch('asidePropertiesToggle', true)
    }
  }
}
</script>

<style scoped></style>
