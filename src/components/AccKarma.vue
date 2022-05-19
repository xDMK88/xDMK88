<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.state.user.user)
const karma = computed(() => store.state.inspector.karma)

onMounted(() => {
  store.dispatch('KARMA_REQUEST', user.value.current_user_uid)
})
</script>

<template>
  <div class="px-5">
    <pre>{{ karma }}</pre>
  </div>
</template>
