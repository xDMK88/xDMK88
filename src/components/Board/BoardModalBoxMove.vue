<template>
  <ModalBox
    title="Перемещение колонки"
    ok="Переместить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div
      class="grow flex flex-col"
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
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
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
