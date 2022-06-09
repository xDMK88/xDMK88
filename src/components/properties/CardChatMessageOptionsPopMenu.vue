<script>
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
export default {
  components: {
    PopMenu,
    PopMenuItem
  },
  props: {
    canDelete: {
      type: Boolean,
      default: true
    }
  }
}

</script>
<template>
  <PopMenu
    @openMenu="lockVisibility(column.UID)"
    @closeMenu="unlockVisibility(column.UID)"
  >
    <slot />
    <template #menu>
      <PopMenuItem
        icon="answer"
        @click="clickRenameColumn(column, $event)"
      >
        Ответить
      </PopMenuItem>
      <PopMenuItem
        icon="copy"
        @click="clickColorColumn(column, $event)"
      >
        Копировать
      </PopMenuItem>
      <PopMenuItem
        v-if="canDelete"
        icon="delete"
        @click="clickDeleteColumn(column, $event)"
      >
        Удалить
      </PopMenuItem>
    </template>
  </PopMenu>
</template>
