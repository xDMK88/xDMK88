<script setup>
import Control from '@/components/Control.vue'

const props = defineProps({
  placeholder: {
    type: String,
    required: true
  }
})
</script>

<template>
  <control
    ref="root"
    :placeholder="props.placeholder"
    ctrl-k-focus
    transparent
    borderless
  />
</template>
