<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-show="showDeleteBoard"
      title="Удалить доску"
      text="Вы действительно хотите удалить доску?"
      @cancel="showDeleteBoard = false"
      @yes="onDeleteBoard"
    />
    <!-- <NavBarButtonIcon icon="filter" /> -->
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          icon="edit"
          @click="clickEditBoard"
        >
          Свойства доски
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          @click="clickDeleteBoard"
        >
          Удалить доску
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'

import { SELECT_BOARD, REMOVE_BOARD_REQUEST } from '@/store/actions/boards'
import { NAVIGATOR_REMOVE_BOARD } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    BoardModalBoxDelete
  },
  props: {
    boardUid: {
      type: String,
      default: ''
    }
  },
  emits: ['popNavBar'],
  data () {
    return {
      showDeleteBoard: false
    }
  },
  computed: {
    board () {
      return this.$store.state.boards.boards[this.boardUid]
    },
    canDelete () {
      return this.board?.email_creator === this.$store.state.user.user.current_user_email
    }
  },
  methods: {
    clickEditBoard () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'board' })
      this.$store.commit(SELECT_BOARD, this.board)
    },
    clickDeleteBoard () {
      this.showDeleteBoard = true
    },
    onDeleteBoard () {
      this.showDeleteBoard = false
      //
      this.$store.dispatch(REMOVE_BOARD_REQUEST, this.boardUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(SELECT_BOARD, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_BOARD, this.board)
          //
          this.$emit('popNavBar')
        })
    }
  }
}
</script>

<style scoped>

</style>
