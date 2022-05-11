<template>
  <div class="bg-white shadow rounded p-3">
    <div class="flex justify-between">
      <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
        {{ card.name }}
      </p>
    </div>
    <p
      v-if="card.comment"
      class="text-gray-700 font-sans tracking-wide text-xs mt-1"
    >
      {{ card.comment }}
    </p>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">{{ card.date_move }}</span>
      <span class="text-sm text-gray-600">{{ card.cost }}</span>
      <span class="text-sm text-gray-600">{{ card.uid_client }}</span>
      <span class="text-sm text-gray-600">{{ card.uid_contact }}</span>
    </div>
    <div
      v-if="card.user"
      class="flex mt-4 justify-between items-center"
    >
      <img
        v-if="employeesByEmail[card.user]"
        class="w-5 h-5 rounded-full"
        :src="employeesByEmail[card.user].fotolink"
        alt="Avatar"
      >
      <span class="text-sm text-gray-600">{{ getEmpNameByEmail(card.user) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    }
  }
}
</script>
