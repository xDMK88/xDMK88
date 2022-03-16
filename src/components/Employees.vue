<script setup>
import Icon from '@/components/Icon.vue'
import { computed, ref } from 'vue'
import properties from '@/icons/properties.js'
import { useStore } from 'vuex'
import * as TASK from '@/store/actions/tasks'
import { SELECT_EMPLOYEE } from '@/store/actions/employees'

defineProps({
  employees: {
    type: Array,
    default: () => []
  }
})

const store = useStore()

// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST
}

const isGridView = ref(true)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const storeEmployees = computed(() => store.state.employees.employees)
const user = computed(() => store.state.user.user)

const openProperties = (employee) => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  if (!employee) {
    employee = {
      email: '',
      name: '',
      password: ''
    }
  }
  store.commit('basic', { key: 'propertiesState', value: 'employee' })
  store.commit(SELECT_EMPLOYEE, employee)
}

const clickOnGridCard = (value) => {
  console.log(value)
  if (UID_TO_ACTION[value.parentID]) {
    if (value.email) {
      if (UID_TO_ACTION[value.parentID] === TASK.EMPLOYEE_TASKS_REQUEST) {
        store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
        store.commit('basic', { key: 'taskListSource', value: { uid: value.parentID, param: value.uid } })
      } else {
        store.dispatch(UID_TO_ACTION[value.parentID], value.email)
        store.commit('basic', { key: 'taskListSource', value: { uid: value.parentID, param: value.email } })
      }
    } else {
      store.dispatch(UID_TO_ACTION[value.parentID], value.uid)
      store.commit('basic', { key: 'taskListSource', value: { uid: value.parentID, param: value.uid } })
    }
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabel', value.name)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

</script>

<template class="w-full">
  <!-- Add employee and department -->
  <div
    v-if="storeEmployees[user.current_user_uid].type == 1 || storeEmployees[user.current_user_uid].type == 2"
    class="grid gap-4 mb-4"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <div
      @click="openProperties(false)"
      class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-3 py-3"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl mr-2">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dark:text-gray-100">
         <path d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857" stroke="#3E3D3B" stroke-width="3" stroke-linecap="round"/>
       </svg>
      </div>
       <p class="text-gray-500">
        Добавить сотрудника
       </p>
    </div>

    <div
      @click="openProperties(false)"
      class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-3 py-3"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 mr-2 dark:bg-gray-600 rounded-xl">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dark:text-gray-100">
         <path d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857" stroke="#3E3D3B" stroke-width="3" stroke-linecap="round"/>
       </svg>
      </div>
       <p class="text-gray-500">
        Добавить отдел
       </p>
    </div>
  </div>

  <div v-for="(value, index) in employees" :key="index">
    <p class="text-2xl text-gray-800 font-bold dark:text-gray-100" :class="index !=0 ? 'mt-5' : ''">{{ value.dep }}</p>
    <div
      class="grid gap-4 mt-5"
      :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
    >
      <template v-for="(employee, pindex) in value.items" :key="pindex">
        <div
          class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow cursor-pointer h-30 px-3 py-5"
        >
          <span
            v-if="employee.type == 1"
          >
            🤴
          </span>
          <span
            v-if="employee.type == 2"
          >
            👨‍💼
          </span>
          <img v-if="employee.fotolink" :src="employee.fotolink" class="rounded-lg mx-2 my-auto" width="38" height="38">
          <div class="w-full">
            <div class="flex items-start justify-between">
              <p
                class="font-normal cursor-pointer"
                @click="clickOnGridCard(employee)"
              >
                {{ employee.name }}
              </p>
              <icon
                @click="openProperties(employee)"
                :path="properties.path"
                :width="properties.width"
                :height="properties.height"
                :box="properties.viewBox"
                class="text-gray-400 cursor-pointer hover:text-gray-800"
              />
            </div>
            <p class="font-light text-xs break-all">{{ employee.email }}</p>
           </div>
        </div>
      </template>
    </div>
  </div>
</template>
