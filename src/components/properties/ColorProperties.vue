<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
// import Icon from '@/components/Icon.vue'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import characters from '@/icons/characters.js'
// import properties from '@/icons/properties.js'

const store = useStore()
const selectedColor = computed(() => store.state.colors.selectedColor)

</script>

<template>
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
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>
