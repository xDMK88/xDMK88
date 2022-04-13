<script setup>
import Icon from '@/components/Icon.vue'
import unread from '@/icons/unread.js'
</script>

<template>
    <div class="flex bg-white rounded-xl w-3/5">
        <span class="font-bold m-2 text-lg">Непросмотренные сообщения</span>
        <icon
        :path="unread"
        :height="unread.height"
        :width="unread.width"
        :viewBox="unread.viewBox"
        />
    </div>
</template>
