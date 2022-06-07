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
const audioLoaded = ref(false)
const audioSrc = ref('')

const loadAudioFromInternet = () => {
  store.dispatch(FILE_REQUEST, props.fileUid).then((resp) => {
    const imageBlob = new Blob([resp.data], { type: 'audio/' + props.fileExtension })
    writeCache(props.fileUid, imageBlob)
    const urlCreator = window.URL || window.webkitURL
    const imageURL = urlCreator.createObjectURL(imageBlob)
    audioSrc.value = imageURL
    audioLoaded.value = true
  })
}

onMounted(() => {
  loadAudioFromInternet()
})
</script>
<template>
  <div v-if="!audioLoaded">
    Audio is loading
  </div>
  <div v-if="audioLoaded">
    <figure>
      <audio
        class="w-full"
        controls
        :src="audioSrc"
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </figure>
  </div>
  <p class="text-[#7E7E80] font-[500] leading-[15px] text-[13px] text-right mt-[8px]">
    {{ props.fileName }}
  </p>
  <p
    class="leading-[13px] text-[11px] font-[700] text-right mt-[8px]"
    style="color: rgba(0, 0, 0, 0.4);"
  >
    {{ props.fileDateCreate }}
  </p>
</template>
