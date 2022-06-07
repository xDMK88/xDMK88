<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { FILE_REQUEST } from '@/store/actions/cardfilesandmessages'
import { writeCache } from '@/store/helpers/functions'

const props = defineProps({
  fileUid: String,
  fileName: String,
  fileExtension: String,
  fileDateCreate: String,
  preloaderColor: String
})

const store = useStore()
const imageLoaded = ref(false)
const imageSrc = ref('')
const currentLocation = window.location.href

const isFileInCache = () => {
  return !!localStorage.getItem(props.fileUid)
}

const b64toBlob = (base64) => fetch(base64).then(res => res.blob())

const loadImageFromInternet = () => {
  store.dispatch(FILE_REQUEST, props.fileUid).then((resp) => {
    const imageBlob = new Blob([resp.data], { type: 'image/' + props.fileExtension })
    writeCache(props.fileUid, imageBlob)
    const urlCreator = window.URL || window.webkitURL
    const imageURL = urlCreator.createObjectURL(imageBlob)
    imageSrc.value = imageURL
    imageLoaded.value = true
  })
}

const loadImageFromCache = () => {
  const cachedImageBase64 = localStorage.getItem(props.fileUid)
  b64toBlob(cachedImageBase64).then(imageBlob => {
    const urlCreator = window.URL || window.webkitURL
    const imageURL = urlCreator.createObjectURL(imageBlob)
    imageSrc.value = imageURL
    imageLoaded.value = true
  })
}

onMounted(() => {
  if (isFileInCache()) {
    loadImageFromCache()
  } else {
    loadImageFromInternet()
  }
})

</script>
<template>
  <div
    v-if="!imageLoaded"
    class="rounded-[6px] w-[170px] h-[129px] animate-pulse"
    :style="{ 'background': props.preloaderColor }"
  />
  <a
    :href="currentLocation + 'cardfile/' + props.fileUid + '?type=image&format=' + props.fileExtension"
    target="_blank"
  >
    <img
      v-if="imageLoaded"
      class="rounded-[8px]"
      :src="imageSrc"
      alt="chat image "
    >
  </a>
  <a
    :href="currentLocation + 'cardfile/' + props.fileUid"
    target="_blank"
    class="text-[#7E7E80] font-[500] leading-[15px] text-[13px] text-right mt-[8px]"
  >
    {{ props.fileName }}
  </a>
  <p
    class="leading-[13px] text-[11px] font-[700] text-right mt-[8px]"
    style="color: rgba(0, 0, 0, 0.4);"
  >
    {{ props.fileDateCreate }}
  </p>
</template>
