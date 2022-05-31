<script setup>

const props = defineProps({
  messages: Array
})
</script>

<template>
  {{ props.messages }}
</template>
