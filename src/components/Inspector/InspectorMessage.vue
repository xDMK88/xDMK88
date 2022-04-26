<script setup>
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import projectIcon from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import colorIcon from '@/icons/color.js'

const store = useStore()
const employees = computed(() => store.state.employees.employees)
const projects = computed(() => store.state.projects.projects)
const tags = computed(() => store.state.tasks.tags)
const colors = computed(() => store.state.colors.colors)
const inputMessage = inject('inputMessage')
const currentState = inject('currentState')
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
  selectProject: {
    type: Function
  },
  selectTag: {
    type: Function
  },
  selectColor: {
    type: Function
  },
  selectAccess: {
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

const computedColors = computed(() => {
  const newColors = {}
  if (currentState.value !== 'colorSelection') return colors.value
  for (const key in colors.value) {
    if (colors.value[key].name.toLowerCase().includes(inputMessage.value.toLowerCase())) {
      newColors[key] = colors.value[key]
    }
  }
  return newColors
})

const computedTags = computed(() => {
  const newTags = {}
  if (currentState.value !== 'tagSelection') return tags.value
  for (const key in tags.value) {
    if (tags.value[key].name.toLowerCase().includes(inputMessage.value.toLowerCase())) {
      newTags[key] = tags.value[key]
    }
  }
  return newTags
})

const computedEmployees = computed(() => {
  const newEmployees = {}
  if (currentState.value !== 'employeeSelection') return employees.value
  for (const key in employees.value) {
    if (employees.value[key].name.toLowerCase().includes(inputMessage.value.toLowerCase())) {
      newEmployees[key] = employees.value[key]
    }
  }
  return newEmployees
})

const computedProjects = computed(() => {
  const newProjects = {}
  if (currentState.value !== 'projectSelection') return projects.value
  for (const key in projects.value) {
    if (projects.value[key].name.toLowerCase().includes(inputMessage.value.toLowerCase())) {
      newProjects[key] = projects.value[key]
    }
  }
  return newProjects
})

</script>
<template>
  <Transition name="slide-fade">
    <div class="flex items-start mt-4 max-w-md">
      <img
        :src="require('@/assets/images/inspector.jpg')"
        width="50"
        height="50"
        class="rounded-full mr-1"
      >
      <div
        class="bg-blue-50 rounded-xl p-1 px-2"
      >
        <p>{{ props.message }}</p>

        <!-- Select employee -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'employeeSelection'">
          <div v-for="(employee, index, key) in computedEmployees" :key="index" class="mt-1 cursor-pointer">
            <div v-show="key < 4" class="flex items-center bg-white rounded-lg p-1 mr-1" @click="props.selectEmployee(employee)">
              <img :src="employee.fotolink" width="25" height="25" class="rounded-xl mr-1">
              <span class="text-sm text-gray-600">{{ employee.name }}</span>
            </div>
          </div>
          <p
            v-if="props.type === 'employeeSelection' && Object.keys(computedEmployees).length === 0"
            class="text-sm text-gray-500"
          >
            Сотрудник {{ inputMessage }} не найден
          </p>
        </div>

        <!-- Select employee -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'accessSelection'">
          <div v-for="(employee, index, key) in computedEmployees" :key="employee" class="mt-1 cursor-pointer">
            <div v-show="key < 4" class="flex items-center bg-white rounded-lg p-1 mr-1" @click="props.selectAccess(employee)">
              <img :src="employee.fotolink" width="25" height="25" class="rounded-xl mr-1">
              <span class="text-sm text-gray-600">{{ employee.name }}</span>
            </div>
          </div>
          <p
            v-if="props.type === 'employeeSelection' && Object.keys(computedEmployees).length === 0"
            class="text-sm text-gray-500"
          >
            Сотрудник {{ inputMessage }} не найден
          </p>
        </div>

        <!-- Select projects -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'projectSelection'">
          <div v-for="(project, index, key) in computedProjects" :key="project" class="mt-1 cursor-pointer">
            <div v-show="key < 4" class="flex items-center bg-white rounded-lg p-1 mr-1" @click="props.selectProject(project)">
              <icon
                :path="projectIcon.path"
                :width="18"
                :height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-sm text-gray-600">{{ project.name.length > 15 ? project.name.slice(0, 15) + '...' : project.name  }}</span>
            </div>
          </div>
          <p
            v-if="props.type === 'projectSelection' && Object.keys(computedProjects).length === 0"
            class="text-sm text-gray-500"
          >
            <span class="text-sm text-gray-600">Я не смог найти проект {{ inputMessage }}</span>
          </p>
        </div>

        <!-- Select tags -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'tagSelection'">
          <div v-for="(tag, index, key) in computedTags" :key="tag" class="mt-1 cursor-pointer">
            <div v-show="key < 4" class="flex items-center bg-white rounded-lg p-1 mr-1" @click="props.selectTag(tag)">
              <icon
                :path="tagIcon.path"
                :width="18"
                :height="18"
                :box="tagIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-sm text-gray-600">{{ tag.name.length > 15 ? tag.name.slice(0, 15) + '...' : tag.name  }}</span>
            </div>
          </div>
          <p
            v-if="props.type === 'tagSelection' && Object.keys(computedTags).length === 0"
            class="text-sm text-gray-500"
          >
            <span class="text-sm text-gray-600">Я не смог найти метку {{ inputMessage }}</span>
          </p>
        </div>

        <!-- Select Colors -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'colorSelection'">
          <div v-for="(color, index, key) in computedColors" :key="color" class="mt-1 cursor-pointer">
            <div v-show="key" class="flex items-center bg-white rounded-lg p-1 mr-1" @click="props.selectColor(color)">
              <icon
                :path="colorIcon.path"
                :width="18"
                :height="18"
                :box="colorIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-sm text-gray-600">{{ color.name.length > 15 ? color.name.slice(0, 15) + '...' : color.name  }}</span>
            </div>
          </div>
          <p
            v-if="props.type === 'colorSelection' && Object.keys(computedColors).length === 0"
            class="text-sm text-gray-500"
          >
            <span class="text-sm text-gray-600">Я не смог найти цвет {{ inputMessage }}</span>
          </p>
        </div>

        <!-- Select time -->
        <div class="flex flex-wrap mt-2" v-if="props.type === 'timeSelection'">
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 mr-1 cursor-pointer" @click="props.selectTime({ name: 'Сегодня', date: new Date().toISOString() })">
            <span class="text-sm text-gray-600">Сегодня</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 mr-1 cursor-pointer" @click="props.selectTime({ name: 'Завтра', date: new Date((new Date().setDate(new Date().getDate() + 1))).toISOString() })">
            <span class="text-sm text-gray-600">Завтра</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 mr-1 cursor-pointer" @click="props.selectTime({ name: 'Послезавтра', date: new Date((new Date().setDate(new Date().getDate() + 2))).toISOString() })">
            <span class="text-sm text-gray-600">Послезавтра</span>
          </div>
        </div>

        <!-- Confirm adding additional params -->
        <div class="flex mt-2" v-if="props.type === 'confirmParams'">
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1" @click="props.actionConfirmNewParams(true)">
            <span class="text-sm text-gray-600">Да</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer" @click="props.actionConfirmNewParams(false)">
            <span class="text-sm text-gray-600">Нет</span>
          </div>
        </div>

        <!-- Confirm delegate the task -->
        <div class="flex mt-2" v-if="props.type === 'confirmDelegate'">
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1" @click="props.actionConfirmDelegate(true)">
            <span class="text-sm text-gray-600">Да</span>
          </div>
          <div class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer" @click="props.actionConfirmDelegate(false)">
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
