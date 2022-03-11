<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
// import Icon from '@/components/Icon.vue'
import ColorPicker from '@/components/properties/ColorPicker.vue'
// import add from '@/icons/add.js'
// import properties from '@/icons/properties.js'

const store = useStore()
const selectedTag = computed(() => store.state.tasks.selectedTag)

</script>

<template>
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
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
      >
      <div
         class="mt-8"
      >
        <ColorPicker
          :label="'Цвет метки'"
          v-model="selectedTag.back_color"
        />
      </div>
      <div
        class="flex items-center mt-3"
      >
        <input
          type="checkbox"
          class="mr-1 bg-gray-100 border border-gray-300 rounded"
        >
        <p class="text-sm">Не следить за изменениями</p>
      </div>
      <button
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>
