<script setup>
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import projectIcon from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import colorIcon from '@/icons/color.js'

const store = useStore()
const employees = computed(() => store.state.employees.employees)
const currentUserUid = computed(() => store.state.user.user?.current_user_uid)
const projects = computed(() => store.state.projects.projects)
const tags = computed(() => store.state.tasks.tags)
const colors = computed(() => store.state.colors.colors)
const inputMessage = inject('inputMessage')
const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  selectEmployee: {
    type: Function,
    default: () => {}
  },
  selectProject: {
    type: Function,
    default: () => {}
  },
  selectTag: {
    type: Function,
    default: () => {}
  },
  selectColor: {
    type: Function,
    default: () => {}
  },
  selectAccess: {
    type: Function,
    default: () => {}
  },
  selectTime: {
    type: Function,
    default: () => {}
  },
  actionConfirmNewParams: {
    type: Function,
    default: () => {}
  },
  actionConfirmDelegate: {
    type: Function,
    default: () => {}
  }
})

const getMessageTimeString = (dateCreate) => {
  const date = new Date(dateCreate)
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric'
  })
}

const noSetObj = {
  uid: 'no_set',
  name: 'Не устанавливать',
  comment: 'Нет'
}

const computedColors = computed(() => {
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newColors = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newColors[noSetObj.uid] = noSetObj
  }
  for (const colorUid in colors.value) {
    if (
      colors.value[colorUid].parentID &&
      colors.value[colorUid].name
        .toLowerCase()
        .includes(inputLowerCase)
    ) {
      newColors[colorUid] = colors.value[colorUid]
    }
  }
  return newColors
})

const computedTags = computed(() => {
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newTags = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newTags[noSetObj.uid] = noSetObj
  }
  for (const key in tags.value) {
    if (
      tags.value[key].name
        .toLowerCase()
        .includes(inputLowerCase)
    ) {
      newTags[key] = tags.value[key]
    }
  }
  return newTags
})

function includesWord (src, value) {
  // транслитирируем русские буквы и пытаемся найти английский
  let valueTranslit = ''
  const converter = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ы: 'y',
    ъ: '',
    э: 'e',
    ю: 'yu',
    я: 'ya'
  }
  for (let i = 0; i < value.length; ++i) {
    const convertedChar = converter[value[i]]
    if (convertedChar === undefined) {
      valueTranslit += value[i]
    } else {
      valueTranslit += convertedChar
    }
  }
  const searchSrc = src.toLowerCase()
  return searchSrc.includes(value) || searchSrc.includes(valueTranslit)
}

const computedEmployees = computed(() => {
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newEmployees = {}
  for (const empUid in employees.value) {
    if (
      empUid !== currentUserUid.value &&
      includesWord(employees.value[empUid].name, inputLowerCase)
    ) {
      newEmployees[empUid] = employees.value[empUid]
    }
  }
  return newEmployees
})

const computedAccessEmployees = computed(() => {
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newEmployees = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newEmployees[noSetObj.uid] = noSetObj
  }
  for (const empUid in employees.value) {
    if (
      empUid !== currentUserUid.value &&
      includesWord(employees.value[empUid].name, inputLowerCase)
    ) {
      newEmployees[empUid] = employees.value[empUid]
    }
  }
  return newEmployees
})

