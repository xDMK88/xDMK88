<script setup>
import { ref, computed } from 'vue'
import { mdiMinus, mdiPlus } from '@mdi/js'
import Icon from '@/components/Icon.vue'
import AsideMenuList from '@/components/AsideMenuList.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSubmenuList: Boolean
})

const emit = defineEmits(['menu-click'])
const isDropdownActive = ref(false)
const componentIs = computed(() => props.item.to ? 'router-link' : 'a')
const hasDropdown = computed(() => !!props.item.menu)
const dropdownIcon = computed(() => isDropdownActive.value ? mdiMinus : mdiPlus)
const itemTo = computed(() => props.item.to || null)
const itemHref = computed(() => props.item.href || null)
const itemTarget = computed(() => componentIs.value === 'a' && props.item.target ? props.item.target : null)

const menuClick = event => {
  emit('menu-click', event, props.item)

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value
  }
}

const styleActive = 'font-bold text-dark'
const styleInactive = 'text-dark-500 font-light'

</script>

<template>
  <li>
    <component
      :is="componentIs"
      v-slot="vSlot"
      :to="itemTo"
      :href="itemHref"
      :target="itemTarget"
      class="flex items-center cursor-pointer px-3 hover:bg-gray-200 hover:bg-opacity-50 dark:hover:bg-gray-700 dark:hover:bg-opacity-50"
      :class="[isSubmenuList ? 'p-3 text-sm' : 'py-1']"
      @click="menuClick"
    >
      <div
        class="rounded-md flex items-center justify-center mx-1.5 w-10 h-10"
      >
        <icon
          :path="item.icon"
          class="flex-none text-gray-500 dark:text-white"
          :box="item.iconBox"
          :width="item.width"
          :height="item.height"
          :class="[vSlot && vSlot.isExactActive ? styleActive : styleInactive]"
        />
      </div>
      <span
        :class="[vSlot && vSlot.isExactActive ? styleActive : styleInactive, item.bold ? font-bold : font-normal]"
      >{{ item.label }}</span>
      <icon
        v-if="hasDropdown"
        :path="dropdownIcon"
        class="flex-none"
        :class="[vSlot && vSlot.isExactActive ? styleActive : styleInactive]"
      />
    </component>
    <aside-menu-list
      v-if="hasDropdown"
      :menu="item.menu"
      :class="{ 'hidden': !isDropdownActive, 'block bg-gray-700 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50': isDropdownActive }"
      is-submenu-list
    />
  </li>
</template>
