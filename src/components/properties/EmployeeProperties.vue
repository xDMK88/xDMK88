<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
// import Icon from '@/components/Icon.vue'
// import add from '@/icons/add.js'
// import properties from '@/icons/properties.js'

const store = useStore()
const selectedEmployee = computed(() => store.state.employees.selectedEmployee)

</script>

<template>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства сотрудника
      </p>
      <img
        class="mx-auto rounded-full mt-8"
        :src="selectedEmployee.fotolink"
      >
      <p
        class="mt-4"
      >
        Имя
      </p>
      <input
        v-model="selectedEmployee.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
      >
      <p
        class="mt-4"
      >
        Email
      </p>
      <input
        v-model="selectedEmployee.email"
        type="text"
        placeholder="Email"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        disabled
      >
    </div>
  </div>
</template>