const computedProjects = computed(() => {
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newProjects = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newProjects[noSetObj.uid] = noSetObj
  }
  for (const key in projects.value) {
    if (projects.value[key].name.toLowerCase().includes(inputLowerCase)) {
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
      <div class="bg-blue-50 rounded-xl p-1 px-2">
        <p>{{ props.message }}</p>

        <!-- Select employee -->
        <div
          v-if="props.type === 'employeeSelection'"
          class="flex flex-wrap mt-2"
        >
          <div
            v-for="(employee, index, key) in computedEmployees"
            :key="index"
            class="mt-1 cursor-pointer"
          >
            <div
              v-show="key < 4"
              class="flex items-center bg-white rounded-lg p-1 mr-1"
              @click="props.selectEmployee(employee)"
            >
              <img
                :src="employee.fotolink"
                width="25"
                height="25"
                class="rounded-xl mr-1"
              >
              <span class="text-sm text-gray-600">{{ employee.name }}</span>
            </div>
          </div>
          <p
            v-if="
              props.type === 'employeeSelection' &&
                Object.keys(computedEmployees).length === 0
            "
            class="text-sm text-gray-500"
          >
            Сотрудник {{ inputMessage }} не найден
          </p>
        </div>

        <!-- Select access employee -->
        <div
          v-if="props.type === 'accessSelection'"
          class="flex flex-wrap mt-2"
        >
          <div
            v-for="(employee, _, index) in computedAccessEmployees"
            :key="index"
            class="mt-1 cursor-pointer"
          >
            <div
              v-show="index < 4"
              class="flex items-center bg-white rounded-lg p-1 mr-1"
              @click="props.selectAccess(employee)"
            >
              <img
                v-if="employee.uid !== 'no_set'"
                :src="employee.fotolink"
                width="25"
                height="25"
                class="rounded-xl mr-1"
              >
              <span class="text-sm text-gray-600">{{ employee.name }}</span>
            </div>
          </div>
          <p
            v-if="
              props.type === 'employeeSelection' &&
                Object.keys(computedEmployees).length === 0
            "
            class="text-sm text-gray-500"
          >
            Сотрудник {{ inputMessage }} не найден
          </p>
        </div>

        <!-- Select projects -->
        <div
          v-if="props.type === 'projectSelection'"
          class="flex flex-wrap mt-2"
        >
          <div
            v-for="(project, index, key) in computedProjects"
            :key="project"
            class="mt-1 cursor-pointer"
          >
            <div
              v-if="key < 4"
              class="flex items-center bg-white rounded-lg p-1 mr-1"
              @click="props.selectProject(project)"
            >
              <icon
                v-if="project.uid !== 'no_set'"
                :path="projectIcon.path"
                :width="18"
                :height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-sm text-gray-600">{{
                project.name.length > 16
                  ? project.name.slice(0, 16) + '...'
                  : project.name
              }}</span>
            </div>
          </div>
          <p
            v-if="
              props.type === 'projectSelection' &&
                Object.keys(computedProjects).length === 0
            "
            class="text-sm text-gray-500"
          >
            <span
              class="text-sm text-gray-600"
            >Я не смог найти проект {{ inputMessage }}</span>
          </p>
        </div>

        <!-- Select tags -->
        <div
          v-if="props.type === 'tagSelection'"
          class="flex flex-wrap mt-2"
        >
          <div
            v-for="(tag, index, key) in computedTags"
            :key="tag"
            class="mt-1 cursor-pointer"
          >
            <div
              v-show="key < 4"
              class="flex items-center bg-white rounded-lg p-1 mr-1"
              @click="props.selectTag(tag)"
            >
              <icon
                v-if="tag.uid !== 'no_set'"
                :path="tagIcon.path"
                :width="18"
                :height="18"
                :box="tagIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-sm text-gray-600">{{
                tag.name.length > 16 ? tag.name.slice(0, 16) + '...' : tag.name
              }}</span>
            </div>
          </div>
          <p
            v-if="
              props.type === 'tagSelection' &&
                Object.keys(computedTags).length === 0
            "
            class="text-sm text-gray-500"
          >
            <span
              class="text-sm text-gray-600"
            >Я не смог найти метку {{ inputMessage }}</span>
          </p>
        </div>

        <!-- Select Colors -->
        <div
          v-if="props.type === 'colorSelection'"
          class="flex flex-wrap mt-2"
        >
          <div
            v-for="(color, _, index) in computedColors"
            :key="index"
            class="mt-1 cursor-pointer"
          >
            <div
              v-show="index < 4"
              class="flex items-center bg-white rounded-lg p-1 mr-1"
              @click="props.selectColor(color)"
            >
              <icon
                v-if="color.uid !== 'no_set'"
                :path="colorIcon.path"
                :width="18"
                :height="18"
                :box="colorIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-sm text-gray-600">{{
                color.name.length > 16
                  ? color.name.slice(0, 16) + '...'
                  : color.name
              }}</span>
            </div>
          </div>
          <p
            v-if="
              props.type === 'colorSelection' &&
                Object.keys(computedColors).length === 0
            "
            class="text-sm text-gray-500"
          >
            <span
              class="text-sm text-gray-600"
            >Я не смог найти цвет {{ inputMessage }}</span>
          </p>
        </div>

        <!-- Select time -->
        <div
          v-if="props.type === 'timeSelection'"
          class="flex flex-wrap mt-2"
        >
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 mr-1 cursor-pointer"
            @click="
              props.selectTime({
                name: 'Сегодня',
                date: new Date().toISOString()
              })
            "
          >
            <span class="text-sm text-gray-600">Сегодня</span>
          </div>
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 mr-1 cursor-pointer"
            @click="
              props.selectTime({
                name: 'Завтра',
                date: new Date(
                  new Date().setDate(new Date().getDate() + 1)
                ).toISOString()
              })
            "
          >
            <span class="text-sm text-gray-600">Завтра</span>
          </div>
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 mr-1 cursor-pointer"
            @click="
              props.selectTime({
                name: 'Послезавтра',
                date: new Date(
                  new Date().setDate(new Date().getDate() + 2)
                ).toISOString()
              })
            "
          >
            <span class="text-sm text-gray-600">Послезавтра</span>
          </div>
        </div>

        <!-- Confirm adding additional params -->
        <div
          v-if="props.type === 'confirmParams'"
          class="flex mt-2"
        >
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1"
            @click="props.actionConfirmNewParams(true)"
          >
            <span class="text-sm text-gray-600">Да</span>
          </div>
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer"
            @click="props.actionConfirmNewParams(false)"
          >
            <span class="text-sm text-gray-600">Нет</span>
          </div>
        </div>

        <!-- Confirm delegate the task -->
        <div
          v-if="props.type === 'confirmDelegate'"
          class="flex mt-2"
        >
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer mr-1"
            @click="props.actionConfirmDelegate(true)"
          >
            <span class="text-sm text-gray-600">Да</span>
          </div>
          <div
            class="flex items-center bg-white rounded-lg p-1 px-2 mt-1 cursor-pointer"
            @click="props.actionConfirmDelegate(false)"
          >
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
