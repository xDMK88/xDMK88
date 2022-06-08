<template>
  <ModalBoxDelete
    v-show="showConfirm"
    title="Удалить сотрудника"
    :text="`Вы действительно хотите удалить сотрудника ${selectedEmployee.name}?`"
    @cancel="showConfirm = false"
    @yes="removeEmployee(selectedEmployee)"
  />
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
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        @input="hasChanged = true"
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
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        :disabled="selectedEmployee.uid"
        @input="hasChanged = true"
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
          class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
          :disabled="employees[user.current_user_uid].type == 3"
          @input="hasChanged = true"
        >
      </div>
      <button
        v-if="employees[user.current_user_uid].type != 3"
        class="w-full bg-gray-100 rounded-xl mt-8 p-3 text-gray-700 font-bold hover:bg-gray-200"
        :class="{ 'bg-orange-400 hover:bg-orange-500': hasChanged }"
        @click="createOrUpdateEmployee(selectedEmployee)"
      >
        {{ selectedEmployee.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedEmployee.uid && employees[user.current_user_uid].type != 3 && selectedEmployee.type != 1"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
import { UPDATE_EMPLOYEE_REQUEST, REMOVE_EMPLOYEE_REQUEST } from '@/store/actions/employees'
import { NAVIGATOR_REMOVE_EMPLOYEE } from '@/store/actions/navigator'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'

export default {
  components: {
    ModalBoxDelete
  },
  data () {
    return {
      showConfirm: false,
      hasChanged: false
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    selectedEmployee () {
      return this.$store.state.employees.selectedEmployee
    },
    user () {
      return this.$store.state.user.user
    }
  },
  watch: {
    selectedEmployee: {
      immediate: true,
      handler: function (val) {
        this.hasChanged = false
      }
    }
  },
  methods: {
    createOrUpdateEmployee (employee) {
      this.$store.dispatch(UPDATE_EMPLOYEE_REQUEST, employee)
        .then(() => {
          this.hasChanged = false
          this.$store.dispatch('asidePropertiesToggle', false)
        })
    },
    removeEmployee (employee) {
      this.$store.dispatch(REMOVE_EMPLOYEE_REQUEST, employee)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_EMPLOYEE, employee)
        })
    }
  }
}
</script>

<style scoped>

</style>
