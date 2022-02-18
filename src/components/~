<script setup>

import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { SEARCH_TASK } from '@/store/actions/tasks'
import Control from '@/components/Control.vue'

const store = useStore()

const form = reactive({
  text: ''
})

const status = computed(() => store.state.tasks.status)
const sendSearchRequest = () => {
  store.dispatch(SEARCH_TASK, form.text)
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
    :value="status"
    ref="root"
    v-model="form.text"
    :placeholder="props.placeholder"
    @keyup.enter="sendSearchRequest"
    borderless
  />
</template>
