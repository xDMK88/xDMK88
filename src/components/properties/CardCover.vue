<script setup>
const props = defineProps({
  coverColor: String,
  coverLink: String
})
</script>
<template>
  <div
    class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] min-h-[93px] max-h-[93px] overflow-hidden flex items-center justify-center"
    :style="{ 'background-color': props.coverColor !== '#A998B6' ? props.coverColor : '#F4F5F7' }"
  >
    <img
      :src="coverLink"
      class="max-h-[93px]"
    >
  </div>
</template>
