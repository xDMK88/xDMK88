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
  <div class="relative">
  <svg class="absolute top-4 z-10 left-[20px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25778 1.73848C6.52876 1.73848 4.87055 2.42533 3.64794 3.64794C2.42533 4.87055 1.73848 6.52876 1.73848 8.25778C1.73848 9.98681 2.42533 11.645 3.64794 12.8676C4.87055 14.0902 6.52876 14.7771 8.25778 14.7771C9.98681 14.7771 11.645 14.0902 12.8676 12.8676C14.0902 11.645 14.7771 9.98681 14.7771 8.25778C14.7771 6.52876 14.0902 4.87055 12.8676 3.64794C11.645 2.42533 9.98681 1.73848 8.25778 1.73848ZM2.41865 2.41865C3.96728 0.870014 6.06768 0 8.25778 0C10.4479 0 12.5483 0.870014 14.0969 2.41865C15.6456 3.96728 16.5156 6.06768 16.5156 8.25778C16.5156 10.1548 15.8628 11.9845 14.6818 13.4466L18 16.7707L16.7696 17.9989L13.4531 14.6765C11.9899 15.8609 10.1576 16.5156 8.25778 16.5156C6.06768 16.5156 3.96728 15.6456 2.41865 14.0969C0.870014 12.5483 0 10.4479 0 8.25778C0 6.06768 0.870014 3.96728 2.41865 2.41865Z" fill="#7E7E80"/>
  </svg>
  <control
    ref="root"
    v-model="form.text"
    :placeholder="props.placeholder"
    borderless
    maxlength="100"
    @keyup.enter="sendSearchRequest"
  />
  </div>
</template>
