<script setup>
import { computed, onBeforeMount, reactive, ref, onActivated, onRenderTriggered, onRenderTracked } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ModalBox from '@/components/ModalBox.vue'
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations'
import { DatePicker } from 'v-calendar'
import { mdiMenu } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
// import AsideMenuList from '@/components/AsideMenuList.vue'
import AsideNavigatorList from '@/components/AsideNavigatorList.vue'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { TASKS_REQUEST } from '@/store/actions/tasks'
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
    console.log('changed value', val)
    store.dispatch(TASKS_REQUEST, val)
    store.commit('updateLabel', dateToLabelFormat(val))
  }
})

const navigatorMenu = reactive({
  tasks: false,
  foldableNavigator: false,
  lang: getNavigatorLanguage(),
  currentDate: currentDate
})

onRenderTracked(() => {
  console.log('on render tracked!')
})

onActivated(() => {
  console.log('activated!')
})

const configureNavigator = (navigator) => {
  navigator.tasks.items[0].selected = true
  const dataArray = []
  dataArray.push({ uid: '1', name: navigator.tasks.name, children: navigator.tasks.items, expanded: true })
  dataArray.push({ uid: '2', name: navigator.delegate_iam.name, children: navigator.delegate_iam.items, expanded: true })
  dataArray.push({ uid: '3', name: navigator.delegate_to_me.name, children: navigator.delegate_to_me.items, expanded: true })
  dataArray.push({ uid: '4', name: navigator.private_projects.name, children: navigator.private_projects.items, expanded: true })
  dataArray.push({ uid: '5', name: navigator.common_projects.name, children: navigator.common_projects.items, expanded: true })
  dataArray.push({ uid: '6', name: navigator.emps.name, children: navigator.emps.items, expanded: true })
  dataArray.push({ uid: '7', name: navigator.colors.name, children: navigator.colors.items, expanded: true })
  dataArray.push({ uid: '8', name: navigator.tags.name, children: navigator.tags.items, expanded: true })

  navigatorMenu.foldableNavigator = { dataSource: dataArray, id: 'uid', text: 'name', child: 'children' }
  store.dispatch('setDots', navigator.calendar.dates_with_tasks)
  attrs = computed(() => store.state.calendar.calendar)
  return { dataSource: dataArray, id: 'uid', text: 'name', child: 'children' }
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

onRenderTriggered(() => {
  console.log('render tracked')
})

function newDateSelected () {
  console.log('NEW DATE SELECTED')
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
      console.log(resp)
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

const asideLgClose = () => {
  store.dispatch('asideLgToggle', false)
}

const menuClick = (event, item) => {
  console.log(event)
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
        @input='newDateSelected'
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
      :fields='navigatorMenu.foldableNavigator'
      cssClass="navigator-tree"
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
