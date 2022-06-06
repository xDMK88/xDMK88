<template>
  <ModalBox
    title="Добавить сотрудника"
    ok="Добавить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div class="grow gap-[15px] flex flex-col">
      <p class="w-full text-[13px] leading-[18px] text-[#4c4c4d] font-roboto font-medium">
        Имя сотрудника:
      </p>
      <input
        ref="inputValueName"
        v-model="currentValueName"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-black/12 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        @keyup.enter="onNext"
        @keyup.esc="onCancel"
      >
      <p class="w-full text-[13px] leading-[18px] text-[#4c4c4d] font-roboto font-medium">
        Email:
      </p>
      <input
        ref="inputValueEmail"
        v-model="currentValueEmail"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-black/12 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        @keyup.enter="onSave"
        @keyup.esc="onCancel"
      >
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
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'save'],
  data: () => ({
    currentValueName: '',
    currentValueEmail: ''
  }),
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.currentValueName = ''
          this.currentValueEmail = ''
          this.$nextTick(function () {
            this.$refs.inputValueName.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    onCancel () {
      if (this.show) this.$emit('cancel')
    },
    onSave () {
      if (this.show) this.$emit('save', this.currentValueName, this.currentValueEmail)
    },
    onNext () {
      if (this.show) {
        this.$nextTick(function () {
          this.$refs.inputValueEmail.focus({ preventScroll: false })
        })
      }
    }
  }
}
</script>

<style scoped></style>
