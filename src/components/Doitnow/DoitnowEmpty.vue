<template>
  <div>
    <div class="max-w-xl mx-auto">
      <img
        class="mx-auto mt-10"
        width="320"
        height="314"
        src="@/assets/images/emptydoitnow.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-[17px]">
        Отличная работа! В Очереди пусто.<br>
        Запланируем еще дела?
      </p>
      <div class="grid grid-cols-1">
        <button
          class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-orange-500 w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
          @click="goToNextDay"
        >
          Запланировать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['clickPlanning'],
  methods: {
    goToNextDay: function () {
      this.$emit('clickPlanning')
    }
  }
}
</script>

<style scoped></style>
