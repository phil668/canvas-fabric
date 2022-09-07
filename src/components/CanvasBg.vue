<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
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

let canvas: fabric.Canvas
const canvasEl = ref<HTMLCanvasElement>()
const bgImgSrc = new URL('../assets/Snipaste_2022-09-03_23-59-56.png', import.meta.url).href
const isMoving = ref<boolean>(false)
const container = ref<HTMLDivElement>()
const canvasContainer = ref<HTMLDivElement>()
const scale = ref<number>(1)
let animationId: number

const canvasSize = reactive<CanvasSize>({
    width: 800,
    height: 750
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
    position.left = container.value?.offsetWidth! / 2
    position.top = container.value?.offsetHeight! / 2
})

function init() {
    canvas = new fabric.Canvas(canvasEl.value!)
    fabric.Image.fromURL(bgImgSrc, (image) => {
        const ratio = Math.min(container.value?.offsetWidth! * 0.8 / image.width!, container.value?.offsetHeight! * 0.8 / image.height!)
        canvasSize.width = image.width! * ratio
        canvasSize.height = image.height! * ratio
        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
            width: image.width!,
            height: image.height!,
            scaleX: ratio,
            scaleY: ratio
        })
        canvas.renderAll()
    })

}

watch(canvasSize, (newVal) => {
    canvas.setWidth(newVal.width)
    canvas.setHeight(newVal.height)
})


const mouseDown = (e: MouseEvent) => {
    if (!e.metaKey) return
    canvas.selection = false
    isMoving.value = true
    canvas.setCursor('move')
    // 计算鼠标在元素中的坐标
    mousePosition.x = e.pageX - canvasContainer.value!.offsetLeft
    mousePosition.y = e.pageY - canvasContainer.value!.offsetTop
}

const mouseMove = (e: MouseEvent) => {
    if (!isMoving.value || !e.metaKey) return
    if (e.pageX === mousePosition.x && e.pageY - mousePosition.y) return
    position.left = e.pageX - mousePosition.x
    position.top = e.pageY - mousePosition.y
}

const mouseUp = () => {
    if (!isMoving.value) {
        return
    }
    canvas.setCursor('default')
    isMoving.value = false
    cancelAnimationFrame(animationId)
    canvas.selection = true
}

</script>

<template>
    <div class="flex">
        <div class="relative flex-1 h-100vh border-2 border-dashed border-black bg-gray-200 overflow-x-hidden overflow-y-scroll"
            ref="container">
            <div class="absolute "
                :style="{ left: `${position.left}px`, top: `${position.top}px`, transform: `translate(-50%,-50%) scale(${scale})` }"
                @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" ref="canvasContainer">
                <canvas ref="canvasEl" :width="canvasSize.width" :height="canvasSize.height"></canvas>
            </div>
        </div>
        <div class="w-200px">
            <div class="w-30px shadow p-16px mt-10px ml-10px">
                <div class="i-mdi-magnify-plus text-25px mb-10px cursor-pointer hover:text-blue" @click="scale += 0.1">
                </div>
                <div class="mb-10px">{{ (scale * 100).toFixed(0) }}%</div>
                <div class="i-mdi-magnify-minus  text-25px mb-10px cursor-pointer hover:text-blue"
                    @click="scale -= 0.1"></div>
                <div type="button" class="i-mdi-cursor-move text-25px mb-10px cursor-pointer hover:text-blue"
                    :class="[isMoving ? 'text-blue' : '']" @click="isMoving = !isMoving">
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
</style>