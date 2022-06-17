<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { copyText } from 'vue3-clipboard'
import Icon from '@/components/Icon.vue'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import Toggle from '@vueform/toggle'
import add from '@/icons/add.js'
import close from '@/icons/close.js'
import Popper from 'vue3-popper'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import {
  CREATE_PROJECT_REQUEST,
  UPDATE_PROJECT_REQUEST,
  PUSH_PROJECT,
  QUIT_PROJECT_REQUEST,
  REMOVE_PROJECT_REQUEST
} from '@/store/actions/projects'
import { NAVIGATOR_PUSH_PROJECT, NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'

const store = useStore()
const selectedProject = computed(() => store.state.projects.selectedProject)
const user = computed(() => store.state.user.user)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const isDark = computed(() => store.state.darkMode)
const showConfirm = ref(false)
const showConfirmQuit = ref(false)
const hasChanged = ref(false)
const showAllMembers = ref(false)
const closeProperties = () => {
  store.dispatch('asidePropertiesToggle', false)
}
function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}

onMounted(() => {
  hasChanged.value = false
})

watch(selectedProject, () => {
  showAllMembers.value = false
  selectedProject.value.quiet = !!selectedProject.value.quiet
  hasChanged.value = false
})

const addRemoveMember = (email) => {
  hasChanged.value = true
  if (email.included) {
    selectedProject.value.members.push(email.email)
  } else {
    selectedProject.value.members = arrayRemove(selectedProject.value.members, email.email)
  }
}

const removeMember = (member) => {
  selectedProject.value.members = arrayRemove(selectedProject.value.members, member.email)
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const createOrUpdateProject = (project) => {
  project.quiet = project.quiet ? 1 : 0
  // TODO: should not be hardcoded
  project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
  if (!project.uid) {
    project.uid = uuidv4()
    store.dispatch(CREATE_PROJECT_REQUEST, project)
      .then(() => {
        hasChanged.value = false
        project.quiet = !!project.quiet
        store.dispatch('asidePropertiesToggle', false)
        store.commit(PUSH_PROJECT, [project])
        store.commit(NAVIGATOR_PUSH_PROJECT, [project])
      })
  } else {
    store.dispatch(UPDATE_PROJECT_REQUEST, project)
      .then(() => {
        hasChanged.value = false
        project.quiet = !!project.quiet
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const quitProject = (project) => {
  store.dispatch(QUIT_PROJECT_REQUEST, { uid: project.uid, value: user.value.current_user_email })
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_PROJECT, project)
    })
}

const removeProject = (project) => {
  store.dispatch(REMOVE_PROJECT_REQUEST, project.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_PROJECT, project)
    })
}

const copyurl = (uid) => {
  copyText(`${window.location.origin}/project/${uid}`, undefined, (error, event) => {
    if (error) {
      console.log(error)
    } else {
      console.log(event)
    }
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
    @confirm="quitProject(selectedProject)"
  >
    <p class="text-center">
      Вы действительно хотите выйти из проекта "<strong>{{ selectedProject.name }}</strong>"?
    </p>
  </modal-box-confirm>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeProject(selectedProject)"
  >
    <p class="text-center">
      Вы действительно хотите удалить проект "<strong>{{ selectedProject.name }}</strong>"?
    </p>
  </modal-box-confirm>
  <div>
    <div class="inline-flex justify-center items-center text-[#7E7E80] dark:text-white cursor-pointer absolute right-3 mr-1.5 mt-1 z-1" @click="closeProperties">
      <svg viewBox="0 0 11 11" width="12" height="12" class="cursor-pointer" >
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"></path>
      </svg>
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12C3.10457 12 4 12.8954 4 14C4 15.1046 3.10457 16 2 16C0.89543 16 0 15.1046 0 14C0 12.8954 0.89543 12 2 12Z" fill="#7E7E80"/>
          <path d="M2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.89543 6 2 6Z" fill="#7E7E80"/>
          <path d="M2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.895431 0.89543 0 2 0Z" fill="#7E7E80"/>
        </svg>

      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedProject.name"
        type="text"
        maxlength="100"
        placeholder="Название проекта"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 dark:text-gray-100 w-full border-none ring-0 outline-none p-3 bg-transparent"
        :disabled="selectedProject.email_creator.toLowerCase() != user.current_user_email.toLowerCase()"
        @input="hasChanged = true"
      >
      <div
        class="mt-8"
      >
        <ColorPicker
          v-model="selectedProject.color"
          :update="() => hasChanged = true "
          :label="'Цвет проекта'"
          :disabled="selectedProject.email_creator.toLowerCase() != user.current_user_email.toLowerCase()"
        />
      </div>
      <hr class="my-6">
      <div
        class="flex items-center mb-6"
      >
        <p class="text-sm mr-3">
          Не следить за изменениями
        </p>
        <Toggle
          v-model="selectedProject.quiet"
          class="outline-none ring-0"
          :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
          @change="hasChanged = true"
        />
      </div>
      <p class="dark:text-gray-200">
        Доступ
      </p>
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
                v-model="email.included"
                class="ml-2 bg-gray-300 rounded border border-gray-100"
                :checked="selectedProject.members.includes(email.email)"
                type="checkbox"
                @change="addRemoveMember(email)"
              >
            </div>
          </div>
        </template>
        <div
          v-if="selectedProject.email_creator.toLowerCase() == user.current_user_email.toLowerCase()"
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
            Добавить участника проекта
          </p>
        </div>
      </Popper>
      <div
        class="grid grid-cols-1"
      >
        <template
          v-for="(employee, pindex) in selectedProject.members"
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
                  v-if="employeesByEmail[employee.toLowerCase()].uid !== user.current_user_uid && selectedProject.email_creator.toLowerCase() == user.current_user_email.toLowerCase()"
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
          v-if="selectedProject.members && selectedProject.members.length > 4 && !showAllMembers"
          class="text-gray-500 text-center decoration-dashed underline mt-3 cursor-pointer"
          @click="showAllMembers = true"
        >
          Показать всех участников
        </p>
      </div>
      <button
        v-if="selectedProject.email_creator.toLowerCase() == user.current_user_email.toLowerCase()"
        class="w-full bg-gray-100 dark:bg-gray-800 rounded-xl mt-4 p-3 text-gray-700 dark:text-gray-100 font-bold hover:bg-gray-200 hover:dark:bg-gray-700"
        :class="{ 'bg-orange-400 dark:bg-orange-400 hover:bg-orange-500 hover:dark:bg-orange-500': hasChanged }"
        @click="createOrUpdateProject(selectedProject)"
      >
        {{ selectedProject.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedProject.email_creator.toLowerCase() == user.current_user_email.toLowerCase() && selectedProject.uid"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
      <button
        v-if="selectedProject.email_creator.toLowerCase() !== user.current_user_email.toLowerCase()"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="showConfirmQuit = true"
      >
        Выйти из проекта
      </button>
      <button
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="copyurl(selectedProject.uid)"
      >
        Скопировать как ссылку
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
