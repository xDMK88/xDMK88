<template>
  <div>
    <div class="max-w-xl mx-auto">
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-10">
        Поздравляем, вы успешно обработали все задачи. Не хотите запланировать
        дела на завтра?
      </p>
      <div class="grid grid-cols-1">
        <button
          class="bg-orange-500 px-2 py-1 mx-auto rounded-xl text-white mt-10 hover:bg-orange-500 bg-opacity-70"
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
