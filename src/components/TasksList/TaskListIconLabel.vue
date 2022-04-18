<template>
  <div
    class="bg-gray-200 rounded px-1.5 mr-1 mt-1.5"
  >
    <Icon
      v-if="iconPath"
      :path="iconPath"
      :class="[iconClass]"
      :box="iconBox"
      :width="iconWidth"
      :height="iconHeight"
    />
    <span
      v-if="text"
      class="cursor-default ml-1 text-xs text-gray-600"
    >
      {{ text }}
    </span>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    iconClass: {
      type: String,
      default: 'text-gray-600'
    },
    iconPath: {
      type: [String, Array],
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    iconBox: {
      type: String,
      default: '0 0 14 14'
    },
    iconWidth: {
      type: String,
      default: '14'
    },
    iconHeight: {
      type: String,
      default: '14'
    }
  }
}
</script>

<style scoped></style>
