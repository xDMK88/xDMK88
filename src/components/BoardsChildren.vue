<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Board from '@/components/Board.vue'
import * as CARD from '@/store/actions/cards'
import { SELECT_BOARD } from '@/store/actions/boards'

const store = useStore()
defineProps({
  boards: {
    type: Array,
    default: () => []
  }
})

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const focusedBoard = ref('')
const parentBoardUid = ref('')
const storeCards = computed(() => store.state.cards.cards)
// const newConfig = computed(() => store.state.tasks.newConfig)
const navStack = computed(() => store.state.navbar.navStack)
const user = computed(() => store.state.user.user)
const allBoards = computed(() => store.state.boards.boards)
const currentBoard = computed(() => {
  const currBoardUid = navStack.value[navStack.value.length - 1].uid
  const board = allBoards.value[currBoardUid]
  return board
})

onMounted(() => {
  parentBoardUid.value = navStack.value[navStack.value.length - 1].uid
})

const UID_TO_ACTION = {
  '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
  '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST // shared
}

const openProperties = (board, parentUid = '') => {
  if ('uid' in navStack.value[navStack.value.length - 1]) {
    parentBoardUid.value = navStack.value[navStack.value.length - 1].uid
  }

  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  focusedBoard.value = board.uid
  store.commit('basic', { key: 'propertiesState', value: 'board' })

  // create empty instanse of board
  if (!board) {
    board = {
      uid: '',
      uid_parent: parentBoardUid.value,
      color: '',
      comment: '',
      plugin: '',
      collapsed: 0,
      isclosed: 0,
      order: 0,
      group: 0,
      show: 0,
      favorite: 0,
      quiet: 0,
      email_creator: user.value.current_user_email,
      members: [user.value.current_user_email],
      children: [],
      name: '',
      bold: 0,
      type_access: 1
    }
  }
  store.commit(SELECT_BOARD, board)
}

const gotoChildren = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    store.commit('basic', { key: 'cardSource', value: { uid: value.global_property_uid, param: value.uid } })
  }
  // store.commit(TASK.CLEAN_UP_LOADED_TASKS)

  const navElem = {
    name: value.name,
    key: 'greedSource',
    uid: value.uid,
    global_property_uid: value.global_property_uid,
    greedPath: 'boards_children',
    value: value.children
  }

  store.commit('pushIntoNavStack', navElem)
  store.commit('basic', { key: 'greedSource', value: value.children })
  store.commit('basic', { key: 'greedPath', value: 'boards_children' })
}
</script>

