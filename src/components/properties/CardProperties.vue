<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { CREATE_MESSAGE_REQUEST } from '@/store/actions/cardfilesandmessages'
import { CHANGE_CARD_RESPONSIBLE_USER, CHANGE_CARD_NAME, CHANGE_CARD_COMMENT } from '@/store/actions/cards'

import CardName from '@/components/properties/CardName.vue'
import CardCover from '@/components/properties/CardCover.vue'
import CardChat from '@/components/properties/CardChat.vue'
import CardResponsibleUser from '@/components/properties/CardResponsibleUser.vue'
import CardOptions from '@/components/properties/CardOptions.vue'
import CardBudget from '@/components/properties/CardBudget.vue'
import CardMessageInput from '@/components/properties/CardMessageInput.vue'
import Icon from '@/components/Icon.vue'
import close from '@/icons/close.js'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'

const store = useStore()
const selectedCard = computed(() => store.state.cards.selectedCard)
const user = computed(() => store.state.user.user)
const boards = computed(() => store.state.boards.boards)
const employees = computed(() => store.state.employees.employees)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const cardMessages = computed(() => store.state.cardfilesandmessages.messages)

const changeResponsible = (userEmail) => {
  store.dispatch(CHANGE_CARD_RESPONSIBLE_USER, { cardUid: selectedCard.value.uid, email: userEmail }).then(() => {
    selectedCard.value.user = userEmail
  })
}

// const cardDateCreate = computed(() => {
//   return new Date(selectedCard.value.date_create).toLocaleString()
// })

const changeName = (arg) => {
  const data = { cardUid: selectedCard.value.uid, name: arg.target.innerText }
  store.dispatch(CHANGE_CARD_NAME, data)
}

const closeProperties = () => {
  store.dispatch('asidePropertiesToggle', false)
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const cardMessageInputValue = ref('')

const canEdit = computed(() => boards.value[selectedCard.value.uid_board].type_access !== 0)
const endChangeComment = (text) => {
  const data = { cardUid: selectedCard.value.uid, comment: text }
  store.dispatch(CHANGE_CARD_COMMENT, data)
}

const createCardMessage = () => {
  const uid = uuidv4()
  const data = {
    uid_card: selectedCard.value.uid,
    uid_msg: uid,
    uid: uid,
    date_create: new Date().toISOString(),
    uid_creator: user.value.current_user_uid,
    text: cardMessageInputValue.value,
    msg: cardMessageInputValue.value,
    order: 0,
    deleted: 0
  }
  store.dispatch(CREATE_MESSAGE_REQUEST, data).then(() => {
    selectedCard.value.has_msgs = true
    cardMessageInputValue.value = ''
  })
}
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Close icon -->
    <div class="flex justify-end">
      <Icon
        :path="
          close.path"
        class="text-[#7E7E80] dark:text-white cursor-pointer mb-[15px]"
        :box="close.viewBox"
        :width="close.width"
        :height="close.height"
        @click="closeProperties"
      />
    </div>

    <card-cover
      :card-cover="selectedCard.cover_color"
    />

    <card-name
      :card-name="selectedCard.name"
      :can-edit="canEdit"
      @changeName="changeName"
    />

    <div class="flex justify-start mb-[25px] space-x-[4px]">
      <card-responsible-user
        :responsible="selectedCard.user"
        :employees-by-email="employeesByEmail"
        :can-edit="canEdit"
        @changeResponsible="changeResponsible"
      />
      <card-budget
        :budget="selectedCard.cost"
      />
      <card-options />
    </div>

    <TaskPropsCommentEditor
      class="mt-3 h-32 scroll-style overflow-auto"
      :comment="selectedCard.comment ?? ''"
      :can-edit="canEdit"
      @endChangeComment="endChangeComment"
    />

    <!-- Card chat -->
    <card-chat
      :messages="cardMessages"
      :current-user-uid="user.current_user_uid"
      :employees="employees"
    />
    <div class="flex fixed bottom-[30px] w-[340px]">
      <card-message-input
        v-model="cardMessageInputValue"
        @createCardMessage="createCardMessage"
      />
    </div>
  </div>
</template>
