<script setup>
import Icon from '@/components/Icon.vue'
import calendar from '@/icons/calendar.js'
</script>

<template>
    <div class="flex bg-white rounded-xl w-3/5">
        <span class="font-bold m-2 text-lg">Сегодня</span>
        <icon
        :path="calendar"
        :height="calendar.height"
        :width="calendar.width"
        :viewBox="calendar.viewBox"
        />
    </div>
</template>
