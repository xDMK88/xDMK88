<template>
  <div
    class="w-[33px] h-[33px] rounded-[6px] bg-white"
    :class="{
      'flex justify-center items-center border-2 border-black': selected,
      'border border-black/12': color === ''
    }"
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
        :stroke="getContrastYIQ(color)"
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
    getContrastYIQ (hexcolor) {
      if (!hexcolor) return 'black'
      hexcolor = hexcolor.replace('#', '')
      const r = parseInt(hexcolor.substr(0, 2), 16)
      const g = parseInt(hexcolor.substr(2, 2), 16)
      const b = parseInt(hexcolor.substr(4, 2), 16)
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return (yiq >= 128) ? 'black' : 'white'
    },
    onClick () {
      if (!this.selected) this.$emit('select', this.color)
    }
  }
}
</script>

<style scoped>

</style>
