<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import characters from '@/icons/characters.js'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import { NAVIGATOR_PUSH_COLOR, NAVIGATOR_REMOVE_COLOR } from '@/store/actions/navigator'
import { CREATE_COLOR_REQUEST, UPDATE_COLOR_REQUEST, REMOVE_COLOR_REQUEST } from '@/store/actions/colors'

const store = useStore()
const selectedColor = computed(() => store.state.colors.selectedColor)
const showConfirm = ref(false)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const createOrUpdateColor = (color) => {
  if (!color.uid) {
    color.uid = uuidv4()
    store.dispatch(CREATE_COLOR_REQUEST, color)
      .then(() => {
        store.dispatch('asidePropertiesToggle', false)
        // store.commit(PUSH_PROJECT, [project])
        store.commit(NAVIGATOR_PUSH_COLOR, [color])
      })
  } else {
    store.dispatch(UPDATE_COLOR_REQUEST, color)
      .then(() => {
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const removeColor = (color) => {
  store.dispatch(REMOVE_COLOR_REQUEST, color.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_COLOR, color)
    })
}

</script>

<template>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    hasButton
    hasCancel
    buttonLabel="Delete"
    @confirm="removeColor(selectedColor)"
  >
    <p class="text-center">Do you really wanna delete "<strong>{{ selectedColor.name }}</strong>" color?</p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства цвета
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedColor.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
      >
      <div
         class="mt-8"
      >
        <ColorPicker
          :label="'Цвет букв'"
          v-model="selectedColor.fore_color"
          :icon="characters"
        />
      </div>
      <div
         class="mt-8"
      >
        <ColorPicker
          :label="'Цвет фона'"
          v-model="selectedColor.back_color"
        />
      </div>
      <div
        class="flex items-center mt-3"
      >
        <input
          type="checkbox"
          class="mr-1 bg-gray-100 border border-gray-300 rounded"
        >
        <p class="text-sm">Все прописные</p>
      </div>
      <hr class="my-6">
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Предосмотр задачи
      </p>
      <div
        class="p-3 rounded-xl mt-3"
        :style="{ 'background-color': selectedColor.back_color }"
      >
        <p
          :style="{ 'color': selectedColor.fore_color }"
        >
          Название задачи
        </p>
      </div>
      <button
        @click="createOrUpdateColor(selectedColor)"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
      >
        {{ selectedColor.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        @click="showConfirm = true"
        v-if="selectedColor.uid"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
