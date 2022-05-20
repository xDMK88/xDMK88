<script setup>
import { computed } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import Overlay from '@/components/modals/Overlay.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'white'
  },
  buttonLabel: {
    type: String,
    default: 'Done'
  },
  hasCancel: Boolean,
  hasClose: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  hasButton: Boolean
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm', 'close'])
const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = () => {
  value.value = false
}
const closeCancel = mode => {
  value.value = false
  emit(mode)
}
const cancel = () => confirmCancel('cancel')
const close = () => closeCancel('close')
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      has-table
      :title="title"
      class="shadow-xl border border-gray-300 w-50 max-h-modal md:w-4/5 lg:w-1/5 z-50 p-5 rounded-2xl"
      @header-icon-click="cancel"
      @header-icon3-click="close"
      @header-icon2-click="logout"
    >
      <div class="items-center justify-center">
        <span
          class="table cursor-pointer rounded-xl float-right text-right mb-3 ring-blue-700"
          aria-label="more options"
          @click="cancel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8486 2.84858C15.3172 2.37995 15.3172 1.62015 14.8486 1.15152C14.3799 0.682892 13.6202 0.682892 13.1515 1.15152L8.00005 6.30299L2.84858 1.15152C2.37995 0.682892 1.62015 0.682892 1.15152 1.15152C0.682891 1.62015 0.682891 2.37995 1.15152 2.84858L6.30299 8.00005L1.15152 13.1515C0.682891 13.6202 0.682891 14.3799 1.15152 14.8486C1.62015 15.3172 2.37995 15.3172 2.84858 14.8486L8.00005 9.69711L13.1515 14.8486C13.6202 15.3172 14.3799 15.3172 14.8486 14.8486C15.3172 14.3799 15.3172 13.6202 14.8486 13.1515L9.69711 8.00005L14.8486 2.84858Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
        </span>
        <slot />
      </div>
      <div
        class="items-stretch justify-between mt-5"
      />
    </card-component>
  </overlay>
</template>
