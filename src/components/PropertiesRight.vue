<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AsideMenuList from '@/components/AsideMenuList.vue'

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

const store = useStore()
const isFullScreen = computed(() => store.state.isFullScreen)
const isPropertiesMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)
const selectedTask = computed(() => store.state.tasks.selectedTask)
const taskMessages = computed(() => store.state.taskmessages.messages)
const taskFiles = computed(() => store.state.taskfiles.files)
const tags = computed(() => store.state.tasks.tags)
const employees = computed(() => store.state.employees.employees)
const projects = computed(() => store.state.projects.projects)
const localization = computed(() => store.state.localization.localization)
const colors = computed(() => store.state.colors.colors)

const statuses = [
  'status_not_begin',
  'status_ready',
  'task_by_link',
  'status_note',
  'status_in_work',
  'status_task_ready',
  'status_paused',
  'status_cancelled',
  'status_reject',
  'status_refine'
]

// const asideLgClose = () => {
//   store.dispatch('asideLgToggle', false)
// }

const menuClick = (event, item) => {
  //
}
</script>

// isPropertiesMobileExpanded ? 'right-0' : '-right-96',

<template>
  <aside
    v-if="selectedTask.name"
    v-show="!isFullScreen"
    id="aside"
    class="-right-96 w-96 fixed top-0 z-40 h-screen bg-white transition-position lg:right-0 dark:border-r dark:border-gray-800 dark:bg-gray-900"
    :class="[ isPropertiesMobileExpanded ? 'right-0' : '-right-90', isAsideLgActive ? 'block' : 'lg:hidden xl:block' ]"
  >
    <!-- <div class="flex flex-row w-full text-dark flex-1 h-14 items-center">
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        active-color="text-white"
        active
        @click="asideLgClose"
      >
        <icon
          :path="mdiMenu"
          class="cursor-pointer"
          size="24"
        />
      </nav-bar-item>
      <div class="flex-1 px-5">
      </div>
    </div> -->
    <div class="p-3 break-words">
      <p><strong>{{ selectedTask.name }}</strong></p>
      <p class="mt-3">{{ selectedTask.comment }}</p>
      <p class="mt-3"><strong>{{ localization.task_created }}:</strong> {{ selectedTask.date_create }}</p>
      <p><strong>Исполнитель:</strong> {{ selectedTask.email_performer }}</p>
      <p><strong>{{ localization.gc_status }}: </strong> {{ localization[statuses[selectedTask.status]] }}</p>
      <p v-if="selectedTask.uid_project !== '00000000-0000-0000-0000-000000000000'"><strong>{{ localization.props_prj }}: </strong> {{ projects[selectedTask.uid_project].name }}</p>
      <p v-if="selectedTask.uid_marker !== '00000000-0000-0000-0000-000000000000'"><strong>Цвет:</strong> <span :style="{'background-color': colors[selectedTask.uid_marker].back_color}" class="p-1">{{ colors[selectedTask.uid_marker].name }}</span></p>
      <p v-if="selectedTask.plan"><strong>План:</strong> {{ selectedTask.plan }}</p>
      <p v-if="selectedTask.email"><strong>Задача открыта для:</strong> {{ selectedTask.email }}</p>
      <p v-if="selectedTask.checklist"><strong>Чек-лист:</strong> {{ selectedTask.checklist }}</p>
      <p><strong>Задачу создал:</strong> {{ selectedTask.customer_name }}</p>

      <div class="mt-3" v-if="selectedTask.tags.length">
        <p class="text-center">{{ localization.Labels }}</p>
        <div class="mt-3" v-for="(key, value) in selectedTask.tags" :key=value>
           <p :style="{'background-color':tags[key].back_color}" class="rounded p-2">{{ tags[key].name }}</p>
        </div>
      </div>
      <div class="mt-3" v-if="taskFiles.length">
        <p class="text-center">Файлы</p>
        <div class="mt-3" v-for="(key, value) in taskFiles" :key=value>
           <p>{{ key.file_name }}</p>
        </div>
      </div>

      <div class="mt-3" v-if="taskMessages.length">
        <p class="text-center">Сообщения</p>
        <div class="mt-3" v-for="(key, value) in taskMessages" :key=value>
           <div class="flex">
             <img :src="employees[key.uid_creator].fotolink" class="mr-1 rounded border-solid border-2 border-sky-500" width="30" height="30">
             <div>
               <p>{{ employees[key.uid_creator].name }}</p>
             </div>
           </div>
           <p class="mt-1">{{ key.msg }}</p>
        </div>
      </div>
      <!-- <ul>
        <li v-for="(item, index) in selectedTask.checklist" :key="item">
          {{ index.name }}
        </li>
      </ul> -->
      <template v-for="(menuGroup, index) in menu">
        <p
          v-if="typeof menuGroup === 'string'"
          :key="`a-${index}`"
          class="p-3 text-xs uppercase text-gray-400"
        >
          {{ menuGroup }}
        </p>
        <aside-menu-list
          v-else
          :key="`b-${index}`"
          :menu="menuGroup"
          @menu-click="menuClick"
        />
      </template>
    </div>
  </aside>
</template>
