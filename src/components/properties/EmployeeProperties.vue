<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
// import Icon from '@/components/Icon.vue'
// import add from '@/icons/add.js'
// import properties from '@/icons/properties.js'

const store = useStore()
const selectedEmployee = computed(() => store.state.employees.selectedEmployee)
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)

</script>

<template>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства сотрудника
      </p>
      <img
        v-if="selectedEmployee.uid"
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
        placeholder="Имя сотрудника"
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
        :disabled="employees[user.current_user_uid].type == 3"
      >
      <div
        v-if="!selectedEmployee.uid"
      >
        <p
          class="mt-4"
        >
          Пароль
        </p>
        <input
          v-model="selectedEmployee.password"
          type="text"
          placeholder="Пароль"
          class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
          :disabled="employees[user.current_user_uid].type == 3"
        >
      </div>
      <button
        v-if="employees[user.current_user_uid].type != 3"
        @click="createOrUpdateColor(selectedColor)"
        class="w-full bg-gray-100 rounded-xl mt-8 p-3 text-gray-700 font-bold hover:bg-gray-200"
      >
        {{ selectedEmployee.uid ? 'Сохранить' : 'Создать' }}
      </button>
    </div>
  </div>
</template>
