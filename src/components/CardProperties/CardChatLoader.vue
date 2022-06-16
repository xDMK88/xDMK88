<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps({
  status: String
})

const dots = ref('.')

onMounted(() => {
  if (props.status === 'loading') {
    setInterval(() => {
      dots.value.length === 3 ? dots.value = '.' : dots.value += '.'
    }, 100)
  }
})
</script>
<template>
  {{ dots }}
</template>
