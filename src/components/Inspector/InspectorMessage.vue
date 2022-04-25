<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const employees = computed(() => store.state.employees.employees)
const props = defineProps({
  message: {
    type: String
  },
  date: {
    type: String
  },
  type: {
    type: String
  },
  selectEmployee: {
    type: Function
  },
  selectTime: {
    type: Function
  },
  actionConfirmNewParams: {
    type: Function
  },
  actionConfirmDelegate: {
    type: Function
  }
})

const getMessageTimeString = (dateCreate) => {
  const date = new Date(dateCreate)
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric'
  })
}
</script>
<template>
  <Transition name="slide-fade">
    <div class="flex items-start mt-4">
      <img
        :src="require('@/assets/images/inspector.jpg')"
        width="50"
        height="50"
        class="rounded-full mr-1"
      >
      <div
        class="bg-blue-50 rounded-xl p-1 px-2 max-w-sm"
      >
        <p>{{ props.message }}</p>

        <!-- Select employee -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'employeeSelection'">
          <div v-for="employee of employees" :key="employee" class="mt-1 cursor-pointer">
            <div class="flex items-center bg-white rounded-lg p-1 mr-1" @click="props.selectEmployee(employee)">
              <img :src="employee.fotolink" width="25" height="25" class="rounded-xl mr-1">
              <span class="text-sm text-gray-600">{{ employee.name }}</span>
            </div>
          </div>
        </div>

        <!-- Select time -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'timeSelection'">
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 mr-1 cursor-pointer" @click="props.selectTime({ name: 'Сегодня', date: new Date().toISOString() })">
            <span class="text-sm text-gray-600">Сегодня</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 mr-1 cursor-pointer" @click="props.selectTime({ name: 'Завтра', date: new Date().toISOString() })">
            <span class="text-sm text-gray-600">Завтра</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 mr-1 cursor-pointer" @click="props.selectTime({ name: 'Послезавтра', date: new Date().toISOString() })">
            <span class="text-sm text-gray-600">Послезавтра</span>
          </div>
        </div>

        <!-- Confirm adding additional params -->
        <div class="flex items-stretch justify-between mt-2" v-if="props.type === 'confirmParams'">
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 cursor-pointer w-full mr-1" @click="props.actionConfirmNewParams(true)">
            <span class="text-sm text-gray-600">Да</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 cursor-pointer w-full" @click="props.actionConfirmNewParams(false)">
            <span class="text-sm text-gray-600">Нет</span>
          </div>
        </div>
        <!-- Confirm delegate the task -->
        <div class="flex items-stretch justify-between mt-2" v-if="props.type === 'confirmDelegate'">
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 cursor-pointer w-full mr-1" @click="props.actionConfirmDelegate(true)">
            <span class="text-sm text-gray-600">Да</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 mt-1 cursor-pointer w-full" @click="props.actionConfirmDelegate(false)">
            <span class="text-sm text-gray-600">Нет</span>
          </div>
        </div>

        <p class="text-sm text-gray-500 float-right">
          {{ getMessageTimeString(props.date) }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
