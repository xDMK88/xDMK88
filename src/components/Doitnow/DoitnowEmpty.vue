<template>
  <div>
    <div class="max-w-xl mx-auto">
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-10">
        Поздравляем, вы успешно обработали все задачи. Не хотите запланировать
        дела на завтра?
      </p>
      <div class="grid grid-cols-1">
        <button
          class="bg-orange-500 px-2 py-1 mx-auto rounded-xl text-white mt-10 hover:bg-orange-500 bg-opacity-70"
          @click="goToNextDay"
        >
          Запланировать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as TASK from '@/store/actions/tasks.js'

export default {
  methods: {
    dateToLabelFormat: function (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', {
        weekday: 'short'
      })
      return day + ' ' + month + ', ' + weekday
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
    }
  }
}
</script>

<style scoped></style>
