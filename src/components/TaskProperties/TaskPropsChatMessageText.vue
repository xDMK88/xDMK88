<template>
  <div>
    <div
      v-if="showCreator"
      class="flex"
      :class="{ 'flex-row-reverse': isMyMessage }"
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
        :class="{ 'bg-[#edf7ed] msg-custom-chat-left': !isMyMessage, 'bg-[#fceaea] msg-custom-chat-right': isMyMessage }"
      >
        <ChatLoader v-if="showLoader" />
        <div
          v-linkify:options="{ className: 'text-blue-600' }"
          v-html="message.replaceAll('\n', '<br/>')"
        />
        <div
          v-if="time"
          class="text-right text-[12px] text-[#a8afca] dark:text-gray-300"
        >
          {{ time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import linkify from 'vue-linkify'
import ChatLoader from '@/components/properties/ChatLoader'

export default {
  directives: {
    linkify
  },
  components: {
    ChatLoader
  },
  props: {
    isMyMessage: {
      type: Boolean,
      default: true
    },
    showCreator: {
      type: Boolean,
      default: true
    },
    showLoader: {
      type: Boolean,
      default: false
    },
    creatorName: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
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
