<script>
export default {
  name: 'TreeItem', // necessary for self-reference
  props: {
    model: Object
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    isFolder () {
      return this.model.children
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
  <li v-for="(value,index) in model" :key="index">
    <div
      :class="{ bold: isFolder }"
      @click="toggle"
      @dblclick="changeType">
      {{ value.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem
        class="item"
        v-for="value in value.children"
        :model="value" :key="value">
      </TreeItem>
    </ul>
  </li>
</template>
