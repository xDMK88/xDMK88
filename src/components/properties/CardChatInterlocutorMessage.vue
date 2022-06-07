<script setup>
const props = defineProps({
  message: Object
})

const getMessageTimeString = (dateCreate) => {
  if (!dateCreate) return ''
  // добавляем Z в конец, чтобы он посчитал что это UTC время
  if (dateCreate[dateCreate.length - 1] !== 'Z') {
    dateCreate += 'Z'
  }
  const date = new Date(dateCreate)
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric'
  })
}
</script>

<template>
  <div
    class="bg-[#FCEBEB] py-[10px] px-[15px] rounded-t-[12px] rounded-br-[12px] mb-[5px] float-left max-w-[300px]"
  >
    <div class="flex">
      <span class="mr-[8px] font-[400] text-[14px] text-[#4C4C4D] leading-[19px]">
        {{ props.message.msg }}
      </span>
      <p
        class="text-right font-[700] leading-[14px] text-[11px] self-end"
        style="color: rgba(0, 0, 0, 0.4);"
      >
        {{ getMessageTimeString(message.date_create) }}
      </p>
    </div>
  </div>
</template>
