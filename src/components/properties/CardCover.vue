<script setup>
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
const props = defineProps({
  coverColor: String,
  coverLink: String
})
</script>
<template>
  <div
    class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] min-h-[93px] max-h-[93px] flex items-center justify-center relative"
    :style="{ 'background-color': props.coverColor !== '#A998B6' ? props.coverColor : '#F4F5F7' }"
  >
    <img
      :src="coverLink"
      class="max-h-[91px]"
    >
    <div class="absolute bottom-[10px] right-[10px] ">
      <PopMenu>
        <div
          style="border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(255, 255, 255, 0.9);"
          class="px-[12px] py-[7px] font-[400] text-[12px] leading-[14px] text-[#4C4C4D] rounded-[6px] cursor-pointer"
        >
          Обложка
        </div>
        <template #menu>
          <PopMenuItem>
            Цвет
          </PopMenuItem>
          <PopMenuItem>
            Файл
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
  </div>
</template>
