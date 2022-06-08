<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { SEARCH_TASK } from '@/store/actions/tasks'
import Control from '@/components/Control.vue'

const store = useStore()
const navStack = computed(() => store.state.navbar.navStack)

// paste search text into search input if lastVisited nav is search and it has param an text
const form = reactive({
  text: navStack.value[navStack.value.length - 1].value.param && navStack.value[navStack.value.length - 1].value.uid === '11212e94-cedf-11ec-9d64-0242ac120002' ? navStack.value[navStack.value.length - 1].value.param : ''
})
const sendSearchRequest = () => {
  if (form.text.length > 3) {
    store.dispatch(SEARCH_TASK, form.text).then(() => {
      const navElem = {
        name: 'Поиск',
        key: 'taskListSource',
        value: { uid: '11212e94-cedf-11ec-9d64-0242ac120002', param: form.text }
      }
      store.commit('updateStackWithInitValue', navElem)
      store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      store.commit('basic', { key: 'taskListSource', value: navElem.value })
    })
  }
}
const props = defineProps({
  placeholder: {
    type: String,
    required: true
  }
})
</script>

<template>
  <control
    ref="root"
    v-model="form.text"
    :placeholder="props.placeholder"
    borderless
    id="control-input"
    maxlength="100"
    transparent
    @keyup.enter="sendSearchRequest"
  />

</template>
