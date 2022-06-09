<script>
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
export default {
  components: {
    PopMenu,
    PopMenuItem
  },
  setup () {

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
        icon="delete"
        @click="clickDeleteColumn(column, $event)"
      >
        Удалить
      </PopMenuItem>
    </template>
  </PopMenu>
</template>
