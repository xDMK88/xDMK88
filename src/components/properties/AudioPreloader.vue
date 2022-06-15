<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { FILE_REQUEST } from '@/store/actions/cardfilesandmessages'
import { writeCache } from '@/store/helpers/functions'

import CardChatMessageOptionsPopMenu from '@/components/properties/CardChatMessageOptionsPopMenu.vue'

defineEmits(['onQuoteMessage', 'onDeleteMessage'])
const props = defineProps({
  fileUid: String,
  fileName: String,
  fileExtension: String,
  fileDateCreate: String,
  preloaderColor: String,
  canDelete: {
    type: Boolean,
    default: true
  }
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
    class="leading-[13px] text-[11px] font-[700] text-right mt-[8px] group-hover:hidden min-w-[30px]"
    style="color: rgba(0, 0, 0, 0.4);"
  >
    {{ props.fileDateCreate }}
  </p>
  <div class="group-hover:flex hidden justify-end">
    <card-chat-message-options-pop-menu
      :can-delete="props.canDelete"
      @onQuoteMessage="$emit('onQuoteMessage')"
      @onDeleteMessage="$emit('onDeleteMessage')"
    >
      <div class="min-w-[30px] mt-[5px] min-h-[16px] flex cursor-pointer items-end justify-center">
        <svg
          width="14"
          height="4"
          viewBox="0 0 14 4"
          class="mb-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2004 2.0001C10.2004 1.11644 10.9167 0.400098 11.8004 0.400098C12.684 0.400098 13.4004 1.11644 13.4004 2.0001C13.4004 2.88375 12.684 3.6001 11.8004 3.6001C10.9167 3.6001 10.2004 2.88375 10.2004 2.0001Z"
            fill="#4C4C4D"
          />
          <path
            d="M5.40039 2.0001C5.40039 1.11644 6.11673 0.400098 7.00039 0.400098C7.88405 0.400098 8.60039 1.11644 8.60039 2.0001C8.60039 2.88375 7.88405 3.6001 7.00039 3.6001C6.11673 3.6001 5.40039 2.88375 5.40039 2.0001Z"
            fill="#4C4C4D"
          />
          <path
            d="M0.60039 2.0001C0.60039 1.11644 1.31674 0.400098 2.20039 0.400098C3.08405 0.400098 3.80039 1.11644 3.80039 2.0001C3.80039 2.88375 3.08405 3.6001 2.20039 3.6001C1.31674 3.6001 0.60039 2.88375 0.60039 2.0001Z"
            fill="#4C4C4D"
          />
        </svg>
      </div>
    </card-chat-message-options-pop-menu>
  </div>
</template>
