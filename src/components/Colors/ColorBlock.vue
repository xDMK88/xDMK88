<template>
  <div
    class="flex items-center bg-white rounded-[8px] shadow hover:shadow-md px-[15px] relative h-[48px] cursor-pointer"
    :style="{ backgroundColor: getValidBackColor(color.back_color) }"
  >
    <div class="w-full">
      <div class="flex items-center relative">
        <ColorIcon :color="getValidForeColor(color.fore_color)" />
        <p
          class="flex-initial ml-[10px] font-['Roboto'] text-[13px] leading-[15px] font-medium truncate w-full"
          :style="{ color: getValidForeColor(color.fore_color) }"
        >
          {{ color.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ColorIcon from '@/components/Colors/Icons/ColorIcon.vue'

export default {
  components: {
    ColorIcon
  },
  props: {
    color: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    }
  }
}
</script>

<style>
</style>
