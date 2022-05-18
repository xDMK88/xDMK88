<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import add from '@/icons/add.js'
import close from '@/icons/close.js'
import Popper from 'vue3-popper'
import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'
import {
  CREATE_DEPARTMENT_REQUEST,
  UPDATE_DEPARTMENT_REQUEST,
  REMOVE_DEPARTMENT_REQUEST,
  PUSH_DEPARTMENT
} from '@/store/actions/departments'
import { NAVIGATOR_PUSH_DEPARTAMENT, NAVIGATOR_REMOVE_DEPARTAMENT } from '@/store/actions/navigator'
const store = useStore()
const selectedDepartment = computed(() => store.state.departments.selectedDepartment)
//  const departments = computed(() => store.state.departments.deps)
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const showConfirm = ref(false)
const hasChanged = ref(false)
const showConfirmQuit = ref(false)
const showAllMembers = ref(false)
function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
watch(selectedDepartment, () => {
  showAllMembers.value = false
  hasChanged.value = false
})
onMounted(() => {
  hasChanged.value = false
})
function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}
const addRemoveMember = (email) => {
  hasChanged.value = true
  if (email.included) {
    selectedDepartment.value.emails.push(email.email)
  } else {
    selectedDepartment.value.emails = arrayRemove(selectedDepartment.value.emails, email.email)
  }
}

const removeMember = (member) => {
  selectedDepartment.value.emails = arrayRemove(selectedDepartment.value.emails, member.email)
}
const createOrUpdateDepartment = (department, index) => {
  if (!department.uid) {
    department.uid = uuidv4()
    department.order = department.order + 1
    console.log('Обработчик на добавление', department)
    localStorage.setItem('department', department)
    store.dispatch(CREATE_DEPARTMENT_REQUEST, department)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
        store.commit(NAVIGATOR_PUSH_DEPARTAMENT, [department])
        store.commit(PUSH_DEPARTMENT, department)
        localStorage.getItem('department')
      })
  } else {
    console.log('Обработчик на обновление', department)
    const dep = {
      uid: department.uid,
      uid_parent: '',
      name: department.name,
      order: department.order,
      collapsed: department.collapsed,
      emails: department.emails
    }
    store.dispatch(UPDATE_DEPARTMENT_REQUEST, dep)
      .then(resp => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}
const quitremoveDepartment = (departament) => {
  console.log(departament)
  const dep = {
    uid: departament.uid,
    uid_parent: '',
    name: departament.name,
    order: departament.order,
    collapsed: departament.collapsed,
    emails: departament.emails.splice(departament.emails.indexOf(user.value.current_user_email), 1)
  }
  store.dispatch(UPDATE_DEPARTMENT_REQUEST, dep)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_DEPARTAMENT, departament)
    })
}
const removeDepartment = (departament) => {
  store.dispatch(REMOVE_DEPARTMENT_REQUEST, departament.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_DEPARTAMENT, departament)
    })
}
</script>

<template>
  <modal-box-confirm
    v-model="showConfirmQuit"
    button="warning"
    has-button
    has-cancel
    button-label="Quit"
    @confirm="quitremoveDepartment(selectedDepartment)"
  >
    <p class="text-center">
      Do you really wanna quit "<strong>{{ selectedDepartment.name }}</strong>" project?
    </p>
  </modal-box-confirm>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeDepartment(selectedDepartment)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedDepartment.name }}</strong>" departemnt?
    </p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства отдела
      </p>
      <img
        v-if="selectedDepartment.uid"
        class="mx-auto rounded-full mt-8"
        :src="selectedDepartment.fotolink"
      >
      <p
        class="mt-4"
      >
        Имя
      </p>
      <input
        v-model="selectedDepartment.name"
        type="text"
        placeholder="Имя отдела"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
      >
      <Popper
        arrow
        :z-index="999999999999999999"
        class="z-auto"
        :class="isDark ? 'dark' : 'light'"
        placement="top"
      >
        <template #content>
          <div
            style="max-height: 15rem;"
            class="overflow-scroll"
          >
            <div
              v-for="(email, index) in employeesByEmail"
              :key="index"
              class="px-3 py-1 bg-gray-50 rounded-xl mt-1 flex items-center justify-between border border-gray-100"
            >

              <div class="flex items-center" >
                <img
                  :src="email.fotolink"
                  class="rounded-xl mr-2"
                  width="35"
                  height="35"
                >
                <p>{{ email.name }}</p>
              </div>
              <input
                v-model="email.included"
                class="ml-2 bg-gray-300 rounded border border-gray-100"
                type="checkbox"
                @change="addRemoveMember(email)"
                :checked="selectedDepartment.uid===email.uid_dep"
              >
            </div>
          </div>
        </template>
        <div v-if="!selectedDepartment.emails.includes(user.current_user_email) && employees[user.current_user_uid].type != 3 && selectedDepartment.type != 1"
          class="flex items-center justify-center my-6 cursor-pointer"
        >
          <Icon
            :path="add.path"
            :box="add.viewBox"
            :width="add.width"
            :height="add.height"
            class="text-gray-500 dark:text-gray-100 mx-3"
          />
          <p class="text-gray-600 dark:text-gray-100">
            Добавить участника Отдела
          </p>
        </div>
      </Popper>
      <div
        class="grid grid-cols-1"
      >
        <template
          v-for="(employee, pindex) in selectedDepartment.emails"
          :key="pindex"
        >
          <div
            v-if="employeesByEmail[employee.toLowerCase()]"
            v-show="pindex < 4 || showAllMembers"
            class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow h-30 px-3 py-5 mt-1"
          >
            <img
              :src="employeesByEmail[employee.toLowerCase()].fotolink"
              class="rounded-lg mx-2 my-auto"
              width="38"
              height="38"
            >
            <div class="w-full">
              <div class="flex items-start justify-between">
                <p
                  class="font-normal cursor-pointer"
                >
                  {{ employeesByEmail[employee.toLowerCase()].name }}
                </p>
                <icon
                  v-if="employeesByEmail[employee.toLowerCase()].uid !== user.current_user_uid"
                  :path="close.path"
                  :width="10"
                  :height="10"
                  :box="close.viewBox"
                  class="text-grayemployeesByEmail[employee]-400 cursor-pointer hover:text-gray-800"
                  @click="removeMember(employeesByEmail[employee.toLowerCase()])"
                />
              </div>
              <p class="font-light text-xs break-all">
                {{ employeesByEmail[employee.toLowerCase()].email }}
              </p>
            </div>
          </div>
        </template>
        <p
          v-if="selectedDepartment.emails && selectedDepartment.emails.length > 4 && !showAllMembers"
          class="text-gray-500 text-center decoration-dashed underline mt-3 cursor-pointer"
          @click="showAllMembers = true"
        >
          Show all members
        </p>
      </div>
      <button
        v-if="employees[user.current_user_uid].type != 3"
        class="w-full bg-gray-100 rounded-xl mt-8 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="createOrUpdateDepartment(selectedDepartment)"
      >
        {{ selectedDepartment.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedDepartment.emails.includes(user.current_user_email)"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="showConfirmQuit = true"
      >
        Выйти из отдела
      </button>
      <button
        v-if="selectedDepartment.uid && employees[user.current_user_uid].type != 3 && selectedDepartment.type != 1"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
