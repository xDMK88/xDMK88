<script setup>
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import projectIcon from '@/icons/project.js'
import sharedProject from '@/icons/shared_project.js'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import * as BOARD from '@/store/actions/boards.js'
import * as CARD from '@/store/actions/cards.js'

const store = useStore()
defineProps({
  boards: {
    type: Array,
    default: () => []
  }
})
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
  '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST // shared
}

const isGridView = computed(() => store.state.isGridView)

const updateGridView = (value) => {
  store.commit('basic', { key: 'isGridView', value: value })
  localStorage.setItem('isGridView', value)
}

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const user = computed(() => store.state.user.user)
const focusedBoard = ref('')

const openProperties = (board, parentBoardUid = '') => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  focusedBoard.value = board.uid
  store.commit('basic', { key: 'propertiesState', value: 'board' })

  // create empty instanse of project
  if (!board || parentBoardUid) {
    board = {
      uid_parent: parentBoardUid,
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
      uid: '',
      name: '',
      bold: 0
    }
  }
  store.commit(BOARD.SELECT_BOARD, board)
}

const gotoChildren = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    store.commit('basic', { key: 'cardSource', value: { uid: value.global_property_uid, param: value.uid } })
  }
  // store.commit(CARD.CLEAN_UP_LOADED_CARDS)

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
    v-for="(value, index) in boards"
    :key="index"
  >
    <div
      class="flex items-center w-full"
      :class="{ 'justify-between': index == 0, 'mt-3': index == 1 } "
    >
      <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100">
        {{ value.dep }}
      </p>
      <div
        v-if="index == 0"
        class="flex"
      >
        <icon
          :path="listView.path"
          :width="listView.width"
          :height="listView.height"
          :box="listView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
          :class="{ 'text-gray-800': !isGridView, 'text-gray-400': isGridView }"
          @click="updateGridView(false)"
        />
        <icon
          :path="gridView.path"
          :width="gridView.width"
          :height="gridView.height"
          :box="gridView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
          :class="{ 'text-gray-800': isGridView, 'text-gray-400': !isGridView }"
          @click="updateGridView(true)"
        />
      </div>
    </div>
    <div
      class="grid gap-4 mt-3"
      :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
    >
      <template
        v-for="(board, pindex) in value.items"
        :key="pindex"
      >
        <div
          class="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md px-5 relative min-h-[80px] cursor-pointer"
          :class="{ 'ring-4 ring-orange-300': focusedBoard == board.uid }"
          @click.stop="gotoChildren(board)"
        >
          <icon
            :path="properties.path"
            :width="properties.width"
            :height="properties.height"
            :box="properties.viewBox"
            class="text-gray-400 cursor-pointer hover:text-gray-800 absolute top-8 right-4"
            @click.stop="openProperties(board)"
          />
          <div
            v-if="board.color != '#A998B6'"
            :style="{ backgroundColor: board.color }"
            class="w-full h-4 absolute top-0 right-0 rounded-t-xl"
          />
          <div class="relative">
            <div
              v-if="board.children && board.children.length"
              class="min-w-[15px] min-h-[15px] absolute rounded-full bg-gray-500 -top-2 -left-2 flex items-center justify-center"
            >
              <span
                class="text-white text-xs"
              >
                {{ board.children.length }}
              </span>
            </div>
            <div class="flex items-start">
              <icon
                v-if="board.members && Object.keys(board.members).length == 1"
                :path="projectIcon.path"
                :width="18"
                :height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <icon
                v-if="board.members && Object.keys(board.members).length > 1"
                :path="sharedProject.path"
                :width="18"
                :height="18"
                :box="sharedProject.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <p
                class="font-normal"
              >
                {{ board.name.length > 60 ? board.name.substring(0, 60) + '...' : board.name }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <div
        v-if="index == 0"
        class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 min-h-[80px]"
        @click.prevent="openProperties(false)"
      >
        <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-100">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
              stroke="#3E3D3B"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
