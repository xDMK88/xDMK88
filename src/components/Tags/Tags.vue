<script>
import { computed, ref } from 'vue'
import TasksListNew from '@/components/TasksListNew.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import TagIcon from '@/components/Tags/Icons/TagIcon.vue'
import AddTag from '@/components/Tags/AddTag.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
// import properties from '@/icons/properties.js'
// import subArrow from '@/icons/arrow-sub.js'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    ListBlocItem,
    TagIcon,
    AddTag
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const focusedTag = ref('')
    return {
      gridView,
      listView,
      focusedTag
    }
  },
  computed: {
    isGridView () {
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    clickOnGridCard (value) {
      this.$store.dispatch()
    }
  }
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

// const openProperties = (tag, parentTagUid = '') => {
//   if (!isPropertiesMobileExpanded.value) {
//     store.dispatch('asidePropertiesToggle', true)
//   }

//   focusedTag.value = tag.uid

//   // add uid_parent if adding subtag in parent's children
//   if (props.tags[0].uid_parent && props.tags[0].uid_parent !== '00000000-0000-0000-0000-000000000000' && !parentTagUid) {
//     parentTagUid = props.tags[0].uid_parent
//   }
//   store.commit('basic', { key: 'propertiesState', value: 'tag' })
//   if (!tag) {
//     tag = {
//       uid_parent: parentTagUid,
//       back_color: '',
//       comment: '',
//       collapsed: 0,
//       order: 0,
//       group: 0,
//       show: 0,
//       children: [],
//       favorite: 0,
//       uid: '',
//       name: '',
//       bold: 0
//     }
//   }
//   store.commit(TASK.SELECT_TAG, tag)
// }

// const goToChildren = (value) => {
//   if (value.children && value.children.length) {
//     const navElem = {
//       name: value.name,
//       key: 'greedSource',
//       greedPath: 'tags_children',
//       uid: value.uid,
//       value: value.children
//     }
//     store.commit('pushIntoNavStack', navElem)
//     store.commit('basic', { key: 'greedSource', value: value.children })
//   }
// }
</script>

<template>
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
      <ListBlocItem
        :color="tag.back_color"
        :title="tag.name"
        @click="clickOnGridCard(tag)"
      >
        <TagIcon />
      </ListBlocItem>
    </template>
  </div>
  <div class="mt-5">
    <TasksListNew
      :store-tasks="storeTasks"
      :new-config="newConfig"
    />
  </div>
</template>
