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
    <div class="w-full inline-block min-h-[40px]">
      <div
        class="min-w-[50%] max-w-[80%] rounded-b-[14px] flex flex-col"
        :class="{ 'bg-[#edf7ed] rounded-tr-[14px] float-left': !isMyMessage, 'bg-[#fceaea] rounded-tl-[14px] float-right': isMyMessage }"
      >
        <div
          v-if="quote"
          class="py-2 px-2.5 flex flex-row"
          :class="{ 'bg-[#b5f4b4] rounded-tr-[14px]': !isMyMessage, 'bg-[#fad7d7] rounded-tl-[14px]': isMyMessage }"
        >
          <svg
            class="flex-none"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.4239 16.2244H10.7694V7.78449C10.7694 7.39012 10.4276 7.04834 10.007 7.04834H7.69336L10.007 4.26149L13.6877 7.78449C13.8454 7.91594 14.0295 7.99481 14.2398 7.99481C14.4501 7.99481 14.6342 7.91594 14.7919 7.78449C14.9234 7.65303 15.0023 7.46899 15.0023 7.28496C15.0023 7.10092 14.9234 6.91688 14.7919 6.75914L10.5854 2.73662C10.4013 2.57887 10.191 2.5 9.98068 2.5C9.77035 2.5 9.58631 2.57887 9.42857 2.71033L5.22201 7.25867C5.01168 7.46899 4.93281 7.78448 5.06427 8.04739C5.16943 8.3103 5.45863 8.49434 5.77412 8.49434H9.21824V17.0657C9.21824 17.4337 9.50744 17.7229 9.87551 17.7229H14.4239C14.8445 17.7229 15.16 17.3812 15.16 16.9868C15.16 16.5924 14.8445 16.2244 14.4239 16.2244Z"
              fill="#a5a5a5"
            />
          </svg>
          <div class="width100without16">
            <p class="text-[11px] leading-[16px] overflow-hidden text-black text-ellipsis whitespace-nowrap">
              {{ quoteUser }}
            </p>
            <p class="text-[12px] leading-[16px] overflow-hidden text-[#9a9fa6] text-ellipsis whitespace-nowrap">
              {{ quote }}
            </p>
          </div>
        </div>
        <div
          class="table-cell py-2 px-2.5 text-sm dark:bg-gray-800 dark:text-gray-100"
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
    quoteUser: {
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
.width100without16 {
  width: calc(100% - 16px);
}
</style>
