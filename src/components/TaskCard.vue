<template>
  <div class="bg-white shadow rounded p-3">
    <div class="flex justify-between">
      <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
        {{ task.name }}
      </p>
      <img
        v-if="task.uid_creator !== '00000000-0000-0000-0000-000000000000'"
        class="w-6 h-6 rounded-full ml-3"
        :src="employees[task.uid_creator].fotolink"
        alt="Avatar"
      >
    </div>
    <p v-if="task.comment" class="text-gray-700 font-sans tracking-wide text-xs mt-1">
      {{ task.comment }}
    </p>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">{{ task.date }}</span>
      <span class="text-sm text-gray-600">{{ task.type }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    }
  }
}
</script>
