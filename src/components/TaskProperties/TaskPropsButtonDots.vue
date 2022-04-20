<template>
  <div class="mt-3 tags-custom any-list-custom relative">
    <svg
      style="width: 24px; height: 24px"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
      />
    </svg>
    <span class="rounded" />
    <Transition>
      <div class="absolute custom-dropdown py-2 mt-2 rounded-md shadow-xl w-44">
        <div class="block px-4 py-2 text-sm text-gray-400">
          Дата создания
        </div>
        <div class="block px-4 py-2 text-sm text-gray-400">
          {{ dateCreateText }}
        </div>
        <router-link
          to="/"
          class="block px-4 py-2 text-sm"
          @click="selectItem('toggleFiles')"
        >
          {{ onlyFiles ? 'Показать весь чат' : 'Показать только файлы' }}
        </router-link>
        <router-link
          to="/"
          class="block px-4 py-2 text-sm"
          @click="selectItem('copyUrl')"
        >
          Копировать как ссылку
        </router-link>
        <router-link
          v-if="showDelete"
          to="/"
          class="block px-4 py-2 text-sm"
          @click="selectItem('deleteTask')"
        >
          Удалить
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<script>
// import Popper from 'vue3-popper'

export default {
  // components: {
  //   Popper
  // },
  props: {
    dateCreate: {
      type: String,
      default: ''
    },
    onlyFiles: Boolean,
    showDelete: Boolean
  },
  emits: ['copyUrl', 'deleteTask', 'toggleFiles'],
  computed: {
    dateCreateText () {
      const date = new Date(this.dateCreate)
      return date.toLocaleString('default', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  },
  methods: {
    selectItem (value) {
      this.$emit(value)
    }
  }
}
</script>

<style scoped></style>
