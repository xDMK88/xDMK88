<template>
  <div
    class="flex"
  >
    <Icon
      :path="listView.path"
      :width="listView.width"
      :height="listView.height"
      :box="listView.viewBox"
      class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
      :class="{ 'text-gray-800': !isGridView, 'text-gray-400': isGridView }"
      @click="onClick(false)"
    />
    <Icon
      :path="gridView.path"
      :width="gridView.width"
      :height="gridView.height"
      :box="gridView.viewBox"
      class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
      :class="{ 'text-gray-800': isGridView, 'text-gray-400': !isGridView }"
      @click="onClick(true)"
    />
  </div>
</template>

<script>
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    isGridView: Boolean
  },
  emits: ['setGridView'],
  data: () => ({
    gridView: gridView,
    listView: listView
  }),
  methods: {
    onClick (value) {
      this.$emit('setGridView', value)
    }
  }
}
</script>

<style scooped>

</style>
