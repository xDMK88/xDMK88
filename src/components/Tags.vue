<script setup>
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import subArrow from '@/icons/arrow-sub.js'
import * as TASK from '@/store/actions/tasks'

const store = useStore()

const goToChildren = (value) => {
  if (value.children && value.children.length) {
    store.commit('basic', { key: 'greedSource', value: value.children })
  }
}

const UID_TO_ACTION = {
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
}

const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit('updateLabel', value.name)
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
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 truncate">
    <template v-for="(tag, pindex) in tags" :key="pindex">
      <div
        class="flex items-start bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg cursor-pointer h-30 px-3 py-5"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <div
              class="flex items-center"
            >
              <div
                class="rounded-xl mr-2"
                style="width: 38px; height: 38px;"
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
                <div class="flex items-center" v-if="tag.children && tag.children.length">
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
  </div>
</template>
