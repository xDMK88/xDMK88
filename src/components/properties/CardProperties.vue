<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { CREATE_MESSAGE_REQUEST } from '@/store/actions/cardfilesandmessages'
import { CHANGE_CARD_RESPONSIBLE_USER } from '@/store/actions/cards'

import CardCover from '@/components/properties/CardCover.vue'
import CardChat from '@/components/properties/CardChat.vue'
import CardResponsibleUser from '@/components/properties/CardResponsibleUser.vue'
import CardOptions from '@/components/properties/CardOptions.vue'
import CardBudget from '@/components/properties/CardBudget.vue'
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
  selectedCard.value.comment = text
}
const onChangeComment = (text) => {
  console.log(text)
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

    <p class="text-[18px] font-[700] my-[25px] text-[#424242]">
      {{ selectedCard.name }}
    </p>

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
      @changeComment="onChangeComment"
    />

    <!-- Card chat -->
    <card-chat
      :messages="cardMessages"
      :current-user-uid="user.current_user_uid"
      :employees="employees"
    />

    <!-- Message input -->
    <div class="flex fixed bottom-[30px] w-[340px]">
      <div class="rounded-l-[10px] flex items-center justify-center bg-[#F4F5F7] pl-[15px]">
        <svg
          width="18"
          height="17"
          viewBox="0 0 18 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.65832 15.0516C2.76387 16.1467 4.21322 16.6875 5.66256 16.6875C7.11191 16.6875 8.56126 16.14 9.66681 15.045L16.6169 8.16097C18.1944 6.59855 18.1944 4.05461 16.6169 2.49219C15.8552 1.73769 14.8373 1.31704 13.7587 1.31704C12.6801 1.31704 11.6622 1.73101 10.9004 2.49219L4.51657 8.81531C3.57281 9.75009 3.57281 11.2791 4.51657 12.2139C5.46033 13.1487 7.00405 13.1487 7.94781 12.2139L12.1475 8.05414C12.4644 7.74032 12.4644 7.23286 12.1475 6.91904C11.8307 6.60523 11.3184 6.60523 11.0016 6.91904L6.80856 11.0855C6.49172 11.3993 5.9794 11.3993 5.66256 11.0855C5.34573 10.7717 5.34573 10.2642 5.66256 9.9504L12.0397 3.63396C12.4981 3.17992 13.1048 2.93287 13.7587 2.93287C14.4058 2.93287 15.0193 3.17992 15.4777 3.63396C16.4214 4.56874 16.4214 6.09777 15.4777 7.03255L8.52081 13.9165C6.94338 15.479 4.375 15.479 2.79758 13.9165C2.03583 13.162 1.61788 12.1538 1.61788 11.0855C1.61788 10.0172 2.03583 9.00895 2.80432 8.25445L9.7477 1.37045C10.0645 1.05664 10.0645 0.549183 9.7477 0.235364C9.43087 -0.0784548 8.91854 -0.0784548 8.6017 0.235364L1.65832 7.11935C0.58648 8.17432 0 9.58317 0 11.0855C0 12.5811 0.58648 13.99 1.65832 15.0516Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </div>

      <input
        v-model="cardMessageInputValue"
        class="bg-[#F4F5F7] py-[17px] pr-[15px] pl-[10px] text-[#656566] w-full text-[14px]"
        type="text"
        placeholder="Напишите сообщение..."
        @keyup.enter="createCardMessage"
      >

      <div
        class="rounded-r-[10px] flex items-center justify-center bg-[#F4F5F7] pr-[12px]"
      >
        <div
          class="rounded-[8px] flex items-center justify-center min-w-[32px] min-h-[32px] bg-[#E0E1E3] hover:bg-white"
          @click="createCardMessage"
        >
          <svg
            width="14"
            height="17"
            viewBox="0 0 14 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 0L0 7L0.987 7.987L6.3 2.681V16.8H7.7V2.681L13.013 7.987L14 7L7 0Z"
              fill="#4C4C4D"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
