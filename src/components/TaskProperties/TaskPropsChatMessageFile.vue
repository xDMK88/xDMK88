<template>
  <div>
    <div
      v-if="showCreator"
      class="flex"
      :class="{ 'flex-row-reverse': isMyFile }"
    >
      <p
        class="text-[13px] text-[#a6a6a6] dark:text-gray-100"
      >
        {{ creatorName }}
      </p>
    </div>
    <div class="w-full inline-block">
      <div
        class="mt-1 text-sm bg-[#edf7ed] dark:bg-gray-800 dark:text-gray-100"
        :class="{ 'bg-[#edf7ed] msg-custom-chat-left': !isMyFile, 'bg-[#fceaea] msg-custom-chat-right': isMyFile }"
      >
        <FileMessage :file="file" />
        <div class="mt-2">
          {{ fileName }}
        </div>
        <div
          v-if="time && size"
          class="flex justify-between text-[12px] text-[#a8afca] dark:text-gray-300"
        >
          <p>{{ size }}</p>
          <p>{{ time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileMessage from '@/components/properties/FileMessage.vue'

export default {
  components: {
    FileMessage
  },
  props: {
    isMyFile: {
      type: Boolean,
      default: true
    },
    showCreator: {
      type: Boolean,
      default: true
    },
    creatorName: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    file: {
      type: Object,
      default: () => ({})
    },
    time: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.msg-custom-chat-left {
  float: left;
  padding: 8px 10px;
  width: 80%;
  min-height: 40px;
  display: table-cell;
  max-width: 80%;
  min-width: 50%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.msg-custom-chat-right {
  float: right;
  padding: 8px 10px;
  min-height: 40px;
  display: table-cell;
  max-width: 80%;
  min-width: 50%;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
