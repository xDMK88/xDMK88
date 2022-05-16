<template>
  <div
    class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 min-h-[80px]"
    @click.prevent="onClick"
  >
    <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-100">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
          stroke="#3E3D3B"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['onClick'],
  methods: {
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>

<style scoped>

</style>
