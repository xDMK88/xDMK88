<template>
  <ModalBox
    title="Цвет карточки"
    :width="422"
    @cancel="onCancel"
  >
    <div class="grow gap-[4px] flex flex-col items-center">
      <div
        v-for="(clrs, index) in colors"
        :key="index"
        class="flex gap-[4px]"
      >
        <BoardColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :color="clr.color"
          :selected="clr.selected"
          @select="selectColor"
        />
      </div>
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'
import BoardColorBoxItem from '@/components/Board/BoardColorBoxItem.vue'

export default {
  components: {
    ModalBox,
    BoardColorBoxItem
  },
  props: {
    color: {
      type: String,
      default: ''
    }
  },
  emits: ['changeColor', 'cancel'],
  computed: {
    colors () {
      const allColors = [
        '',
        '#7fc870',
        '#69c494',
        '#dff2e1',
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
        '#e5e5e5',
        '#ddd1c2',
        '#ef7665',
        '#ffc6b5',
        '#ff8ed4',
        '#f5dbf5',
        '#6a7077',
        '#f6dd29',
        '#f5f547'
      ]
      // добавляем в конец выбранный цвет если его тут нет
      if (!allColors.includes(this.color.toLowerCase())) {
        allColors.splice(allColors.length - 1, 1, this.color)
      }
      const colors = allColors.map(color => ({ color: color, selected: color === this.color.toLowerCase() }))
      // разбираем на ряды по 9
      const rowLength = 9
      const arrColors = []
      while (colors.length) arrColors.push(colors.splice(0, rowLength))
      return arrColors
    }
  },
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    selectColor (color) {
      this.$emit('changeColor', color)
    }
  }
}
</script>

<style scoped></style>
