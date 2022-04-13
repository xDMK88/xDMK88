<script setup>

import contenteditable from 'vue-contenteditable'
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  taskUid: {
    type: String,
    default: ''
  },
  checklist: {
    type: String,
    default: ''
  }
})

const store = useStore()

const user = computed(() => store.state.user.user)
const processedChecklist = ref('')

const computedChecklist = computed(() => {
  const _renderedChecklist = []

  if (!props.checklist) {
    _renderedChecklist.push({ checked: false, text: '' })
  }

  for (const check of props.checklist.split('\r\n\r\n')) {
    _renderedChecklist.push({ checked: !!+check.split('\r\n')[0], text: check.split('\r\n')[1] })
  }
  return _renderedChecklist
})

const renderedChecklist = reactive({ checklist: computedChecklist })

const processChecklist = () => {
  processedChecklist.value = ''
  for (const [i, check] of renderedChecklist.checklist.entries()) {
    if (!check.text) continue
    processedChecklist.value += (check.checked ? '1' : '0') + '\r\n' + check.text
    if (i !== renderedChecklist.checklist.length - 1) {
      processedChecklist.value += '\r\n\r\n'
    }
  }
  store.state.tasks.newtasks[props.taskUid].info.cheklist = processedChecklist.value
  store.dispatch('CHANGE_TASK_CHECKLIST', { uid_task: props.taskUid, checklist: processedChecklist.value })
}

const addEmptyChecklist = (index = -1) => {
  renderedChecklist.checklist.push({ checked: false, text: '' })
}

const saveChecklist = (index) => {
  console.log(index)
  console.log(renderedChecklist.checklist[index])
  if (renderedChecklist.checklist.length === 1) {
    return false
  }
  if (!renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')) {
    renderedChecklist.checklist.splice(index, 1)
    return
  }
  renderedChecklist.checklist[index].text = renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')
  processChecklist()
}

const updateChecklist = (index) => {
  console.log(renderedChecklist.checklist[index])
  if (!renderedChecklist.checklist[renderedChecklist.checklist.length - 1].text) {
    return false
  }
  if (!renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')) {
    if (renderedChecklist.checklist.length === 1) {
      return false
    }
    renderedChecklist.checklist.splice(index, 1)
  } else {
    renderedChecklist.checklist[index].text = renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')
    processChecklist()
    addEmptyChecklist(index)
  }
}
</script>

<template>
  <div>
    <div
      v-for="check, index of renderedChecklist.checklist"
      :key="index"
    >
      <div
        class="flex items-start grow"
      >
        <input
          v-model="check.checked"
          type="checkbox"
          class="m-1"
          @change="saveChecklist(index)"
        >
        <contenteditable
          v-model="check.text"
          tag="div"
          :class="{ 'text-gray-500 line-through': check.checked }"
          :contenteditable="store.state.tasks.newtasks[props.taskUid].info.uid_customer === user.current_user_uid"
          :id="'check_' + index"
          :noNL="true"
          :noHTML="true"
          @keyup.enter="updateChecklist(index)"
          @blur="saveChecklist(index)"
        />
      </div>
    </div>
    <button
      class="mt-2 text-sm border border-gray-500 p-1 px-2 rounded-lg"
      @click="addEmptyChecklist(false)"
    >
      Добавить
    </button>
  </div>
</template>
