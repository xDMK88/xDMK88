<template>
  <Overlay
    z-index="z-40"
    @overlay-click="onCancel"
  >
    <div class="rounded-xl shadow-lg w-[400px] p-6 bg-white z-50">
      <div class="flex items-start">
        <div class="flex-1 text-[#4c4c4d] font-medium text-[14px] leading-4">
          Выбрать цвет
        </div>
        <!-- кнопка закрыть -->
        <div
          class="flex-none"
          @click="onCancel"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.1749 10.5L14.7583 6.92499C14.9152 6.76807 15.0034 6.55524 15.0034 6.33333C15.0034 6.11141 14.9152 5.89858 14.7583 5.74166C14.6014 5.58474 14.3885 5.49658 14.1666 5.49658C13.9447 5.49658 13.7319 5.58474 13.575 5.74166L9.99995 9.32499L6.42495 5.74166C6.26803 5.58474 6.0552 5.49658 5.83328 5.49658C5.61136 5.49658 5.39854 5.58474 5.24162 5.74166C5.0847 5.89858 4.99654 6.11141 4.99654 6.33333C4.99654 6.55524 5.0847 6.76807 5.24162 6.92499L8.82495 10.5L5.24162 14.075C5.16351 14.1525 5.10151 14.2446 5.05921 14.3462C5.0169 14.4477 4.99512 14.5566 4.99512 14.6667C4.99512 14.7767 5.0169 14.8856 5.05921 14.9871C5.10151 15.0887 5.16351 15.1809 5.24162 15.2583C5.31908 15.3364 5.41125 15.3984 5.5128 15.4407C5.61435 15.483 5.72327 15.5048 5.83328 15.5048C5.94329 15.5048 6.05221 15.483 6.15376 15.4407C6.25531 15.3984 6.34748 15.3364 6.42495 15.2583L9.99995 11.675L13.575 15.2583C13.6524 15.3364 13.7446 15.3984 13.8461 15.4407C13.9477 15.483 14.0566 15.5048 14.1666 15.5048C14.2766 15.5048 14.3855 15.483 14.4871 15.4407C14.5886 15.3984 14.6808 15.3364 14.7583 15.2583C14.8364 15.1809 14.8984 15.0887 14.9407 14.9871C14.983 14.8856 15.0048 14.7767 15.0048 14.6667C15.0048 14.5566 14.983 14.4477 14.9407 14.3462C14.8984 14.2446 14.8364 14.1525 14.7583 14.075L11.1749 10.5Z"
              fill="#7e7e80"
            />
          </svg>
        </div>
      </div>
      <div class="flex items-stretch mt-4">
        <div class="grow flex flex-col items-center">
          <div class="flex">
            <BoardColorBoxItem
              v-for="clr in colors[0]"
              :key="clr.color"
              :color="clr.color"
              :selected="clr.selected"
              @select="selectColor"
            />
          </div>
          <div class="flex">
            <BoardColorBoxItem
              v-for="clr in colors[1]"
              :key="clr.color"
              :color="clr.color"
              :selected="clr.selected"
              @select="selectColor"
            />
          </div>
        </div>
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from '@/components/modals/Overlay.vue'
import BoardColorBoxItem from '@/components/Board/BoardColorBoxItem.vue'

export default {
  components: {
    Overlay,
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
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
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
      if (!allColors.includes(this.color)) {
        allColors.splice(allColors.length - 1, 1, this.color)
      }
      const colors1 = allColors.map(color => ({ color: color, selected: color === this.color }))
      const colors2 = colors1.splice(8)
      return [colors1, colors2]
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
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
