<template>
  <div>
    <h1>Рабочий стол</h1>
    <span>У вас всего: {{ unread }} непрочитанных блоков задач!</span>
    <span class="about" v-for="(uid, id) in unreadCustomersUid" :key="unreadCustomersUid[id]">
      Заказчик: {{ employees[uid].name }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const unread = computed(() => {
  return store.state.tasks.unread
})

const unreadCustomersUid = computed(() => {
  return store.state.tasks.unreadCustomersUid
})

const employees = computed(() => {
  return store.state.employees.employees
})

</script>

<style scoped>
  .about{
    display: block;
  }
</style>
