<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { CREATE_MESSAGE_REQUEST } from '@/store/actions/cardfilesandmessages'

import CardChat from '@/components/properties/CardChat.vue'

const store = useStore()
const selectedCard = computed(() => store.state.cards.selectedCard)
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)
const cardMessages = computed(() => store.state.cardfilesandmessages.messages)
const cardDateCreate = computed(() => {
  return new Date(selectedCard.value.date_create).toLocaleString()
})

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const cardMessageInputValue = ref('')
const createCardMessage = () => {
  const data = {
    uid_card: selectedCard.value.uid,
    uid_msg: uuidv4(),
    text: cardMessageInputValue.value
  }
  store.dispatch(CREATE_MESSAGE_REQUEST, data).then(() => {
    cardMessageInputValue.value = ''
  })
}
</script>

<template>
  <div class="relative h-full">
    <p
      class="text-[#7E7E80] text-[12px] mb-[10px]"
    >
      Дата создания: {{ cardDateCreate }}
    </p>
    <div
      class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] min-h-[93px] max-h-[93px]"
      :style="{ 'height': selectedCard.cover_size_y + 'px', 'background': selectedCard.cover_color !== '#A998B6' ? selectedCard.cover_color : '#F4F5F7' }"
    />
    <p class="text-[18px] font-[700] my-[25px] text-[#424242]">
      {{ selectedCard.name }}
    </p>
    <div class="flex justify-start mb-[15px]">
      <!-- Performer -->
      <div class=" flex items-center bg-[#7B94EB] rounded-[6px] text-white text-[12px] px-[8px] py-[5px] cursor-pointer font-[500] mr-[5px]">
        <svg
          width="13"
          class="mr-[7px]"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
            fill="white"
          />
        </svg>
        Ответственный
      </div>
      <!-- Budget -->
      <div class="flex items-center bg-[#F4F5F7] rounded-[6px] text-[#575758] text-[12px] px-[8px] py-[5px] cursor-pointer font-[500]">
        <svg
          width="17"
          height="12"
          class="mr-[7px]"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.57405 1.55572C2.37759 1.55572 2.18918 1.63376 2.05027 1.77268C1.91135 1.9116 1.83331 2.10001 1.83331 2.29646V9.70387C1.83331 9.90033 1.91135 10.0887 2.05027 10.2277C2.18918 10.3666 2.37759 10.4446 2.57405 10.4446H14.4259C14.6224 10.4446 14.8108 10.3666 14.9497 10.2277C15.0886 10.0887 15.1666 9.90033 15.1666 9.70387V2.29646C15.1666 2.10001 15.0886 1.9116 14.9497 1.77268C14.8108 1.63376 14.6224 1.55572 14.4259 1.55572H2.57405ZM1.0027 0.725114C1.41945 0.308366 1.98468 0.0742402 2.57405 0.0742402H14.4259C15.0153 0.0742402 15.5805 0.308367 15.9973 0.725114C16.414 1.14186 16.6481 1.70709 16.6481 2.29646V9.70387C16.6481 10.2932 16.414 10.8585 15.9973 11.2752C15.5805 11.692 15.0153 11.9261 14.4259 11.9261H2.57405C1.98468 11.9261 1.41945 11.692 1.0027 11.2752C0.585955 10.8585 0.351828 10.2932 0.351828 9.70387V2.29646C0.351828 1.70709 0.585954 1.14186 1.0027 0.725114Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.49998 4.51869C7.68178 4.51869 7.0185 5.18197 7.0185 6.00017C7.0185 6.81837 7.68178 7.48165 8.49998 7.48165C9.31818 7.48165 9.98146 6.81837 9.98146 6.00017C9.98146 5.18197 9.31818 4.51869 8.49998 4.51869ZM5.53701 6.00017C5.53701 4.36377 6.86358 3.0372 8.49998 3.0372C10.1364 3.0372 11.4629 4.36377 11.4629 6.00017C11.4629 7.63657 10.1364 8.96313 8.49998 8.96313C6.86358 8.96313 5.53701 7.63657 5.53701 6.00017Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.339 0.130626C4.6158 0.245279 4.79627 0.515379 4.79627 0.814981C4.79627 1.79726 4.40606 2.73932 3.71148 3.4339C3.0169 4.12847 2.07485 4.51868 1.09257 4.51868C0.792967 4.51868 0.522866 4.33821 0.408214 4.06141C0.293561 3.78462 0.356936 3.46601 0.568786 3.25416L3.53175 0.291198C3.7436 0.079348 4.06221 0.0159733 4.339 0.130626ZM15.9074 8.96313C15.318 8.96313 14.7528 9.19726 14.336 9.614C13.9193 10.0308 13.6852 10.596 13.6852 11.1854C13.6852 11.5945 13.3535 11.9261 12.9444 11.9261C12.5353 11.9261 12.2037 11.5945 12.2037 11.1854C12.2037 10.2031 12.5939 9.26102 13.2885 8.56644C13.9831 7.87186 14.9251 7.48165 15.9074 7.48165C16.3165 7.48165 16.6481 7.81329 16.6481 8.22239C16.6481 8.63149 16.3165 8.96313 15.9074 8.96313Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>

        Бюджет
      </div>
    </div>
    <textarea
      v-model="selectedCard.comment"
      placeholder="Описание..."
      class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] p-[12px] focus:border-[rgba(0, 0, 0, 0.5) w-full h-[110px] font-[400] text-[14px] text-[#4C4C4D]"
      style="background-color: #F4F5F7; resize: none"
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
