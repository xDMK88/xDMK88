<script setup>
import { computed } from 'vue'

import CardChatInterlocutorMessage from '@/components/properties/CardChatInterlocutorMessage.vue'
import CardChatInterlocutorFileMessage from '@/components/properties/CardChatInterlocutorFileMessage.vue'
import CardChatSelfMessage from '@/components/properties/CardChatSelfMessage.vue'
import CardChatSelfFileMessage from '@/components/properties/CardChatSelfFileMessage.vue'
import CardChatQuoteMessage from '@/components/properties/CardChatQuoteMessage.vue'

const props = defineProps({
  messages: Array,
  currentUserUid: String,
  employees: Object,
  showFilesOnly: Boolean
})

const getMessageByUid = (uid) => {
  for (const message of props.messages) {
    if (message.uid === uid) return message
  }
  return false
}

const messages = computed(() => {
  const mutatedMessages = props.messages.map((message) => ({
    ...message,
    isFile: !!message.uid_file,
    isMessage: !message.uid_file && message.uid_creator !== 'inspector',
    hasQuote: message.uid_quote && message.uid_quote !== '00000000-0000-0000-0000-000000000000',
    quoteMessage: getMessageByUid(message?.uid_quote),
    isInspectorMessage: message.uid_creator === 'inspector',
    isMyMessage: message.uid_creator === props.currentUserUid
  }))
  return mutatedMessages
})

const isChangedDate = (index) => {
  if (index === 0) return true
  const messagePrev = messages.value[index - 1]
  const messageCurr = messages.value[index]
  if (!messagePrev || !messageCurr) return false
  return new Date(messagePrev.date_create).toDateString() !==
            new Date(messageCurr.date_create).toDateString()
}

const isChangedCreator = (index) => {
  if (index === 0) return true
  const messagePrev = messages.value[index - 1]
  const messageCurr = messages.value[index]
  if (!messagePrev || !messageCurr) return false
  return messagePrev.uid_creator !== messageCurr.uid_creator
}

const getMessageWeekDateString = (dateCreate) => {
  if (!dateCreate) return ''
  // добавляем Z в конец, чтобы он посчитал что это UTC время
  if (dateCreate[dateCreate.length - 1] !== 'Z') {
    dateCreate += 'Z'
  }
  const today = new Date()
  const date = new Date(dateCreate)
  let weekDay = date.toLocaleString('default', { weekday: 'long' })
  weekDay = weekDay.slice(0, 1).toUpperCase() + weekDay.slice(1)
  const dayNum = date.getDate()
  const day = (dayNum < 10 ? '0' : '') + dayNum
  const month = date.toLocaleString('default', { month: 'short' }).slice(0, 3)
  const year = (today.getFullYear() !== date.getFullYear()) ? date.getFullYear().toString() : ''
  return `${weekDay}, ${day} ${month} ${year}`
}
</script>

<template>
  <div class="flex flex-col pb-[100px]">
    <div
      v-for="(message, index) in messages"
      :key="index"
    >
      <!-- New date -->
      <div
        v-if="isChangedDate(index)"
        class="text-[#88888A] text-[11px] font-[400] leading-[13px] tracking-wide my-[15px] text-center"
      >
        {{ getMessageWeekDateString(message.date_create) }}
      </div>

      <!-- New creator -->
      <div
        v-if="isChangedCreator(index) && props.employees[message.uid_creator]"
        class="text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'text-left': !message.isMyMessage, 'text-right': message.isMyMessage }"
      >
        {{ props.employees[message.uid_creator].name }}
      </div>

      <card-chat-quote-message
        v-if="message.hasQuote"
        :quote-message="message.quoteMessage"
        :employee="props.employees[message.quoteMessage.uid_creator]"
      />

      <card-chat-interlocutor-message
        v-if="!message.isMyMessage && message.isMessage && !props.showFilesOnly"
        :message="message"
        :employee="props.employees[message.uid_creator]"
      />
      <card-chat-interlocutor-file-message
        v-if="!message.isMyMessage && message.isFile"
        :message="message"
        :employee="props.employees[message.uid_creator]"
      />

      <card-chat-self-message
        v-if="message.isMyMessage && message.isMessage && !props.showFilesOnly"
        :message="message"
        :employee="props.employees[message.uid_creator]"
      />
      <card-chat-self-file-message
        v-if="message.isMyMessage && message.isFile"
        :message="message"
        :employee="props.employees[message.uid_creator]"
      />
    </div>
  </div>
</template>
