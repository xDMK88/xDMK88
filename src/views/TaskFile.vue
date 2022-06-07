<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { FILE_REQUEST } from '@/store/actions/taskfiles'

let intervalId = 0
const store = useStore()
const router = useRouter()
const fileHasBeenLoaded = ref(false)
const text = ref('We are downloading card file for you')
const dots = ref('.')

onMounted(() => {
  // Start dots blinking
  intervalId = setInterval(() => {
    dots.value.length < 3 ? dots.value += '.' : dots.value = '.'
  }, 600)

  store.dispatch(FILE_REQUEST, router.currentRoute.value.params.id).then((resp) => {
    const fileBlob = new Blob([resp.data])
    const urlCreator = window.URL || window.webkitURL
    const fileURL = urlCreator.createObjectURL(fileBlob)
    window.location.href = fileURL
    dots.value = '.'
    clearInterval(intervalId)
  }).catch((err) => {
    text.value = err
    dots.value = '.'
    clearInterval(intervalId)
  })
})

</script>
<template>
  {{ fileHasBeenLoaded }}
  <p class="text-[40px] font-[700]">
    {{ text }} {{ dots }}
  </p>
</template>
