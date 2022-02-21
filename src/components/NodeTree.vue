<template>
  <li class="node-tree">
    <span class="label">{{ node.name }}</span>

    <ul v-if="node.has_children===true">
      <node v-for="(child, index) in node.children" :node="child" :key="index" @click="toggle"></node>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'node',
  props: {
    node: Object
  }
}
</script>
