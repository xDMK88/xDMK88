<script setup>
const props = defineProps({
  message: Object
})
</script>
<template>
  <div
    class="bg-[#FCEBEB] py-[10px] px-[15px] rounded-t-[12px] rounded-br-[12px] mb-[5px] float-left"
  >
    {{ props.message.file_name }}
  </div>
</template>
