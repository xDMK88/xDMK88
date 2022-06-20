<template>
  <div class="group w-full h-[34px] flex items-center">
    <img
      v-if="photo"
      :src="photo"
      class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
    >
    <div class="grow font-roboto text-[13px] leading-[20px] font-medium text-[#4c4c4d] mr-[7px]">
      {{ name }}
    </div>
    <div class="flex-none">
      <div
        class="flex items-center text-[#7e7e80]"
        :class="{ 'cursor-pointer hover:text-[#4c4c4d]': !disabled }"
        @click="clickDelete"
      >
        <div
          v-if="status"
          class="mr-[4px] font-roboto text-[12px] leading-[20px]"
        >
          {{ status }}
        </div>
        <svg
          v-else
          class="invisible"
          :class="{ 'group-hover:visible': !disabled }"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1798 10.0034L14.7632 6.42841C14.9201 6.27149 15.0082 6.05866 15.0082 5.83674C15.0082 5.61483 14.9201 5.402 14.7632 5.24508C14.6062 5.08816 14.3934 5 14.1715 5C13.9496 5 13.7368 5.08816 13.5798 5.24508L10.0048 8.82841L6.42983 5.24508C6.27291 5.08816 6.06008 5 5.83817 5C5.61625 5 5.40342 5.08816 5.2465 5.24508C5.08958 5.402 5.00142 5.61483 5.00142 5.83674C5.00142 6.05866 5.08958 6.27149 5.2465 6.42841L8.82983 10.0034L5.2465 13.5784C5.16839 13.6559 5.1064 13.748 5.06409 13.8496C5.02178 13.9511 5 14.0601 5 14.1701C5 14.2801 5.02178 14.389 5.06409 14.4906C5.1064 14.5921 5.16839 14.6843 5.2465 14.7617C5.32397 14.8399 5.41614 14.9018 5.51768 14.9442C5.61923 14.9865 5.72816 15.0082 5.83817 15.0082C5.94818 15.0082 6.0571 14.9865 6.15865 14.9442C6.2602 14.9018 6.35236 14.8399 6.42983 14.7617L10.0048 11.1784L13.5798 14.7617C13.6573 14.8399 13.7495 14.9018 13.851 14.9442C13.9526 14.9865 14.0615 15.0082 14.1715 15.0082C14.2815 15.0082 14.3904 14.9865 14.492 14.9442C14.5935 14.9018 14.6857 14.8399 14.7632 14.7617C14.8413 14.6843 14.9033 14.5921 14.9456 14.4906C14.9879 14.389 15.0097 14.2801 15.0097 14.1701C15.0097 14.0601 14.9879 13.9511 14.9456 13.8496C14.9033 13.748 14.8413 13.6559 14.7632 13.5784L11.1798 10.0034Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userEmail: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete'],
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    photo () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.fotolink || ''
    },
    name () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.name || this.userEmail
    }
  },
  methods: {
    clickDelete () {
      if (!this.disabled) this.$emit('delete')
    }
  }
}
</script>

<style scoped>
</style>
