<template>
  <div
    class="group flex items-center bg-white rounded-[8px] shadow hover:shadow-md px-[15px] relative h-[48px] cursor-pointer"
  >
    <TagIcon :color="tag.back_color" />
    <div
      class="min-w-[13px] min-h-[13px] absolute rounded-[3px] bg-[#4c4c4d] -top-0.5 -left-0.5 flex items-center justify-center"
    >
      <span
        class="text-white font-['Roboto'] text-[10px] leading-[12px] font-medium px-0.5"
      >
        {{ 15 }}
      </span>
    </div>
    <div class="w-full flex justify-between">
      <div
        class="flex items-center relative"
      >
        <p
          class="flex-initial ml-[10px] font-['Roboto'] text-[13px] leading-[15px] font-medium truncate w-full"
        >
          {{ tag.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TagIcon from '@/components/Tags/Icons/TagIcon.vue'

export default {
  components: {
    TagIcon
  },
  props: {
    tag: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
