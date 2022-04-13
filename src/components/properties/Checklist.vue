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

  if (!_checklist) {
    _renderedChecklist.push({ checked: false, text: '' })
  }

  for (const check of _checklist.split('\r\n\r\n')) {
    _renderedChecklist.push({ checked: !!+check.split('\r\n')[0], text: check.split('\r\n')[1] })
  }
  return _renderedChecklist
})

const renderedChecklist = reactive(checklist.value)

const processChecklist = () => {
  proccessedChecklist.value = ''
  for (const [i, check] of renderedChecklist.entries()) {
    if (!check.text) continue
    proccessedChecklist.value += (check.checked ? '1' : '0') + '\r\n' + check.text
    if (i !== renderedChecklist.length - 1) {
      proccessedChecklist.value += '\r\n\r\n'
    }
  }
  store.state.tasks.newtasks[props.taskUid].info.cheklist = proccessedChecklist.value
  store.dispatch('CHANGE_TASK_CHECKLIST', { uid_task: props.taskUid, checklist: proccessedChecklist.value })
}

const addEmptyChecklist = (index = -1) => {
  if (index) {
    renderedChecklist.splice(index + 1, 0, { checked: false, text: '' })
  } else {
    renderedChecklist.push({ checked: false, text: '' })
  }
}

const saveChecklist = (index) => {
  console.log(index)
  console.log(renderedChecklist[index])
  if (renderedChecklist.length === 1) {
    return false
  }
  if (!renderedChecklist[index].text.replace(/\r?\n|\r/g, '')) {
    renderedChecklist.splice(index, 1)
    return
  }
  renderedChecklist[index].text = renderedChecklist[index].text.replace(/\r?\n|\r/g, '')
  processChecklist()
}

const updateChecklist = (index) => {
  console.log(renderedChecklist[index])
  if (!renderedChecklist[renderedChecklist.length - 1].text) {
    return false
  }
  if (!renderedChecklist[index].text.replace(/\r?\n|\r/g, '')) {
    if (renderedChecklist.length === 1) {
      return false
    }
    renderedChecklist.splice(index, 1)
  } else {
    renderedChecklist[index].text = renderedChecklist[index].text.replace(/\r?\n|\r/g, '')
    processChecklist()
    addEmptyChecklist(index)
  }
}
</script>

<template>
  <div>
    <div
      v-for="check, index of renderedChecklist"
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
    <!--
    <pre>{{ checklist }}</pre>
    <pre>{{ renderedChecklist }}</pre>
    -->
  </div>
</template>

<style scoped>

</style>
