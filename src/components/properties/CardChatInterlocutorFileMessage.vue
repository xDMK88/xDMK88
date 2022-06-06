<script setup>
import ImagePreloader from '@/components/properties/ImagePreloader.vue'
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
// const FileIsMovie = computed(() => ['mov', 'mp4'].includes(fileExtension.value))
// const FileIsDoc = computed(() => ['doc', 'xls', 'xlsx', 'txt', 'pdf'].includes(fileExtension.value))
// const FileIsAudio = computed(() => ['mp3', 'wav', 'm4a'].includes(fileExtension.value))
</script>

<template>
  <div
    class="bg-[#FCEBEB] py-[12px] px-[12px] rounded-t-[12px] rounded-br-[12px] mb-[5px] float-left"
  >
    <image-preloader
      v-if="FileIsImage"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      preloader-color="#FCEBEB"
    />
  </div>
</template>
