<template>
  <ModalBox
    title="Добавить сотрудника"
    ok="OK"
    @ok="onOk"
    @cancel="onCancel"
  >
    <div class="text-[#7e7e80] text-[13px] leading-[18px] font-roboto whitespace-pre-line">
      Превышен лимит сотрудников в организации. Чтобы добавить сотрудника нужно расширить вашу лицензию.
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  emits: ['cancel', 'ok'],
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onOk () {
      this.$emit('ok')
    }
  }
}
</script>

<style scoped>

</style>
