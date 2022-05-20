<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'

const store = useStore()
const user = computed(() => store.state.user.user)
const karmaList = computed(() => store.state.inspector.karma)

const successChartData = ref(null)
const overdueChartData = ref(null)

const karmaQuantity = computed(() => {
  let quantity = 0
  for (const karma of karmaList.value) quantity += karma.points
  return quantity
})

onMounted(() => {
  store.dispatch('KARMA_REQUEST', user.value.current_user_uid).then((resp) => {
    successChartData.value = chartConfig.karmaChartData(resp.data, 'success')
    overdueChartData.value = chartConfig.karmaChartData(resp.data, 'danger')
  })
})
</script>

<template>
  <div class="px-5">
    <p class="text-center">
      Ваша карма <br> <span class="text-3xl">{{ karmaQuantity }}</span>
    </p>
    <!-- <pre>{{ karmaList }}</pre> -->
    <br>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-1 ">
        <p class="text-center text-sm">
          Графики
        </p>
        <p class="text-left text-sm font-semibold">
          В срок
        </p>
        <line-chart
          :data="successChartData"
          class="max-h-[180px]"
        />
        <p class="text-left text-sm font-semibold mt-4">
          Просрочено
        </p>
        <line-chart
          :data="overdueChartData"
          class="max-h-[180px]"
        />
      </div>
      <div>
        <p class="text-center text-sm">
          История кармы
        </p>
        <div v-if="!karmaList.length">
          <p class="text-center text-md text-gray-400 mt-10">
            У Вас еще нет истории :( <br> Завершите инспектируемые задачи
          </p>
        </div>
        <div class="flex flex-col">
          <template
            v-for="karma in karmaList"
            :key="karma"
          >
            <p>{{ karma.points }}</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
