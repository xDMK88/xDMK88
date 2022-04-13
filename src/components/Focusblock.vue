<script setup>
import Icon from '@/components/Icon.vue'
import focus from '@/icons/focus.js'
</script>

<template>
    <div class="flex bg-white rounded-xl w-3/5">
        <span class="font-bold m-2 text-lg">Задачи в фокусе</span>
        <icon
        :path="focus"
        :height="focus.height"
        :width="focus.width"
        :viewBox="focus.viewBox"
        />
    </div>
</template>
