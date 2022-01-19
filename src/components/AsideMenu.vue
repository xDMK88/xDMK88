<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ModalBox from '@/components/ModalBox.vue'
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import { DatePicker } from 'v-calendar'
import { mdiMenu } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import AsideNavigatorList from '@/components/AsideNavigatorList.vue'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import * as TASK from '@/store/actions/tasks'
import { USER_REQUEST } from '@/store/actions/user'
import { AUTH_LOGOUT } from '@/store/actions/auth'

const router = useRouter()

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

let modalOneActive = ref(false)

// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
}

const store = useStore()
const isFullScreen = computed(() => store.state.isFullScreen)
const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)
const isDark = computed(() => store.state.darkMode)

let attrs = computed(() => store.state.calendar.calendar)
const user = computed(() => store.state.user.user)

const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'

const currentDate = computed({
  get: () => new Date(),
  set: val => {
    store.dispatch(TASK.TASKS_REQUEST, val)
    store.commit('updateLabel', dateToLabelFormat(val))
    store.commit(TASK.CLEAN_UP_LOADED_TASKS)
  }
})

const navigatorMenu = reactive({
  tasks: false,
  foldableNavigator: false,
  lang: getNavigatorLanguage(),
  currentDate: currentDate
})

const configureNavigator = (navigator) => {
  navigator.tasks.items[0].selected = true

  const dataArray = []

  dataArray.push({ uid: navigator.tasks.uid, name: navigator.tasks.name, children: navigator.tasks.items, expanded: true })
  dataArray.push({ uid: navigator.delegate_iam.uid, name: navigator.delegate_iam.name, children: navigator.delegate_iam.items, expanded: true })
  dataArray.push({ uid: navigator.delegate_to_me.uid, name: navigator.delegate_to_me.name, children: navigator.delegate_to_me.items, expanded: true })
  dataArray.push({ uid: navigator.private_projects.uid, name: navigator.private_projects.name, children: navigator.private_projects.items, expanded: true })
  dataArray.push({ uid: navigator.common_projects.uid, name: navigator.common_projects.name, children: navigator.common_projects.items, expanded: true })
  dataArray.push({ uid: navigator.emps.uid, name: navigator.emps.name, children: navigator.emps.items, expanded: true })
  dataArray.push({ uid: navigator.colors.uid, name: navigator.colors.name, children: navigator.colors.items, expanded: true })
  dataArray.push({ uid: navigator.tags.uid, name: navigator.tags.name, children: navigator.tags.items, expanded: true })

  navigatorMenu.foldableNavigator = { dataSource: dataArray, id: 'uid', text: 'name', child: 'children' }
  store.dispatch('setDots', navigator.calendar.dates_with_tasks)
  attrs = computed(() => store.state.calendar.calendar)
}

const storeNavigator = computed(() => store.state.navigator.navigator)

const logout = () => {
  modalOneActive = false
  store.dispatch(AUTH_LOGOUT)
  router.push('/login')
}

function dateToLabelFormat (calendarDate) {
  const day = calendarDate.getDate()
  const month = calendarDate.toLocaleString('default', { month: 'short' })
  const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
  return day + ' ' + month + ', ' + weekday
}

const getNavigator = () => {
  if (store.state.auth.token) {
    store.dispatch(NAVIGATOR_REQUEST)
      .then(() => {
        const navigator = store.state.navigator.navigator
        console.log(navigator)
        configureNavigator(navigator)
      })
      .catch((err) => console.log(err))
  }
}

const getUser = () => {
  store.dispatch(USER_REQUEST)
    .then((resp) => {
    })
    .catch((err) => console.log(err))
}

onBeforeMount(() => {
  if (storeNavigator.value) {
    configureNavigator(storeNavigator)
  } else {
    getNavigator()
  }
  getUser()
})

