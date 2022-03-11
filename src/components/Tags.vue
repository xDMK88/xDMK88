<script setup>
import Icon from '@/components/Icon.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import subArrow from '@/icons/arrow-sub.js'
import * as TASK from '@/store/actions/tasks'

const store = useStore()
const isGridView = ref(true)

const goToChildren = (value) => {
  store.commit('updateLabel', 'Метки')
  if (value.children && value.children.length) {
    store.commit('basic', { key: 'greedSource', value: value.children })
    store.commit('updateLabelprojectchildren', value.name)
  }
}

const UID_TO_ACTION = {
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
}

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)

const openProperties = (tag) => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  store.commit('basic', { key: 'propertiesState', value: 'tag' })
  store.commit(TASK.SELECT_TAG, tag)
}

const clickOnGridCard = (value) => {
  store.commit('updateLabel', 'Метки')
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    store.commit('basic', { key: 'taskListSource', value: { uid: value.global_property_uid, param: value.uid } })
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabelprojectchildren', value.name)
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

</script>

<template class="w-full">
  <div
    class="grid gap-4"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <template v-for="(tag, pindex) in tags" :key="pindex">
      <div
        class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md cursor-pointer h-30 px-3 py-5"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <div
              class="flex items-start"
            >
              <div
                class="rounded-xl mr-2 mt-0.5"
                style="min-width: 38px; min-height: 38px;"
                :style="{ backgroundColor: tag.back_color }"
              >
              </div>
              <div class="flex flex-col">
                <p
                  class="font-normal cursor-pointer"
                  @click="clickOnGridCard(tag)"
                >
                  {{ tag.name }}
                </p>
                <div class="flex items-center"
                  v-if="tag.children && tag.children.length">
                  <icon
                    :path="subArrow.path"
                    :box="subArrow.viewBox"
                    :width="subArrow.width"
                    :height="subArrow.height"
                    class="text-gray-500 cursor-pointer mr-1"
                    @click="goToChildren(tag)"
                  />
                  <p
                    class="font-light text-xs text-violet-500 cursor-pointer"
                    @click="goToChildren(tag)"
                  >
                    Подметок: {{ tag.children.length }}
                  </p>
                </div>
              </div>
            </div>
            <icon
              @click="openProperties(tag)"
              :path="properties.path"
              :width="properties.width"
              :height="properties.height"
              :box="properties.viewBox"
              class="text-gray-400 cursor-pointer hover:text-gray-800"
            />
          </div>
        </div>
      </div>
    </template>
    <div
      class="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 py-7"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dark:text-gray-100">
         <path d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857" stroke="#3E3D3B" stroke-width="3" stroke-linecap="round"/>
       </svg>
      </div>
    </div>
  </div>
</template>
