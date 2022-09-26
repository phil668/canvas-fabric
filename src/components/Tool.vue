<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    scale: number;
    isMoving: boolean;
    isPainting: boolean
}

interface Emits {
    (e: 'update:scale', value: number): void;
    (e: 'update:isMoving', value: boolean): void;
    (e: 'update:isPainting', value: boolean): void;
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

</script>

<template>
    <div class="w-30px shadow p-16px mt-10px ml-10px fixed left-20px top-1/2 -translate-y-1/2">
        <div class="i-mdi-magnify-plus btn" @click="emits('update:scale', scale + 0.1)">
        </div>
        <div class="mb-10px">{{ (scale * 100).toFixed(0) }}%</div>
        <div class="i-mdi-magnify-minus  btn" @click="emits('update:scale', scale - 0.1)">
        </div>
        <div class="i-mdi-cursor-move btn" :class="[isMoving ? 'text-blue' : '']"
            @click="emits('update:isMoving', !isMoving)">
        </div>
        <div class="i-mdi-plus-thick btn" :class="[isPainting ? 'text-blue' : '']"
            @click="emits('update:isPainting', !isPainting)"></div>
        <div class="i-mdi-minus-thick btn"></div>
    </div>
</template>

<style scoped>
</style>