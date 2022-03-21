<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ColorPicker from '@/components/properties/ColorPicker.vue'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import {
  CREATE_TAG_REQUEST,
  UPDATE_TAG_REQUEST,
  REMOVE_TAG_REQUEST
} from '@/store/actions/tasks'
import { NAVIGATOR_PUSH_TAG, NAVIGATOR_REMOVE_TAG } from '@/store/actions/navigator'

const store = useStore()
const selectedTag = computed(() => store.state.tasks.selectedTag)
const showConfirm = ref(false)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const createOrUpdateTag = (tag) => {
  if (!tag.uid) {
    tag.uid = uuidv4()
    store.dispatch(CREATE_TAG_REQUEST, tag)
      .then(() => {
        store.dispatch('asidePropertiesToggle', false)
        // store.commit(PUSH_PROJECT, [tag])
        store.commit(NAVIGATOR_PUSH_TAG, [tag])
      })
  } else {
    store.dispatch(UPDATE_TAG_REQUEST, tag)
      .then(() => {
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const removeTag = (tag) => {
  store.dispatch(REMOVE_TAG_REQUEST, tag.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_TAG, tag)
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
    @confirm="removeTag(selectedTag)"
  >
    <p class="text-center">Do you really wanna delete "<strong>{{ selectedTag.name }}</strong>" tag?</p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства метки
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedTag.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
      >
      <div
         class="mt-8"
      >
        <ColorPicker
          :label="'Цвет метки'"
          v-model="selectedTag.back_color"
        />
      </div>
      <button
        @click="createOrUpdateTag(selectedTag)"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
      >
        {{ selectedTag.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        @click="showConfirm = true"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        v-if="selectedTag.uid"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
