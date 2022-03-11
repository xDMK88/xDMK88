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

const openProperties = (employee) => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
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
