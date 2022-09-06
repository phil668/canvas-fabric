<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { fabric } from 'fabric'

interface CanvasSize {
    width: number;
    height: number
}

interface Position {
    left: number;
    top: number
}

interface MousePosition {
    x: number;
    y: number
}

const canvasEl = ref<HTMLCanvasElement>()
const instance = ref<fabric.Canvas>()
const bgImgSrc = new URL('../assets/Snipaste_2022-09-03_21-37-43.png', import.meta.url).href
const bgimg = ref<fabric.Image>()
const canvasOriginWidth = ref<number>(1920)
const canvasOriginHeight = ref<number>(1080)
const canvasScale = ref<number>(1)
const isMoving = ref<boolean>(false)
const container = ref<HTMLDivElement>()
let animationId: number

const canvasSize = computed<CanvasSize>(() => {
    return {
        width: canvasOriginWidth.value * canvasScale.value,
        height: canvasOriginHeight.value * canvasScale.value
    }
})

const position = reactive<Position>({
    left: 0,
    top: 0
})

const mousePosition = reactive<MousePosition>({
    x: 0,
    y: 0
})

onMounted(() => {
    init()
})

function init() {
    instance.value = new fabric.Canvas(canvasEl.value!)

    fabric.Image.fromURL(bgImgSrc, (imgElement) => {
        bgimg.value = imgElement
        canvasOriginWidth.value = imgElement.width!
        canvasOriginHeight.value = imgElement.height!
        instance.value?.setBackgroundImage(bgimg.value!, instance.value.renderAll.bind(instance.value), {
            // scaleX: canvasSize.value.width / img.width,
            // scaleY: canvasSize.value.height / img.height
        })


        instance.value?.renderAll()
    })
}

watch(canvasSize, (newVal) => {
    console.log('newVal', newVal)
    instance.value?.setWidth(newVal.width)
    instance.value?.setHeight(newVal.height)
})

watch(canvasScale, () => {
    fabric.Image.fromURL(bgImgSrc, (imgElement) => {
        bgimg.value = imgElement
        instance.value?.setBackgroundImage(bgimg.value!, instance.value.renderAll.bind(instance.value), {
            scaleX: canvasScale.value,
            scaleY: canvasScale.value
        })
        instance.value?.renderAll()
    })
})

const mouseDown = (e: MouseEvent) => {
    if (!e.metaKey) return
    instance.value!.selection = false
    isMoving.value = true
    instance.value?.setCursor('move')
    // 计算鼠标在元素中的坐标
    mousePosition.x = e.pageX - container.value!.offsetLeft
    mousePosition.y = e.pageY - container.value!.offsetTop
}

const mouseMove = (e: MouseEvent) => {
    if (!isMoving.value) return
    instance.value?.setCursor('move')
    const step = () => {
        animationId = requestAnimationFrame(() => {
            position.left = e.pageX - mousePosition.x
            position.top = e.pageY - mousePosition.y
        })
    }
    step()
}

const mouseUp = () => {
    if (!isMoving.value) {
        return
    }
    instance.value?.setCursor('default')
    isMoving.value = false
    cancelAnimationFrame(animationId)
    instance.value!.selection = true
}

</script>

<template>

    <div class="flex">
        <div class="relative flex-1 h-80vh border-2 border-dashed border-black bg-gray-200">
            <div class="absolute -translate-x-1/2 -translate-y-1/2"
                :style="{ left: `${position.left}px`, top: `${position.top}px` }" @mousedown="mouseDown" ref="container"
                @mousemove="mouseMove" @mouseup="mouseUp">
                <canvas ref="canvasEl" :width="canvasSize.width" :height="canvasSize.height"></canvas>
            </div>
        </div>
        <div class="w-200px">
            <button class="mr-10" @click="canvasScale *= 1.25">+</button>
            <button @click="canvasScale /= 1.25">-</button>
        </div>
    </div>


</template>

<style scoped>
</style>