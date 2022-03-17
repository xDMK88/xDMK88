import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from 'notiwind'
import { darkModeKey } from '@/config.js'

import './css/main.css'

const token = localStorage.getItem('user-token')

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const chosenDate = new Date()
const month = pad2(chosenDate.getMonth() + 1)
const day = pad2(chosenDate.getDate())
const year = chosenDate.getFullYear()
const formattedDate = day + '-' + month + '-' + year
axios.defaults.headers.common.LocalDate = formattedDate

if (token) {
  axios.defaults.headers.common.Authorization = token
}

/* Fetch sample data */
store.dispatch('fetch', 'clients')
store.dispatch('fetch', 'history')

/* Dark mode */
const localStorageDarkModeValue = localStorage.getItem(darkModeKey)

if ((localStorageDarkModeValue === null && window.matchMedia('(prefers-color-scheme: dark)').matches) || localStorageDarkModeValue === '1') {
  store.dispatch('darkMode')
}

/* Default title tag */
const defaultDocumentTitle = 'Leadertask 2.0'

/* Collapse mobile aside menu on route change */
router.beforeEach(to => {
  store.dispatch('asideMobileToggle', false)
  store.dispatch('asideLgToggle', false)
})

router.afterEach(to => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})

createApp(App).use(store).use(router).use(Notifications).mount('#app')
