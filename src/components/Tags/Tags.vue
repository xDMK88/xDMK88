<script setup>
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import AddTag from '@/components/Tags/AddTag.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import subArrow from '@/icons/arrow-sub.js'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import * as TASK from '@/store/actions/tasks'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

const store = useStore()

const UID_TO_ACTION = {
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
}

const isGridView = computed(() => store.state.isGridView)

const updateGridView = (value) => {
  store.commit('basic', { key: 'isGridView', value: value })
  setLocalStorageItem('isGridView', value)
}

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const focusedTag = ref('')

const openProperties = (tag, parentTagUid = '') => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }

  focusedTag.value = tag.uid

  // add uid_parent if adding subtag in parent's children
  if (props.tags[0].uid_parent && props.tags[0].uid_parent !== '00000000-0000-0000-0000-000000000000' && !parentTagUid) {
    parentTagUid = props.tags[0].uid_parent
  }
  store.commit('basic', { key: 'propertiesState', value: 'tag' })
  if (!tag) {
    tag = {
      uid_parent: parentTagUid,
      back_color: '',
      comment: '',
      collapsed: 0,
      order: 0,
      group: 0,
      show: 0,
      children: [],
      favorite: 0,
      uid: '',
      name: '',
      bold: 0
    }
  }
  store.commit(TASK.SELECT_TAG, tag)
}

const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    const navElem = {
      name: value.name,
      key: 'taskListSource',
      value: { uid: value.global_property_uid, param: value.uid },
      typeVal: value.uid,
      type: 'tag'
    }
    store.commit('pushIntoNavStack', navElem)
    store.commit('basic', { key: 'taskListSource', value: { uid: value.global_property_uid, param: value.uid } })
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}

const goToChildren = (value) => {
  if (value.children && value.children.length) {
    const navElem = {
      name: value.name,
      key: 'greedSource',
      greedPath: 'tags_children',
      uid: value.uid,
      value: value.children
    }
    store.commit('pushIntoNavStack', navElem)
    store.commit('basic', { key: 'greedSource', value: value.children })
  }
}
</script>

<template class="w-full">
  <div
    class="w-full flex items-center justify-between mt-3 order-1"
  >
    <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100 font-['Roboto']">
      Метки
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
    class="grid gap-4 mt-3 order-2"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <AddTag @click="openProperties(false)" />
    <template
      v-for="(tag, pindex) in tags"
      :key="pindex"
    >
      <div
        class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md cursor-pointer h-30 px-3 py-5 order-4"
        :class="{ 'ring-4 ring-orange-300': focusedTag == tag.uid && isPropertiesMobileExpanded }"
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
              />
              <div class="flex flex-col">
                <p
                  class="font-normal cursor-pointer"
                  @click="clickOnGridCard(tag)"
                >
                  {{ tag.name }}
                </p>
                <div
                  v-if="tag.children && tag.children.length"
                  class="flex items-center"
                >
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
                <div
                  v-if="tag.children && !tag.children.length"
                  class="flex items-center"
                >
                  <icon
                    :path="subArrow.path"
                    :box="subArrow.viewBox"
                    :width="subArrow.width"
                    :height="subArrow.height"
                    class="text-gray-500 cursor-pointer mr-1"
                    @click="openProperties(false, parentTagUid = tag.uid)"
                  />
                  <p
                    class="font-light text-xs text-violet-500 cursor-pointer"
                    @click="openProperties(false, parentTagUid = tag.uid)"
                  >
                    Добавить подметку
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
              @click="openProperties(tag)"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
