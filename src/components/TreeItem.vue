<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'TreeItem', // necessary for self-reference
  props: {
    model: Object
  },
  data () {
    const store = useStore()
    const selectedTask = computed(() => store.state.tasks.selectedTask)
    return {
      selectedTask: selectedTask,
      isOpen: false
    }
  },
  computed: {
    isFolder () {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    changeType () {
      if (!this.isFolder) {
        this.addChild()
        this.isOpen = true
      }
    },
    addChild () {
    }
  }
}
</script>

<template>
  <li class="item-element-class">
    <div
      :class="{ bold: isFolder }" class="list-project-access active" v-if="selectedTask.uid_project === model.uid"
      @click="toggle"
      @dblclick="changeType">
            <span v-if="isFolder" class="svg-control-tree"><span v-if="isOpen"><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.77011 6.87133C4.40803 7.4288 3.59197 7.42879 3.22989 6.87133L0.149702 2.12908C-0.247103 1.51816 0.191341 0.71057 0.919818 0.71057L7.08018 0.71057C7.80866 0.71057 8.2471 1.51816 7.8503 2.12908L4.77011 6.87133Z" fill="#222222"/></svg></span><span v-else><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.87133 3.22989C7.4288 3.59197 7.42879 4.40803 6.87133 4.77011L2.12908 7.8503C1.51816 8.2471 0.71057 7.80866 0.71057 7.08018V0.919817C0.71057 0.191341 1.51816 -0.247102 2.12908 0.149703L6.87133 3.22989Z" fill="black" fill-opacity="0.5"/>
</svg>
</span></span>
      <svg width="24" height="22" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="model.color!==11114678 && model.color!==-4056036 && model.color!==-2679009">
        <path d="M27.2999 6.3778V4.71425C27.2999 3.17114 26.0386 1.91406 24.4902 1.91406H12.9116L12.5642 1.34198C12.3527 1.01078 11.9826 0.800011 11.5898 0.800011H3.00969C1.46134 0.800011 0.199997 2.05708 0.199997 3.6002V24.722C0.199997 26.2652 1.46134 27.5222 3.00969 27.5222H26.9903C28.5386 27.5222 29.8 26.2652 29.8 24.722V9.16294C29.8075 7.71768 28.7048 6.52835 27.2999 6.3778ZM2.48098 3.6002C2.48098 3.30663 2.72268 3.06575 3.01724 3.06575H10.9554L14.037 8.07899C14.2409 8.4102 14.611 8.62097 15.0113 8.62097H27.0054C27.2999 8.62097 27.5416 8.86184 27.5416 9.15541V24.722C27.5416 25.0156 27.2999 25.2565 27.0054 25.2565H3.00969C2.71512 25.2565 2.47343 25.0156 2.47343 24.722V3.6002H2.48098ZM25.0189 6.35522H15.6382L14.3013 4.17981H24.4827C24.7773 4.17981 25.0189 4.42068 25.0189 4.71425V6.35522Z" :fill="model.color" fill-opacity="1"/>
      </svg>
      <svg width="24" height="22" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
        <path d="M27.2999 6.3778V4.71425C27.2999 3.17114 26.0386 1.91406 24.4902 1.91406H12.9116L12.5642 1.34198C12.3527 1.01078 11.9826 0.800011 11.5898 0.800011H3.00969C1.46134 0.800011 0.199997 2.05708 0.199997 3.6002V24.722C0.199997 26.2652 1.46134 27.5222 3.00969 27.5222H26.9903C28.5386 27.5222 29.8 26.2652 29.8 24.722V9.16294C29.8075 7.71768 28.7048 6.52835 27.2999 6.3778ZM2.48098 3.6002C2.48098 3.30663 2.72268 3.06575 3.01724 3.06575H10.9554L14.037 8.07899C14.2409 8.4102 14.611 8.62097 15.0113 8.62097H27.0054C27.2999 8.62097 27.5416 8.86184 27.5416 9.15541V24.722C27.5416 25.0156 27.2999 25.2565 27.0054 25.2565H3.00969C2.71512 25.2565 2.47343 25.0156 2.47343 24.722V3.6002H2.48098ZM25.0189 6.35522H15.6382L14.3013 4.17981H24.4827C24.7773 4.17981 25.0189 4.42068 25.0189 4.71425V6.35522Z" fill="#A998B6" fill-opacity="1"/>
      </svg>
      <label class="break-words">{{ model.name }}</label>    <input type="checkbox" name="check_projects" class="check-custom-project" checked>

    </div>
    <div
      :class="{ bold: isFolder }" class="list-project-access" v-else
      @click="toggle"
      @dblclick="changeType">
            <span v-if="isFolder" class="svg-control-tree"><span v-if="isOpen"><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.77011 6.87133C4.40803 7.4288 3.59197 7.42879 3.22989 6.87133L0.149702 2.12908C-0.247103 1.51816 0.191341 0.71057 0.919818 0.71057L7.08018 0.71057C7.80866 0.71057 8.2471 1.51816 7.8503 2.12908L4.77011 6.87133Z" fill="#222222"/></svg></span><span v-else><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.87133 3.22989C7.4288 3.59197 7.42879 4.40803 6.87133 4.77011L2.12908 7.8503C1.51816 8.2471 0.71057 7.80866 0.71057 7.08018V0.919817C0.71057 0.191341 1.51816 -0.247102 2.12908 0.149703L6.87133 3.22989Z" fill="black" fill-opacity="0.5"/>
