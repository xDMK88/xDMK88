<script setup>
import Icon from '@/components/Icon.vue'
import focus from '@/icons/focus.js'
</script>

<template>
    <div>
        <span class="font-bold m-2 text-lg">Задачи в фокусе</span>
        <icon
        :path="focus"
        :height="focus.height"
        :width="focus.width"
        :viewBox="focus.viewBox"
        />
        <slot></slot>
    </div>
</template>
