import store from '@/store/index.js'
import { computed } from 'vue'

const selectedCard = computed(() => store.state.cards.selectedCard)

export function createMessage (obj) {
  if ('uid_task' in obj && selectedCard.value && obj.uid_task === selectedCard.value.uid) {
    store.commit('CARD_CREATE_MESSAGE_REQUEST', obj.obj)
  }
}