</svg>
</span></span>
      <svg width="24" height="22" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="model.color!==11114678 && model.color!==-4056036 && model.color!==-2679009">
        <path d="M27.2999 6.3778V4.71425C27.2999 3.17114 26.0386 1.91406 24.4902 1.91406H12.9116L12.5642 1.34198C12.3527 1.01078 11.9826 0.800011 11.5898 0.800011H3.00969C1.46134 0.800011 0.199997 2.05708 0.199997 3.6002V24.722C0.199997 26.2652 1.46134 27.5222 3.00969 27.5222H26.9903C28.5386 27.5222 29.8 26.2652 29.8 24.722V9.16294C29.8075 7.71768 28.7048 6.52835 27.2999 6.3778ZM2.48098 3.6002C2.48098 3.30663 2.72268 3.06575 3.01724 3.06575H10.9554L14.037 8.07899C14.2409 8.4102 14.611 8.62097 15.0113 8.62097H27.0054C27.2999 8.62097 27.5416 8.86184 27.5416 9.15541V24.722C27.5416 25.0156 27.2999 25.2565 27.0054 25.2565H3.00969C2.71512 25.2565 2.47343 25.0156 2.47343 24.722V3.6002H2.48098ZM25.0189 6.35522H15.6382L14.3013 4.17981H24.4827C24.7773 4.17981 25.0189 4.42068 25.0189 4.71425V6.35522Z" :fill="model.color" fill-opacity="1"/>
      </svg>
      <svg width="24" height="22" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
        <path d="M27.2999 6.3778V4.71425C27.2999 3.17114 26.0386 1.91406 24.4902 1.91406H12.9116L12.5642 1.34198C12.3527 1.01078 11.9826 0.800011 11.5898 0.800011H3.00969C1.46134 0.800011 0.199997 2.05708 0.199997 3.6002V24.722C0.199997 26.2652 1.46134 27.5222 3.00969 27.5222H26.9903C28.5386 27.5222 29.8 26.2652 29.8 24.722V9.16294C29.8075 7.71768 28.7048 6.52835 27.2999 6.3778ZM2.48098 3.6002C2.48098 3.30663 2.72268 3.06575 3.01724 3.06575H10.9554L14.037 8.07899C14.2409 8.4102 14.611 8.62097 15.0113 8.62097H27.0054C27.2999 8.62097 27.5416 8.86184 27.5416 9.15541V24.722C27.5416 25.0156 27.2999 25.2565 27.0054 25.2565H3.00969C2.71512 25.2565 2.47343 25.0156 2.47343 24.722V3.6002H2.48098ZM25.0189 6.35522H15.6382L14.3013 4.17981H24.4827C24.7773 4.17981 25.0189 4.42068 25.0189 4.71425V6.35522Z" fill="#A998B6" fill-opacity="1"/>
      </svg>
      <label class="break-words">{{ model.name }}</label>    <input type="checkbox" name="check_projects" class="check-custom-project">

    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem
        class="item-child"
        v-for="model in model.children"
        :model="model" :key="model">
      </TreeItem>
    </ul>
  </li>
</template>