const nodeSelected = (arg) => {
  if (UID_TO_ACTION[arg.nodeData.id]) {
    store.dispatch(UID_TO_ACTION[arg.nodeData.id])
  } else if (UID_TO_ACTION[arg.nodeData.parentID]) {
    const tree = document.getElementById('navigator-tree').ej2_instances[0]
    const treeNodeData = tree.getTreeData(arg.nodeData.id)[0]
    if (treeNodeData.email) {
      store.dispatch(UID_TO_ACTION[arg.nodeData.parentID], treeNodeData.email)
    } else {
      store.dispatch(UID_TO_ACTION[arg.nodeData.parentID], treeNodeData.uid)
    }
  }
  store.commit('updateLabel', arg.nodeData.text)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

const asideLgClose = () => {
  store.dispatch('asideLgToggle', false)
}

const menuClick = (event, item) => {
}
</script>

<template>
  <modal-box
    v-model="modalOneActive"
    title="Profile"
  >
    <img :src="user.foto_link" class="mx-auto rounded-full">
    <strong>Current user: </strong>
    <br>
    <span>{{ user.current_user_name }}</span>
    <br>
    <span>{{ user.current_user_email }}</span>
    <br>
    <br>
    <strong>License owner: </strong>
    <br>
    <span>{{ user.owner_title }}</span>
    <br>
    <span>{{ user.owner_email }}</span>
    <br>
    <br>
    <strong>License expires</strong>
    <br>
    <span>{{ user.date_expired }}</span>
    <br>
    <br>
    <strong>Days left</strong>
    <br>
    <span>{{ user.days_left }}</span>
    <br>
    <br>
    <strong>Used server storage </strong>
    <span> {{ user.total_mb }} Mb ({{ user.percent_mb }}%)</span>
    <br>
    <br>
    <jb-button
      label="Logout"
      color="danger"
      @click="modalOneActive = false; logout()"
    />
  </modal-box>
  <aside
    v-show="!isFullScreen"
    id="aside"
    class="w-80 fixed top-0 z-40 h-screen bg-white transition-position lg:left-0 dark:border-r dark:border-gray-800 dark:bg-gray-900"
    :class="[ isAsideMobileExpanded ? 'left-0' : '-left-80', isAsideLgActive ? 'block' : 'lg:hidden xl:block' ]"
  >
    <div class="flex flex-row w-full text-dark flex-1 h-14 items-center">
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        active-color="text-dark"
        active
        @click="asideLgClose"
      >
        <icon
          :path="mdiMenu"
          class="cursor-pointer"
          size="24"
        />
      </nav-bar-item>
      <div class="flex-1 px-3">
        <span @click="modalOneActive = true" class="cursor-pointer">{{ user.current_user_name }}</span>
      </div>
    </div>
    <nav-bar-item>
      <DatePicker
        show-weeknumbers
        :locale='navigatorMenu.lang'
        :attributes='attrs'
        v-model='navigatorMenu.currentDate'
        color='yellow'
        :is-dark='isDark'
        is-expanded
        />
    </nav-bar-item>
    <div>
      <aside-navigator-list
        :menu="navigatorMenu.tasks"
        @menu-click="menuClick"
      />
      <TreeViewComponent
      id="navigator-tree"
      :fields='navigatorMenu.foldableNavigator'
      cssClass="navigator-tree"
      @nodeSelected='nodeSelected'
      >
      </TreeViewComponent>
      <!-- <template v-for="(menuGroup, index) in menu">
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
      </template> -->
    </div>
  </aside>
</template>

<style>
  .navigator-tree .e-list-text {
    font-size: 16px!important;
  }
  .navigator-tree .e-ul, .navigator-tree .e-text-content{
    padding-left: 4px!important;
  }
  .navigator-tree .e-icon-collapsible, .navigator-tree .e-icon-expandable {
    float: right;
    margin-right: 20px
  }
  .navigator-tree .e-level-1 > .e-text-content .e-list-text {
    color: gray;
    padding-left: 0px;
  }
  .navigator-tree .e-level-2 > .e-text-content {
    padding-left: 0px;
  }
</style>
