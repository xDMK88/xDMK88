<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { FILE_REQUEST } from '@/store/actions/cardfilesandmessages'

let intervalId = 0
const store = useStore()
const router = useRouter()
const text = ref('We are downloading card file for you')
const dots = ref('.')

onMounted(() => {
  // Start dots blinking
  intervalId = setInterval(() => {
    dots.value.length < 3 ? dots.value += '.' : dots.value = '.'
  }, 500)

  const type = router.currentRoute.value.query.type
  const format = router.currentRoute.value.query.format

  store.dispatch(FILE_REQUEST, router.currentRoute.value.params.id).then((resp) => {
    const fileBlob = new Blob([resp.data], { type: type + '/' + format })
    const urlCreator = window.URL || window.webkitURL
    const fileURL = urlCreator.createObjectURL(fileBlob)
    text.value = 'File has been downloaded'
    dots.value = '.'
    clearInterval(intervalId)
    window.location.href = fileURL
  }).catch((err) => {
    text.value = err
    dots.value = '.'
    clearInterval(intervalId)
  })
})

</script>
<template>
  <p class="text-[40px] font-[700]">
    {{ text }} {{ dots }}
  </p>
</template>
