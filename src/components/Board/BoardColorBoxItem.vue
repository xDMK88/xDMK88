<template>
  <div
    class="w-[30px] h-[30px] rounded m-0.5 bg-[#e5e5e5]"
    :class="{ 'flex justify-center items-center border-2 border-[#111111]': selected }"
    :style="{ backgroundColor: color }"
    @click="onClick"
  >
    <svg
      v-if="selected"
      class="flex-none"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        stroke="#111111"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13.3346 4L6.0013 11.3333L2.66797 8"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    }
  },
  emits: ['select'],
  methods: {
    onClick () {
      if (!this.selected) this.$emit('select', this.color)
    }
  }
}
</script>

<style scoped>

</style>
