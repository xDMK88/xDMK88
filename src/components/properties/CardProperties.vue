<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedCard = computed(() => store.state.cards.selectedCard)
</script>

<template>
  <div class="relative h-full">
    <p
      class="text-[#7E7E80] text-[12px]"
    >
      Дата создания: {{ selectedCard.date_create }}
    </p>
    <div
      class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] min-h-[93px] max-h-[93px]"
      :style="{ 'height': selectedCard.cover_size_y + 'px', 'background': selectedCard.cover_color !== '#A998B6' ? selectedCard.cover_color : '#F4F5F7' }"
    />
    <p class="text-[18px] font-[700] my-[25px] text-[#424242]">
      {{ selectedCard.name }}
    </p>
    <textarea
      v-model="selectedCard.comment"
      placeholder="Описание..."
      class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] p-[12px] focus:border-[rgba(0, 0, 0, 0.5) w-full h-[110px] font-[400] text-[14px] text-[#4C4C4D]"
      style="background-color: #F4F5F7; resize: none"
    />
    <div class="flex absolute bottom-[30px] w-full">
      <input
        class="bg-[#F4F5F7] py-[17px] px-[15px] rounded-l-[10px] text-[#656566] w-full text-[14px]"
        type="text"
        placeholder="Напишите сообщение..."
      >

      <div
        class="rounded-r-[10px] flex items-center justify-center bg-[#F4F5F7] pr-[15px]"
      >
        <div
          class="rounded-full flex items-center justify-center min-w-[32px] min-h-[32px]"
          style="background: linear-gradient(0deg, #575758, #575758), #FFFFFF;"
        >
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.665 15.141C4.60692 15.141 2.9288 13.4263 2.9288 11.3234V3.8176C2.9288 1.71468 4.60692 0 6.665 0C8.72308 0 10.4012 1.71468 10.4012 3.8176V11.3396C10.4012 13.4425 8.72308 15.141 6.665 15.141ZM6.665 1.58527C5.46182 1.58527 4.48027 2.5882 4.48027 3.8176V11.3234C4.48027 12.5528 5.46182 13.5557 6.665 13.5557C7.86818 13.5557 8.84973 12.569 8.84973 11.3557V3.8176C8.84973 2.5882 7.86818 1.58527 6.665 1.58527Z"
              fill="#FCFDFF"
            />
            <path
              d="M7.44074 17.4218H5.88926V20.9968H7.44074V17.4218Z"
              fill="#FCFDFF"
            />
            <path
              d="M8.72308 21.7894H4.62276C4.19531 21.7894 3.84702 21.4336 3.84702 20.9968C3.84702 20.56 4.19531 20.2042 4.62276 20.2042H8.72308C9.15052 20.2042 9.49881 20.56 9.49881 20.9968C9.49881 21.4336 9.15052 21.7894 8.72308 21.7894Z"
              fill="#FCFDFF"
            />
            <path
              d="M6.665 18.2307C2.99213 18.2307 0 15.1895 0 11.4204V10.7896C0 10.3528 0.34829 9.99693 0.775736 9.99693C1.20318 9.99693 1.55147 10.3528 1.55147 10.7896V11.4204C1.55147 14.2998 3.84702 16.6454 6.665 16.6454C9.48298 16.6454 11.7785 14.2998 11.7785 11.4204V10.7896C11.7785 10.3528 12.1268 9.99693 12.5543 9.99693C12.9817 9.99693 13.33 10.3528 13.33 10.7896V11.4204C13.33 15.1895 10.3379 18.2307 6.665 18.2307Z"
              fill="#FCFDFF"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
