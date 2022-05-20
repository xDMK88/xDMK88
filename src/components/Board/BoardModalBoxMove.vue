<template>
  <Overlay
    z-index="z-40"
    @overlay-click="onCancel"
  >
    <div class="rounded-xl shadow-lg w-[400px] p-6 bg-white z-50">
      <div class="flex items-start">
        <div class="flex-1 text-[#4c4c4d] font-medium text-[14px] leading-4">
          Перемещение колонки
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
      <div
        class="flex items-stretch flex-col mt-4"
        @click="opened = !opened"
      >
        <div
          class="flex items-start w-full bg-[#f5f5f5] border border-[#e0e0e0] px-3.5 py-[11px] text-[14px] leading-4"
          :class="{ 'rounded-t-md': opened, 'rounded-md': !opened }"
        >
          <div class="flex-1">
            Позиция: <b>{{ selectedPosition + 1 }}</b>
          </div>
          <div
            class="flex-none"
          >
            <svg
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.21987 10.3014C4.93961 10.6574 4.40014 10.6574 4.11987 10.3014L1.23176 6.63301C0.870245 6.17383 1.19734 5.5 1.78176 5.5L7.55798 5.5C8.1424 5.5 8.4695 6.17383 8.10798 6.63301L5.21987 10.3014Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="opened"
          class="flex flex-col w-full -mt-px bg-[#f5f5f5] border rounded-b-md border-[#e0e0e0] px-3.5 py-3 text-[14px] leading-4"
        >
          <div
            v-for="pos in positions"
            :key="pos.position"
            class="my-1 cursor-pointer hover:text-[#ebaa40]"
            @click="selectPosition(pos.position)"
          >
            Позиция:
            <b v-if="pos.selected">
              {{ pos.position + 1 }}
            </b>
            <template v-else>
              {{ pos.position + 1 }}
            </template>
            {{ pos.current ? '(текущая)' : '' }}
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
          class="focus:ring focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-3 py-2.5 rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium"
          @click="onSave"
        >
          Переместить
        </button>
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from '@/components/modals/Overlay.vue'

export default {
  components: {
    Overlay
  },
  props: {
    position: {
      type: Number,
      default: 0
    },
    countAll: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changePosition', 'cancel'],
  data: () => ({
    selectedPosition: 0,
    opened: false
  }),
  computed: {
    positions () {
      const result = []
      for (let i = 0; i < this.countAll; i++) {
        result.push(
          {
            position: i,
            selected: i === this.selectedPosition,
            current: i === this.position
          }
        )
      }
      return result
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.opened = false
          this.selectedPosition = this.position
        }
      }
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      if (this.selectedPosition === this.position) return this.onCancel()
      this.$emit('changePosition', this.selectedPosition)
    },
    selectPosition (position) {
      this.selectedPosition = position
    }
  }
}
</script>

<style scoped></style>
