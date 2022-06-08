<script setup>
import { computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { CREATE_MESSAGE_REQUEST, CREATE_FILES_REQUEST, ADD_MESSAGE_LOCALLY, REMOVE_MESSAGE_LOCALLY } from '@/store/actions/cardfilesandmessages'
import { CHANGE_CARD_RESPONSIBLE_USER, CHANGE_CARD_BUDGET, CHANGE_CARD_NAME, CHANGE_CARD_COMMENT, CHANGE_CARD_COLOR, CHANGE_CARD_COVER, DELETE_CARD } from '@/store/actions/cards'

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
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import CardModalBoxBudget from '@/components/properties/CardModalBoxBudget.vue'

const store = useStore()
const selectedCard = computed(() => store.state.cards.selectedCard)
const user = computed(() => store.state.user.user)
const boards = computed(() => store.state.boards.boards)
const employees = computed(() => store.state.employees.employees)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const cardMessages = computed(() => store.state.cardfilesandmessages.messages)

const showChangeCardBudget = ref(false)

const scrollDown = () => {
  const asideRight = document.getElementById('aside-right')
  asideRight.scroll({ top: asideRight.scrollHeight + 100000, behavior: 'smooth' })
}

const changeResponsible = (userEmail) => {
  store.dispatch(CHANGE_CARD_RESPONSIBLE_USER, { cardUid: selectedCard.value.uid, email: userEmail }).then(() => {
    selectedCard.value.user = userEmail
  })
}

const changeName = (arg) => {
  const data = { cardUid: selectedCard.value.uid, name: arg.target.innerText }
  store.dispatch(CHANGE_CARD_NAME, data)
}

const changeCardBudget = (budget) => {
  console.log('changing card budget: ', budget)
  const data = { cardUid: selectedCard.value.uid, budget: budget * 100 }
  store.dispatch(CHANGE_CARD_BUDGET, data).then((resp) => {
    selectedCard.value.cost = resp.data.cost
    showChangeCardBudget.value = false
  })
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

const createCardFile = (event) => {
  const files = event.target.files
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    formData.append('files[' + i + ']', file)
  }
  const data = {
    uid_card: selectedCard.value.uid,
    name: formData
  }
  console.log(data)
  store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
    scrollDown()
  })
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
    scrollDown()
  })
}

const changeCardColor = (color) => {
  store.dispatch(CHANGE_CARD_COLOR, { cardUid: selectedCard.value.uid, color: color }).then((resp) => {
    selectedCard.value.cover_color = color
    selectedCard.value.cover_link = ''
    // Replacing old cover file with new cover file
    for (const message of resp.data.deletefiles) store.commit(REMOVE_MESSAGE_LOCALLY, message)
    // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
    nextTick(() => {
      for (const message of resp.data.newfiles) store.commit(ADD_MESSAGE_LOCALLY, message)
    })
  })
}

const changeCardCover = (event) => {
  const files = event.target.files
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    formData.append('files[' + i + ']', file)
  }
  const data = {
    cardUid: selectedCard.value.uid,
    file: formData
  }
  console.log(data)
  store.dispatch(CHANGE_CARD_COVER, data).then((resp) => {
    selectedCard.value.cover_color = resp.data.card.cover_color
    selectedCard.value.cover_link = resp.data.card.cover_link
    // Replacing old cover file with new cover file
    for (const message of resp.data.deletefiles) store.commit(REMOVE_MESSAGE_LOCALLY, message)
    // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
    nextTick(() => {
      for (const message of resp.data.newfiles) store.commit(ADD_MESSAGE_LOCALLY, message)
    })
  })
}

const showDeleteCard = ref(false)
const removeCard = () => {
  store.dispatch(DELETE_CARD, { uid: selectedCard.value.uid }).then(() => closeProperties())
}
</script>

<template>
  <BoardModalBoxDelete
    v-show="showDeleteCard"
    title="Удалить карточку"
    text="Вы действительно хотите удалить карточку?"
    @cancel="showDeleteCard = false"
    @yes="removeCard"
  />
  <CardModalBoxBudget
    v-show="showChangeCardBudget"
    :value="selectedCard.cost / 100"
    :show="showChangeCardBudget"
    title="Бюджет карточки"
    @cancel="showChangeCardBudget = false"
    @save="changeCardBudget"
  />
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
      :cover-color="selectedCard.cover_color"
      :cover-link="selectedCard.cover_link"
      :can-edit="canEdit"
      @onChangeCardColor="changeCardColor"
      @onChangeCardCover="changeCardCover"
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
        :can-edit="canEdit"
        @click="showChangeCardBudget = true"
      />
      <card-options
        :date-create="selectedCard.date_create"
        :can-edit="canEdit"
        @clickRemoveButton="showDeleteCard = true"
      />
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

    <!-- Card chat input -->
    <div class="flex fixed bottom-[30px] w-[340px]">
      <card-message-input
        v-model="cardMessageInputValue"
        @createCardMessage="createCardMessage"
        @createCardFile="createCardFile"
      />
    </div>
  </div>
</template>
