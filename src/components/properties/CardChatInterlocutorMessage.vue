<script setup>
const props = defineProps({
  message: Object
})
</script>

<template>
  <div
    class="bg-[#FCEBEB] py-[10px] px-[15px] text-[#4C4C4D] font-[400] text-[14px] rounded-t-[12px] rounded-br-[12px] mb-[5px] leading-[19px]"
  >
    {{ props.message.msg }}
  </div>
</template>
