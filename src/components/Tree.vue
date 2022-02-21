<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree :node="treeData" @click="toggle"></node-tree>
    </ul>
  </div>
</template>

<script>
import NodeTree from '@/components/NodeTree.vue'

export default {
  props: {
    treeData: Object
  },
  components: {
    NodeTree
  }
}
</script>

<style>
.tree-list ul {
  margin: 6px 0;
  padding-left: 16px;
}
</style>
