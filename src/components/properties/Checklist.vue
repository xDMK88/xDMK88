<script setup>
import contenteditable from 'vue-contenteditable'
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  taskUid: {
    type: String,
    default: ''
  }
})

const store = useStore()

const proccessedChecklist = ref('')
const user = computed(() => store.state.user.user)
const checklist = computed(() => {
  const _renderedChecklist = []
  const _checklist = store.state.tasks.newtasks[props.taskUid].info.checklist

  if (!_checklist) return false

  for (const check of _checklist.split('\n\n')) {
    _renderedChecklist.push({ checked: !!+check.split('\n')[0], text: check.split('\n')[1] })
  }
  return _renderedChecklist
})

const renderedChecklist = reactive(checklist.value)

const processChecklist = () => {
  proccessedChecklist.value = ''
  for (const check of renderedChecklist) {
    if (!check.text) continue
    proccessedChecklist.value += (check.checked ? '1' : '0') + '\n' + check.text + '\n\n'
  }
  store.dispatch('CHANGE_TASK_CHECKLIST', { uid_task: props.taskUid, checklist: proccessedChecklist.value })
}

const addEmptyChecklist = () => {
  renderedChecklist.push({ checked: false, text: '' })
}

const saveChecklist = (index) => {
  if (!renderedChecklist[index].text.replace(/\r?\n|\r/g, '')) {
    renderedChecklist.splice(index, 1)
    return
  }
  renderedChecklist[index].text = renderedChecklist[index].text.replace(/\r?\n|\r/g, '')
  processChecklist()
}

const updateChecklist = (index) => {
  if (!renderedChecklist[renderedChecklist.length - 1].text) {
    return false
  }
  if (!renderedChecklist[index].text.replace(/\r?\n|\r/g, '')) {
    renderedChecklist.splice(index, 1)
  } else {
    renderedChecklist[index].text = renderedChecklist[index].text.replace(/\r?\n|\r/g, '')
    processChecklist()
    addEmptyChecklist()
  }
}
</script>

<template>
  <div
    v-for="check, index of renderedChecklist"
    :key="index"
  >
    <div
      class="flex items-center"
    >
      <input
        v-model="check.checked"
        type="checkbox"
        class="m-1"
      >
      <contenteditable
        v-model="check.text"
        tag="div"
        class="p-0.5"
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
    @click="addEmptyChecklist"
  >
    Добавить
  </button>
  {{ proccessedChecklist }}
</template>

<style scoped>

</style>
