<template>
  <div
    class="w-full flex items-center justify-between mt-3 order-1"
  >
    <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100 font-['Roboto']">
      Цвета
    </p>
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
        @click="updateGridView(false)"
      />
      <Icon
        :path="gridView.path"
        :width="gridView.width"
        :height="gridView.height"
        :box="gridView.viewBox"
        class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
        :class="{ 'text-gray-800': isGridView, 'text-gray-400': !isGridView }"
        @click="updateGridView(true)"
      />
    </div>
  </div>
  <div
    class="grid gap-2 mt-3 order-2"
    :class="{
      'md:grid-cols-2 lg:grid-cols-4': isGridView,
      'grid-cols-1': !isGridView,
      'grid-cols-1': isPropertiesMobileExpanded && !isGridView,
      'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
    }"
  >
    <ColorAdd @click="openProperties(false)" />
    <template
      v-for="(color, pindex) in colors"
      :key="pindex"
    >
      <ColorBlock
        :color="color"
        @click="openProperties(color), clickOnGridCard(color)"
      />
    </template>
  </div>
</template>
<script>
import Icon from '@/components/Icon.vue'
import * as TASK from '@/store/actions/tasks'
import { setLocalStorageItem } from '@/store/helpers/functions'
// import { SELECT_COLOR } from '@/store/actions/colors'
// import properties from '@/icons/properties.js'
import ColorBlock from '@/components/Colors/ColorBlock.vue'
import ColorAdd from '@/components/Colors/ColorAdd.vue'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

export default {
  components: {
    Icon,
    ColorBlock,
    ColorAdd
  },
  props: {
    colors: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      gridView,
      listView
    }
  },
  computed: {
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isGridView () {
      return this.$store.state.isGridView
    }
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    openProperties (color) {
      // if (!this.isPropertiesMobileExpanded.value) {
      //   this.$store.dispatch('asidePropertiesToggle', true)
      // }
      // this.$store.commit('basic', { key: 'propertiesState', value: 'color' })
      if (!color) {
        color = {
          back_color: '',
          fore_color: '',
          uppercase: 0,
          order: 0,
          default: 0,
          uid: '',
          name: '',
          bold: 0
        }
      }
      // this.$store.commit(SELECT_COLOR, color)
    },
    clickOnGridCard (value) {
      this.$store.dispatch(TASK.COLOR_TASKS_REQUEST, value.uid)
      const navElem = {
        name: value.name,
        key: 'taskListSource',
        value: { uid: value.parentID, param: value.uid },
        typeVal: value.uid,
        type: 'color'
      }
      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: value.parentID, param: value.uid } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    }
  }
}
</script>
