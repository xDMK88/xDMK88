<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import add from '@/icons/add.js'
import close from '@/icons/close.js'
import Popper from 'vue3-popper'
import { copyText } from 'vue3-clipboard'
import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

const store = useStore()
const selectedBoard = computed(() => store.state.boards.selectedBoard)
const user = computed(() => store.state.user.user)
//  const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const employees = computed(() => store.state.employees.employees)
const isDark = computed(() => store.state.darkMode)
const showConfirm = ref(false)
const showConfirmQuit = ref(false)
const hasChanged = ref(false)
const showAllMembers = ref(false)

onMounted(() => {
  hasChanged.value = false
})

watch(selectedBoard, () => {
  showAllMembers.value = false
  selectedBoard.value.quiet = !!selectedBoard.value.quiet
  hasChanged.value = false
})

const addRemoveMember = (email) => {
  hasChanged.value = true
  if (email.included) {
    selectedBoard.value.members[email.uid] = 1
  } else {
    delete selectedBoard.value.members[email.uid]
  }
}

const removeMember = (member) => {
  delete selectedBoard.value.members[member.uid]
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const createOrUpdateBoard = (board) => {
  board.quiet = board.quiet ? 1 : 0
  // TODO: should not be hardcoded
  board.global_property_uid = '1b30b42c-b77e-40a4-9b43-a19991809add'
  if (!board.uid) {
    board.uid = uuidv4()
    console.log('create board c ' + ' uid: ' + board.uid, board)
    store.dispatch(BOARD.CREATE_BOARD_REQUEST, board)
      .then(() => {
        hasChanged.value = false
        board.quiet = !!board.quiet
        store.dispatch('asidePropertiesToggle', false)
        store.commit(BOARD.PUSH_BOARD, [board])
        store.commit(NAVIGATOR.NAVIGATOR_PUSH_BOARD, [board])
      })
  } else {
    console.log('update board c ' + ' uid: ' + board.uid, board)
    store.dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
      .then(() => {
        hasChanged.value = false
        board.quiet = !!board.quiet
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const quitBoard = (board) => {
  store.dispatch(BOARD.QUIT_BOARD_REQUEST, { uid: board.uid, value: user.value.current_user_email })
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR.NAVIGATOR_REMOVE_BOARD, board)
    })
}

const removeBoard = (board) => {
  store.dispatch(BOARD.REMOVE_BOARD_REQUEST, board.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR.NAVIGATOR_REMOVE_BOARD, board)
    })
}
const copyurl = (uid) => {
  copyText(`${window.location.origin}/board/${uid}`, undefined, (error, event) => {
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
    @confirm="quitBoard(selectedBoard)"
  >
    <p class="text-center">
      Do you really wanna quit "<strong>{{ selectedBoard.name }}</strong>" project?
    </p>
  </modal-box-confirm>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeBoard(selectedBoard)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedBoard.name }}</strong>" project?
    </p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства доски
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedBoard.name"
        type="text"
        maxlength="100"
        placeholder="Название доски"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 dark:text-gray-100 w-full border-none ring-0 outline-none p-3 bg-transparent"
        :disabled="selectedBoard.email_creator != user.current_user_email"
        @input="hasChanged = true"
      >
      <div
        class="mt-8"
      >
        <ColorPicker
          v-model="selectedBoard.color"
          :update="() => hasChanged = true "
          :label="'Цвет проекта'"
          :disabled="selectedBoard.email_creator != user.current_user_email"
        />
      </div>
      <hr class="my-6">
      <div
        class="flex items-center mb-6"
      />
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
              v-for="(email, key, index) in employees"
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
                type="checkbox"
                :checked="selectedBoard.members[email.uid]"
                @change="addRemoveMember(email)"
              >
            </div>
          </div>
        </template>
        <div
          v-if="selectedBoard.email_creator == user.current_user_email"
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
          v-for="(employee, key, index) in selectedBoard.members"
          :key="index"
        >
          <div
            v-if="employees[key]"
            v-show="index < 4 || showAllMembers"
            class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow h-30 px-3 py-5 mt-1"
          >
            <img
              :src="employees[key].fotolink"
              class="rounded-lg mx-2 my-auto"
              width="38"
              height="38"
            >
            <div class="w-full">
              <div class="flex items-start justify-between">
                <p
                  class="font-normal cursor-pointer"
                >
                  {{ employees[key].name }}
                </p>
                <icon
                  v-if="employees[key].uid !== user.current_user_uid && selectedBoard.email_creator == user.current_user_email"
                  :path="close.path"
                  :width="10"
                  :height="10"
                  :box="close.viewBox"
                  class="text-grayemployeesByEmail[employee]-400 cursor-pointer hover:text-gray-800"
                  @click="removeMember(employees[key])"
                />
              </div>
              <p class="font-light text-xs break-all">
                {{ employees[key].email }}
              </p>
            </div>
          </div>
        </template>
        <p
          v-if="selectedBoard.members && selectedBoard.members.length > 4 && !showAllMembers"
          class="text-gray-500 text-center decoration-dashed underline mt-3 cursor-pointer"
          @click="showAllMembers = true"
        >
          Показать всех участников
        </p>
      </div>
      <button
        v-if="selectedBoard.email_creator == user.current_user_email"
        class="w-full bg-gray-100 dark:bg-gray-800 rounded-xl mt-4 p-3 text-gray-700 dark:text-gray-100 font-bold hover:bg-gray-200 hover:dark:bg-gray-700"
        :class="{ 'bg-orange-400 dark:bg-orange-400 hover:bg-orange-500 hover:dark:bg-orange-500': hasChanged }"
        @click="createOrUpdateBoard(selectedBoard, emails)"
      >
        {{ selectedBoard.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedBoard.email_creator == user.current_user_email && selectedBoard.uid"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
      <button
        v-if="selectedBoard.email_creator !== user.current_user_email"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="showConfirmQuit = true"
      >
        Выйти из доски
      </button>
      <button
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="copyurl(selectedBoard.uid)"
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
