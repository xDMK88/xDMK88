<script setup>
import Icon from '@/components/Icon.vue'
import unread from '@/icons/unread.js'
</script>

<template>
    <div>
        <span class="font-bold m-2 text-lg">Непросмотренные сообщения</span>
        <icon
        :path="unread"
        :height="unread.height"
        :width="unread.width"
        :viewBox="unread.viewBox"
        />
        <slot></slot>
    </div>
</template>