<template class="w-full">
  <div
    class="grid gap-4 mt-3 md:grid-cols-2 lg:grid-cols-4"
    :class="{ 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <template
      v-for="(board, pindex) in boards"
      :key="pindex"
    >
      <div
        class="flex items-center bg-white rounded-[8px] shadow hover:shadow-md px-[15px] relative h-[48px] cursor-pointer"
        @click.stop="gotoChildren(board)"
      >
        <div
          v-if="board.color != '#A998B6'"
          :style="{ backgroundColor: board.color }"
          class="w-full h-[4px] absolute top-0 right-0 rounded-t-[8px]"
        />
        <div>
          <div class="flex items-center relative">
            <div
              v-if="board.children?.length"
              class="min-w-[13px] min-h-[13px] absolute rounded-[3px] bg-[#4c4c4d] -top-0.5 -left-0.5 flex items-center justify-center"
            >
              <span
                class="text-white font-['Roboto'] text-[10px] leading-[12px] font-medium px-0.5"
              >
                {{ board.children.length }}
              </span>
            </div>
            <svg
              v-if="board.members && Object.keys(board.members).length > 1"
              class="flex-none"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.2 18C2.53878 18 2 17.4623 2 16.8005V4.93771C2 4.27591 2.53878 3.7382 3.2 3.7382H6.08163V2.88613C6.08163 2.59659 6.3102 2.36496 6.59592 2.36496H8.18775L8.22857 2.25742C8.4898 1.50462 9.20816 1 10 1C10.7918 1 11.5102 1.50462 11.7714 2.25742L11.8122 2.36496H13.4041C13.6898 2.36496 13.9184 2.59659 13.9184 2.88613V3.7382H16.8C17.4612 3.7382 18 4.27591 18 4.93771V16.8005C18 17.4623 17.4612 18 16.8 18H3.2ZM3.03673 16.9659H16.9714V4.77226H13.9184V5.62433C13.9184 5.91387 13.6898 6.1455 13.4041 6.1455H6.59592C6.3102 6.1455 6.08163 5.91387 6.08163 5.62433V4.77226H3.03673V16.9659ZM7.11837 5.10316H12.8898V3.4073H11.3633C11.0776 3.4073 10.849 3.17567 10.849 2.88613C10.849 2.4146 10.4735 2.03406 10.0082 2.03406C9.54286 2.03406 9.15918 2.4146 9.15918 2.88613C9.15918 3.17567 8.93061 3.4073 8.6449 3.4073H7.11837V5.10316Z"
                fill="black"
                fill-opacity="0.5"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.50583 13.9311C7.45249 13.6478 7.33968 13.3901 7.18308 13.1718C7.00077 12.9178 6.9496 12.5587 6.99849 12.246C7.11226 11.5181 6.59683 10.7531 5.82573 10.7568C5.05816 10.7531 4.54066 11.518 4.65337 12.2458C4.70182 12.5587 4.65065 12.9176 4.46761 13.1711C4.30993 13.3895 4.1965 13.6475 4.14563 13.9311L4.07381 14.3144C4.00753 14.6681 4.26844 14.9969 4.6155 14.9969H7.03596C7.38303 14.9969 7.64394 14.6681 7.57765 14.3144L7.50583 13.9311ZM5.43067 12.0321C5.43067 11.7994 5.60867 11.6086 5.82573 11.6086C6.35103 11.6319 6.35103 12.4324 5.82573 12.4557C5.60867 12.4557 5.43067 12.2648 5.43067 12.0321ZM5.56207 14.1498C5.22075 14.1498 4.95271 13.7996 5.20165 13.5571C5.54667 13.221 6.10045 13.221 6.44547 13.5571C6.69441 13.7996 6.42637 14.1498 6.08505 14.1498H5.56207ZM11.7612 13.9311C11.7078 13.6478 11.595 13.3901 11.4384 13.1718C11.2561 12.9178 11.2049 12.5587 11.2538 12.246C11.3676 11.5181 10.8522 10.7531 10.0811 10.7568C9.31349 10.7531 8.79599 11.518 8.90871 12.2458C8.95715 12.5587 8.90598 12.9176 8.72295 13.1711C8.56527 13.3895 8.45183 13.6475 8.40097 13.9311L8.32915 14.3144C8.26286 14.6681 8.52377 14.9969 8.87084 14.9969H11.2913C11.6384 14.9969 11.8993 14.6681 11.833 14.3144L11.7612 13.9311ZM9.686 12.0321C9.686 11.7994 9.864 11.6086 10.0811 11.6086C10.6064 11.6319 10.6064 12.4324 10.0811 12.4557C9.864 12.4557 9.686 12.2648 9.686 12.0321ZM9.81741 14.1498C9.47608 14.1498 9.20805 13.7996 9.45698 13.5571C9.802 13.221 10.3558 13.221 10.7008 13.5571C10.9497 13.7996 10.6817 14.1498 10.3404 14.1498H9.81741ZM15.6937 13.1718C15.8504 13.3901 15.9632 13.6478 16.0165 13.9311L16.0883 14.3144C16.1546 14.6681 15.8937 14.9969 15.5466 14.9969H13.1262C12.7791 14.9969 12.5182 14.6681 12.5845 14.3144L12.6563 13.9311C12.7072 13.6475 12.8206 13.3895 12.9783 13.1711C13.1613 12.9176 13.2125 12.5587 13.164 12.2458C13.0513 11.518 13.5688 10.7531 14.3364 10.7568C15.1075 10.7531 15.6229 11.5181 15.5092 12.246C15.4603 12.5587 15.5114 12.9178 15.6937 13.1718ZM14.3364 11.6086C14.1193 11.6086 13.9413 11.7994 13.9413 12.0321C13.9413 12.2648 14.1193 12.4557 14.3364 12.4557C14.8617 12.4324 14.8617 11.6319 14.3364 11.6086ZM13.7123 13.5571C13.4634 13.7996 13.7314 14.1498 14.0727 14.1498H14.5957C14.937 14.1498 15.2051 13.7996 14.9561 13.5571C14.6111 13.221 14.0573 13.221 13.7123 13.5571Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <svg
              v-else
              class="flex-none"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.2 18C2.53878 18 2 17.4623 2 16.8005V4.93771C2 4.27591 2.53878 3.7382 3.2 3.7382H6.08163V2.88613C6.08163 2.59659 6.3102 2.36496 6.59592 2.36496H8.18775L8.22857 2.25742C8.4898 1.50462 9.20816 1 10 1C10.7918 1 11.5102 1.50462 11.7714 2.25742L11.8122 2.36496H13.4041C13.6898 2.36496 13.9184 2.59659 13.9184 2.88613V3.7382H16.8C17.4612 3.7382 18 4.27591 18 4.93771V16.8005C18 17.4623 17.4612 18 16.8 18H3.2ZM3.03673 16.9659H16.9714V4.77226H13.9184V5.62433C13.9184 5.91387 13.6898 6.1455 13.4041 6.1455H6.59592C6.3102 6.1455 6.08163 5.91387 6.08163 5.62433V4.77226H3.03673V16.9659ZM7.11837 5.10316H12.8898V3.4073H11.3633C11.0776 3.4073 10.849 3.17567 10.849 2.88613C10.849 2.4146 10.4735 2.03406 10.0082 2.03406C9.54286 2.03406 9.15918 2.4146 9.15918 2.88613C9.15918 3.17567 8.93061 3.4073 8.6449 3.4073H7.11837V5.10316ZM13.3061 14.2608C12.9633 14.2608 12.6939 13.9796 12.6939 13.6404V12.8545C12.6939 12.5071 12.9714 12.2341 13.3061 12.2341H15.0531C15.3959 12.2341 15.6653 12.5153 15.6653 12.8545V13.6404C15.6653 13.9878 15.3878 14.2608 15.0531 14.2608H13.3061ZM9.22449 14.2608C8.8898 14.2608 8.61225 13.9796 8.61225 13.6404V12.8545C8.61225 12.5071 8.8898 12.2341 9.22449 12.2341H10.9714C11.3143 12.2341 11.5837 12.5153 11.5837 12.8545V13.6404C11.5837 13.9878 11.3061 14.2608 10.9714 14.2608H9.22449ZM4.94694 14.2608C4.60408 14.2608 4.33469 13.9796 4.33469 13.6404V12.8545C4.33469 12.5071 4.61224 12.2341 4.94694 12.2341H6.69388C7.02857 12.2341 7.30612 12.5153 7.30612 12.8545V13.6404C7.30612 13.9878 7.02857 14.2608 6.69388 14.2608H4.94694ZM13.3061 10.3231C12.9633 10.3231 12.6939 10.0419 12.6939 9.70268V8.90852C12.6939 8.56934 12.9714 8.28808 13.3061 8.28808H15.0531C15.3959 8.28808 15.6653 8.56934 15.6653 8.90852V9.6944C15.6653 10.0336 15.3878 10.3148 15.0531 10.3148H13.3061V10.3231ZM9.22449 10.3231C8.8898 10.3231 8.61225 10.0419 8.61225 9.70268V8.90852C8.61225 8.56934 8.8898 8.28808 9.22449 8.28808H10.9714C11.3143 8.28808 11.5837 8.56934 11.5837 8.90852V9.6944C11.5837 10.0336 11.3061 10.3148 10.9714 10.3148H9.22449V10.3231ZM4.94694 10.3231C4.60408 10.3231 4.33469 10.0419 4.33469 9.70268V8.90852C4.33469 8.56934 4.61224 8.28808 4.94694 8.28808H6.69388C7.02857 8.28808 7.30612 8.56934 7.30612 8.90852V9.6944C7.30612 10.0336 7.02857 10.3148 6.69388 10.3148H4.94694V10.3231Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <p
              class="flex-initial ml-[10px] font-['Roboto'] text-[13px] leading-[15px] font-medium truncate w-[157px]"
            >
              {{ board.name }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="allBoards[parentBoardUid]?.email_creator === user.current_user_email"
      class="flex items-center justify-center rounded-[8px] border border-black/12 cursor-pointer h-[48px]"
      @click="openProperties(false)"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="dark:text-gray-100"
      >
        <rect
          x="0"
          y="0"
          width="30"
          height="30"
          rx="7"
          fill="#e8eaed"
        />
        <path
          d="M15.8302 10.4475L15.8999 10.4434C16.0457 10.4434 16.1864 10.4969 16.2953 10.5938C16.4043 10.6907 16.4739 10.8242 16.4909 10.969L16.4951 11.0386V15.2053H20.6618C20.8076 15.2053 20.9483 15.2588 21.0572 15.3557C21.1662 15.4526 21.2358 15.5861 21.2528 15.7309L21.257 15.8005C21.257 15.9463 21.2035 16.087 21.1066 16.196C21.0097 16.3049 20.8762 16.3745 20.7314 16.3916L20.6618 16.3957H16.4951V20.5624C16.4951 20.7082 16.4416 20.8489 16.3447 20.9579C16.2478 21.0668 16.1143 21.1364 15.9695 21.1535L15.8999 21.1576C15.7541 21.1576 15.6134 21.1041 15.5044 21.0072C15.3955 20.9103 15.3259 20.7768 15.3088 20.6321L15.3046 20.5624V16.3957H11.138C10.9922 16.3957 10.8515 16.3422 10.7425 16.2453C10.6336 16.1484 10.5639 16.0149 10.5469 15.8701L10.5427 15.8005C10.5427 15.6547 10.5963 15.514 10.6932 15.405C10.79 15.2961 10.9235 15.2265 11.0683 15.2094L11.138 15.2053H15.3046V11.0386C15.3046 10.8928 15.3582 10.7521 15.4551 10.6431C15.5519 10.5342 15.6854 10.4646 15.8302 10.4475L15.8999 10.4434L15.8302 10.4475Z"
          fill="#4c4c4d"
        />
      </svg>
    </div>
  </div>
  <div class="mt-5">
    <Board
      :store-cards="storeCards"
      :board="currentBoard"
    />
  </div>
</template>
