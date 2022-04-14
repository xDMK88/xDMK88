<script setup>
import Icon from '@/components/Icon.vue'
import calendar from '@/icons/calendar.js'
</script>

<template>
    <div>
        <span class="font-bold m-2 text-lg">Сегодня</span>
        <icon
        :path="calendar"
        :height="calendar.height"
        :width="calendar.width"
        :viewBox="calendar.viewBox"
        />
        <slot></slot>
    </div>
</template>
