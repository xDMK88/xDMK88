<script setup>
import { ref } from 'vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import CardModalBoxColor from '@/components/properties/CardModalBoxColor.vue'
const emit = defineEmits(['onChangeCardColor', 'onChangeCardCover'])
const props = defineProps({
  coverColor: String,
  coverLink: String,
  canEdit: Boolean
})
const showColorCard = ref(false)
const selectedCardColor = ref(props.coverColor)
const onChangeCardColor = (color) => {
  showColorCard.value = false
  selectedCardColor.value = color
  emit('onChangeCardColor', color)
}
</script>

<template>
  <CardModalBoxColor
    v-show="showColorCard"
    :color="selectedCardColor"
    @cancel="showColorCard = false"
    @changeColor="onChangeCardColor"
  />
  <div
    class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] min-h-[93px] max-h-[93px] flex items-center justify-center relative"
    :style="{ 'background-color': props.coverColor ? props.coverColor : '#F4F5F7' }"
  >
    <img
      :src="coverLink"
      class="max-h-[91px]"
    >
    <div
      v-if="props.canEdit"
      class="absolute bottom-[10px] right-[10px]"
    >
      <PopMenu>
        <div
          style="border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(255, 255, 255, 0.9);"
          class="px-[12px] py-[7px] font-[400] text-[12px] leading-[14px] text-[#4C4C4D] rounded-[6px] cursor-pointer"
        >
          Обложка
        </div>
        <template #menu>
          <PopMenuItem @click="showColorCard = true">
            Цвет
          </PopMenuItem>
          <PopMenuItem>
            <label for="cover-input">
              Файл
            </label>
            <input
              id="cover-input"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              style="display: none;"
              name="cover-input"
              @change="$emit('onChangeCardCover', $event)"
            >
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
  </div>
</template>
