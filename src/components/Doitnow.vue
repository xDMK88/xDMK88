<template>
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
  />
  <button
    v-if="tasksCount"
    class="bg-orange-500 py-1 mt-10 px-2 rounded-xl text-white mr-1 ml-1 hover:bg-orange-500 bg-opacity-70"
    @click="nextTask"
  >
    Дальше
  </button>
  <DoitnowEmpty
    v-if="tasksCount === 0"
  />
</template>

<script>
import * as TASK from '@/store/actions/tasks.js'
import DoitnowEmpty from '@/components/Doitnow/DoitnowEmpty.vue'
import DoitnowTask from '@/components/Doitnow/DoitnowTask.vue'

export default {
  components: {
    DoitnowEmpty,
    DoitnowTask
  },
  data: () => ({
    unreadTasks: [],
    overdueTasks: [],
    todayTasks: []
  }),
  computed: {
    tasksCount () {
      return this.unreadTasks.length + this.overdueTasks.length + this.todayTasks.length
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
    }
  },
  mounted: function () {
    this.loadAllTasks()
  },
  methods: {
    loadAllTasks: function () {
      Promise.all([
        this.$store.dispatch(TASK.UNREAD_TASKS_REQUEST),
        this.$store.dispatch(TASK.OVERDUE_TASKS_REQUEST),
        this.$store.dispatch(TASK.TASKS_REQUEST, new Date())
      ]).then((result) => {
        this.unreadTasks = [...result[0].data.tasks]
        this.overdueTasks = [...result[1].data.tasks]
        this.todayTasks = [...result[2].data.tasks]
      })
    },
    dateToLabelFormat: function (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      return day + ' ' + month + ', ' + weekday
    },
    nextTask: function () {
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
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow } })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    }
  }
}
</script>

<style scoped></style>
