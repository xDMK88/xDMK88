<script setup>
import ImagePreloader from '@/components/properties/ImagePreloader.vue'
// import CardChatLoader from '@/components/properties/CardChatLoader.vue'
import { computed } from 'vue'
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

const fileExtension = computed(() => {
  const splittedValue = props.message.file_name.split('.')
  return splittedValue[splittedValue.length - 1].toLowerCase()
})
const FileIsImage = computed(() => ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif'].includes(fileExtension.value))
</script>
<template>
  <div
    class="bg-[#F4F5F7] py-[10px] px-[12px] rounded-t-[12px] rounded-bl-[12px] mb-[5px] float-right relative"
  >
    <!--
    <card-chat-loader
      status="loading"
      class="absolute bottom-[10px]"
    />
    -->
    <image-preloader
      v-if="FileIsImage"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      preloader-color="#F4F5F7"
    />
  </div>
</template>
