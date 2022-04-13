
<script setup>
import Todayblock from '@/components/Todayblock.vue'
import Unreadblock from '@/components/Unreadblock.vue'
import Focusblock from '@/components/Focusblock.vue'
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

<template>
  <div>
    <h1>Рабочий стол</h1>
    <span>У вас всего: {{ unread }} непрочитанных блоков задач!</span>
    <span class="about" v-for="(uid, id) in unreadCustomersUid" :key="unreadCustomersUid[id]">
      Заказчик: {{ employees[uid].name }}
    </span>
  </div>
  <div class="flex" style="justify-content: space-between">
    <todayblock></todayblock>
    <unreadblock></unreadblock>
    <focusblock></focusblock>
  </div>
</template>

<style scoped>
  .about{
    display: block;
  }
</style>
