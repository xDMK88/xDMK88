<template>
  <div
    class="group flex items-center bg-white rounded-[8px] shadow hover:shadow-md px-[15px] relative h-[48px] cursor-pointer"
    :style="{ backgroundColor: getValidBackColor(color.back_color) }"
  >
    <div class="w-full flex justify-between">
      <div
        class="flex items-center relative"
        @click="$emit('goto')"
      >
        <ColorIcon :color="getValidForeColor(color.fore_color)" />
        <p
          class="flex-initial ml-[10px] font-['Roboto'] text-[13px] leading-[15px] font-medium truncate w-full"
          :style="{ color: getValidForeColor(color.fore_color) }"
        >
          {{ color.name }}
        </p>
      </div>
      <ColorProps
        class="hidden group-hover:block"
        @click="$emit('props')"
      />
    </div>
  </div>
</template>

<script>
import ColorIcon from '@/components/Colors/Icons/ColorIcon.vue'
import ColorProps from '@/components/Colors/Icons/ColorProps.vue'

export default {
  components: {
    ColorIcon,
    ColorProps
  },
  props: {
    color: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['props', 'goto'],
  methods: {
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return 'black'
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
