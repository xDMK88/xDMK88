<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '@/store'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'

import { AUTH_REQUEST, AUTH_REGISTER } from '@/store/actions/auth'

const form = reactive({
  email: '',
  password: '',
  username: '',
  showError: false,
  errorMessage: ''
})

const showValues = reactive({
  showRegisterInputsValue: false,
  showLoginInputsValue: false
})

const router = useRouter()
const localization = computed(() => store.state.localization.localization)

const submit = () => {
  if (showValues.showLoginInputsValue) {
    login()
  } else if (showValues.showRegisterInputsValue) {
    register()
  }
}

const getOSName = () => {
  let detectOS = 'web'

  if (navigator.appVersion.indexOf('Mac') !== -1) {
    detectOS = 'mac'
  } else if (navigator.appVersion.indexOf('Win') !== -1) {
    detectOS = 'windows'
  } else if (navigator.appVersion.indexOf('Android') !== -1) {
    detectOS = 'android'
  } else if (navigator.appVersion.indexOf('iPhone') !== -1) {
    detectOS = 'ios'
  }

  return detectOS
}

const isMobile = () => {
  return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
}

const getSysType = () => {
  return isMobile() ? 'mobile' : 'desktop'
}

const login = () => {
  const uri = 'https://web.leadertask.com/api/v1/users/auth?login=' + form.email + '&password=' + form.password + '&system=' + getOSName() + '&type_device=' + getSysType()
  store.dispatch(AUTH_REQUEST, uri)
    .then(() => {
      router.push('/')
    })
    .catch(() => {
      form.showError = true
      form.errorMessage = localization.value.InvalidNameOrPassword
    })
}

const register = () => {
  if (!form.password || !form.username) { return }
  const data = {
    email: form.email,
    password: form.password,
    name: form.username,
    system: 'web',
    language: 'russian',
    type_device: 'mobile'
  }
  store.dispatch(AUTH_REGISTER, data)
    .then(() => {
      router.push('/')
    })
    .catch(() => {
      form.showError = true
      form.errorMessage = 'Unknown error'
    })
}

const hideLoginInputs = () => {
  showValues.showLoginInputsValue = false
}

const showLoginInputs = () => {
  showValues.showLoginInputsValue = true
  hideRegisterInputs()
}

const hideRegisterInputs = () => {
  showValues.showRegisterInputsValue = false
}

const showRegisterInputs = () => {
  showValues.showRegisterInputsValue = true
  hideLoginInputs()
}

const checkEmailExistense = () => {
  if (form.email) {
    const uri = 'https://web.leadertask.com/api/v1/users/exists?email=' + form.email
    axios.get(uri)
      .then(() => {
        showLoginInputs()
      })
      .catch(() => {
        showRegisterInputs()
      })
  }
}

</script>
<template>
  <full-screen-section
    v-slot="{ cardClass, cardRounded }"
    bg="login"
  >
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <field
        :label="localization.YourEmail"
      >
        <control
          v-model="form.email"
          :icon="mdiAccount"
          name="email"
          autocomplete="email"
          required
          @blur="checkEmailExistense"
          @keyup.enter="checkEmailExistense"
        />
      </field>

  <transition-group name="slide-fade">
    <div v-if="showValues.showLoginInputsValue">
      <field
        :label="localization.Password"
        >
        <control
          v-model="form.password"
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
        />
      </field>
      <p class="text-red-400" v-if="form.showError">{{ form.errorMessage }}</p>
      <divider />

      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          :label="localization.EnterSystem"
        />
      </jb-buttons>
    </div>
  </transition-group>

  <transition-group name="slide-fade">
    <div v-if="showValues.showRegisterInputsValue">
      <field
        :label="localization.Password"
      >
        <control
          v-model="form.password"
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
        />
      </field>

      <field
        label="Username"
      >
        <control
          v-model="form.username"
          type="text"
          name="username"
          autocomplete="username"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          :label="localization.EnterLeaderTask"
        />
      </jb-buttons>
    </div>
  </transition-group>

    </card-component>
  </full-screen-section>
</template>

<style>
.error-message {
  color: #8D021F;
  font-size: 14px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(75px);
  opacity: 0;
}
</style>
