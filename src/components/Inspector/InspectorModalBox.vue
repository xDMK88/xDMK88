<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
// import JbButton from '@/components/JbButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import OverlayConfirm from '@/components/modals/OverlayConfirm.vue'
import InspectorContent from '@/components/Inspector/InspectorContent.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'white'
  },
  buttonLabel: {
    type: String,
    default: 'Done'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  hasButton: Boolean
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

// const confirm = () => confirmCancel('confirm')
const store = useStore()
const user = computed(() => store.state.user.user)
const cancel = () => confirmCancel('cancel')

const delegatedTask = { }
const currentState = ref('task_name')
const inputMessage = ref('')
const messages = ref(
  [
    {
      message: 'Привет, что нужно сделать?',
      messageFromInspector: true,
      type: 'task_name',
      createDate: new Date().toISOString()
    }
  ]
)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const pad2 = (n) => {
  return (n < 10 ? '0' : '') + n
}

const getTodaysDate = (val, isYearFirst = true) => {
  if (val == null) {
    val = new Date()
  }
  if (typeof val === 'string') { // parse date from ISO 8601 string
    val = new Date(val)
  }
  const month = pad2(val.getMonth() + 1)
  const day = pad2(val.getDate())
  const year = pad2(val.getFullYear())
  if (isYearFirst) {
    return year + '-' + month + '-' + day
  } else {
    return day + '-' + month + '-' + year
  }
}

const createTask = () => {
  delegatedTask.uid = uuidv4()
  delegatedTask.uid_parent = '00000000-0000-0000-0000-000000000000'
  delegatedTask.uid_customer = user.value.current_user_uid
  delegatedTask.uid_project = '00000000-0000-0000-0000-000000000000'
  delegatedTask.status = 0
  delegatedTask.type = 1
  delegatedTask.comment = ''
  store.dispatch('CREATE_TASK', delegatedTask)
}

const addCustomerMessage = () => {
  if (!inputMessage.value) return
  if (currentState.value !== 'task_name') return
  messages.value.push({
    message: inputMessage.value,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'task_name') {
    delegatedTask.name = inputMessage.value
    messages.value.push({
      message: 'Отлично, теперь выберите исполнителя.',
      messageFromInspector: true,
      type: 'employeeSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'employeeSelection'
  }
  inputMessage.value = ''
}

const selectEmployee = (emp) => {
  if (currentState.value !== 'employeeSelection') return
  messages.value.push({
    message: emp.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'employeeSelection') {
    delegatedTask.email_performer = emp.email
    messages.value.push({
      message: 'Очень хорошо, когда выполнить?',
      messageFromInspector: true,
      type: 'timeSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'timeSelection'
  }
}

const selectTime = (time) => {
  if (currentState.value !== 'timeSelection') return
  messages.value.push({
    message: time.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  delegatedTask.date_begin = getTodaysDate(time.date) + 'T00:00:00'
  delegatedTask.date_end = getTodaysDate(time.date) + 'T23:59:59'
  if (currentState.value === 'timeSelection') {
    delegatedTask.customer_date = time.date
    messages.value.push({
      message: 'Нет проблем, проставим дополнительные параметры?',
      messageFromInspector: true,
      type: 'confirmParams',
      createDate: new Date().toISOString()
    })
    currentState.value = 'confirmParams'
  }
}

const actionConfirmNewParams = (confirmed) => {
  if (currentState.value !== 'confirmParams') return
  if (confirmed) {
    messages.value.push({
      message: 'Да',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    messages.value.push({
      message: 'Здесь мы уже будет проставлять всякие параметры, но программист меня еще не доработал',
      messageFromInspector: true,
      type: 'project',
      createDate: new Date().toISOString()
    })
  } else {
    messages.value.push({
      message: 'Нет',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    messages.value.push({
      message: 'Я поручу задачу?',
      messageFromInspector: true,
      type: 'confirmDelegate',
      createDate: new Date().toISOString()
    })
    currentState.value = 'confirmDelegate'
  }
}

const actionConfirmDelegate = (confirmed) => {
  if (currentState.value !== 'confirmDelegate') return
  if (confirmed) {
    messages.value.push({
      message: 'Да',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    createTask()
    messages.value.push({
      message: 'Я поручил вашу задачу, она будет выполнена неизбежно',
      messageFromInspector: true,
      type: 'end',
      createDate: new Date().toISOString()
    })
    currentState.value = 'end'
  } else {
    messages.value.push({
      message: 'Нет',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    messages.value.push({
      message: 'Я не знаю, что делать в таком случае, всего доброго!',
      messageFromInspector: true,
      type: 'end',
      createDate: new Date().toISOString()
    })
    currentState.value = 'end'
  }
}
</script>

<template>
  <overlay-confirm
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      has-table
      :title="title"
      class="shadow-xl border border-gray-300 md:w-2/5 lg:w-2/7 z-50 p-1 rounded-2xl"
      @header-icon-click="cancel"
      @header-icon2-click="logout"
    >
      <div class="items-center justify-center">
        <InspectorContent
          :messages="messages"
          :selectEmployee="selectEmployee"
          :selectTime="selectTime"
          :actionConfirmNewParams="actionConfirmNewParams"
          :actionConfirmDelegate="actionConfirmDelegate"
          class="max-h-[70vh] h-[70vh] overflow-scroll"
        />
        <slot />
      </div>

      <div
        class="flex items-stretch"
      >
        <input
          v-model="inputMessage"
          type="text"
          class="bg-gray-50 rounded-xl border border-gray-300 w-full p-2"
          placeholder="Your message"
          @keyup.enter="addCustomerMessage"
          autofocus
        />
      </div>
    </card-component>
  </overlay-confirm>
</template>
