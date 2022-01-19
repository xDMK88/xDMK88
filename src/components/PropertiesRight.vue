<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { mdiMenu } from '@mdi/js'
import AsideMenuList from '@/components/AsideMenuList.vue'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

const store = useStore()
const isFullScreen = computed(() => store.state.isFullScreen)
// const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)
const selectedTask = computed(() => store.state.tasks.selectedTask)

const statuses = ['Не начиналась', 'Выполнена', 'Ссылка', 'Заметка', 'В работе', 'Готово к сдаче', 'На паузе', 'Отменено', 'Отклонено', 'На дороботку']

const asideLgClose = () => {
  store.dispatch('asideLgToggle', false)
}

const menuClick = (event, item) => {
  //
}
</script>

// isAsideMobileExpanded ? 'right-0' : '-right-96',

<template>
  <aside
    v-show="!isFullScreen"
    id="aside"
    class="-right-96 w-96 fixed top-0 z-40 h-screen bg-white transition-position lg:right-0 dark:border-r dark:border-gray-800 dark:bg-gray-900"
    :class="[isAsideLgActive ? 'block' : 'lg:hidden xl:block' ]"
  >
    <div class="flex flex-row w-full text-dark flex-1 h-14 items-center">
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
    </div>
    <div class="p-3">
      <p><strong>{{ selectedTask.name }}</strong></p>
      <p class="mt-3">{{ selectedTask.comment }}</p>
      <p class="mt-3">Дата создания: {{ selectedTask.date_create }}</p>
      <p>Исполнитель: {{ selectedTask.email_performer }}</p>
      <p>Статус: {{ statuses[selectedTask.status] }}</p>
      <p>План: {{ selectedTask.plan }}</p>
      <p>Задача открыта для: {{ selectedTask.email }}</p>
      <p>Чек-лист: {{ selectedTask.checklist }}</p>
      <p>Задачу создал: {{ selectedTask.customer_name }}</p>
      <!-- <ul>
        <li v-for="(item, index) in selectedTask.checklist" :key="item">
          {{ index }}
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
