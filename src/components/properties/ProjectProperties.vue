<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import add from '@/icons/add.js'
import properties from '@/icons/properties.js'
import Popper from 'vue3-popper'

const store = useStore()
const selectedProject = computed(() => store.state.projects.selectedProject)
const user = computed(() => store.state.user.user)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const isDark = computed(() => store.state.darkMode)

function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}
const addRemoveMember = (email) => {
  if (email.included) {
    selectedProject.value.members.push(email.email)
  } else {
    selectedProject.value.members = arrayRemove(selectedProject.value.members, email.email)
  }
}

// convert 1 or 0 to boolean (checkbox v-model needs only boolean values)
const computedQuiet = computed(() => {
  if (selectedProject.value.quiet === 1) {
    return true
  } else {
    return false
  }
})

</script>

<template>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства проекта
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedProject.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        :disabled="selectedProject.email_creator != user.current_user_email"
      >
      <div
         class="mt-8"
      >
        <ColorPicker
          :label="'Цвет проекта'"
          v-model="selectedProject.color"
          :disabled="selectedProject.email_creator != user.current_user_email"
        />
      </div>
      <div
        class="flex items-center mt-3"
      >
        <input
          type="checkbox"
          v-model="computedQuiet"
          class="mr-1 bg-gray-100 border border-gray-300 rounded"
        >
        <p class="text-sm">Не следить за изменениями</p>
      </div>
      <hr class="my-6">
      <!-- <pre class="text-xs">{{ selectedProject }}</pre> -->
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Доступ
      </p>
      <Popper
        arrow
        :zIndex="999999999999999999"
        class="z-auto"
        :class="isDark ? 'dark' : 'light'"
        placement="top"
      >
        <template #content>
          <div style="max-height: 15rem;" class="overflow-scroll">
            <div
              v-for="(email, index) in employeesByEmail"
              :key="index"
              class="px-3 py-1 bg-gray-50 rounded-xl mt-1 flex items-center justify-between border border-gray-100"
            >
              <div class="flex items-center">
                <img
                  :src="email.fotolink"
                  class="rounded-xl mr-2"
                  width="35"
                  height="35"
                >
                <p>{{ email.name }}</p>
              </div>
              <input
                class="ml-2 bg-gray-300 rounded border border-gray-100"
                @change="addRemoveMember(email)"
                v-model="email.included"
                :checked="selectedProject.members.includes(email.email)"
                type="checkbox"
              >
            </div>
          </div>
        </template>
        <div
          v-if="selectedProject.email_creator == user.current_user_email"
          class="flex items-center my-6 cursor-pointer"
        >
          <Icon
            :path="add.path"
            :box="add.viewBox"
            :width="add.width"
            :height="add.height"
            class="text-gray-500 mx-3"
          />
          <p class="text-gray-600">Добавить участника проекта</p>
        </div>
      </Popper>
      <div
        class="grid grid-cols-1 mt-3"
      >
        <template v-for="(employee, pindex) in selectedProject.members" :key="pindex">
          <div
            class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow h-30 px-3 py-5 mt-1"
          >
            <img v-if="employeesByEmail[employee].fotolink" :src="employeesByEmail[employee].fotolink" class="rounded-lg mx-2 my-auto" width="38" height="38">
            <div class="w-full">
              <div class="flex items-start justify-between">
                  <p
                    class="font-normal cursor-pointer"
                  >
                    {{ employeesByEmail[employee].name }}
                  </p>
                  <icon
                    :path="properties.path"
                    :width="properties.width"
                    :height="properties.height"
                    :box="properties.viewBox"
                    class="text-gray-400 cursor-pointer hover:text-gray-800"
                  />
              </div>
              <p class="font-light text-xs break-all">{{ employeesByEmail[employee].email }}</p>
             </div>
          </div>
        </template>
      </div>
      <button
        v-if="selectedProject.email_creator == user.current_user_email"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<style>
.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

</style>
