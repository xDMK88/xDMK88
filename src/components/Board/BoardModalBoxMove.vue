<template>
  <Overlay
    z-index="z-40"
    @overlay-click="onCancel"
  >
    <div class="rounded-xl shadow-lg w-[360px] p-6 bg-white z-50">
      <div class="flex items-center">
        <div class="flex-1 text-[#4c4c4d] font-medium text-[14px] leading-[16px] font-roboto">
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
          class="flex items-center w-full rounded-[6px] bg-[#f4f5f7] border border-black/12 px-[14px] py-[11px]"
        >
          <div class="flex-1 text-[#4c4c4d] text-[14px] leading-[16px] font-medium font-roboto">
            Позиция: {{ selectedPosition + 1 }}
          </div>
          <div
            class="flex-none"
          >
            <svg
              v-if="opened"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 8.43901C11.0027 8.19332 11.0001 7.7976 10.7544 7.55514L6.7011 3.55514C6.47139 3.32846 6.10687 3.31394 5.85986 3.52164L1.46875 7.21394C1.20456 7.43609 1.17047 7.83035 1.39262 8.09454C1.61477 8.35874 2.00903 8.39282 2.27322 8.17067L6.22845 4.84488L9.87642 8.44486C10.1221 8.68731 10.5178 8.68469 10.7603 8.43901Z"
                fill="#7e7e80"
              />
            </svg>
            <svg
              v-else
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
                fill="#7e7e80"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="opened"
          class="flex flex-col w-full gap-[9px] -mt-px bg-white border rounded-[6px] border-black/12 px-[16px] py-[14px]"
        >
          <div
            v-for="pos in positions"
            :key="pos.position"
            class="cursor-pointer text-[#4c4c4d] hover:text-[#ebaa40] text-[14px] leading-[16px]"
            @click="selectPosition(pos.position)"
          >
            Позиция: {{ pos.position + 1 }} {{ pos.current ? '(текущая)' : '' }}
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
          class="focus:ring focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
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
