<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { fabric } from 'fabric'
import Tool from './Tool.vue'
import Options from './Options.vue'

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

interface FreePoint {
    downPoint: MousePosition;
    upPoint: MousePosition
}



let canvas = ref<fabric.Canvas>()
const canvasEl = ref<HTMLCanvasElement>()
const bgImgSrc = new URL('../assets/WechatIMG1226.jpeg', import.meta.url).href
const isMoving = ref<boolean>(false);// 是否正在移动canvas
const isPainting = ref<boolean>(false); //是否开启自由绘画
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
const freePoint = reactive<FreePoint>({
    upPoint: {
        x: 0,
        y: 0
    },
    downPoint: {
        x: 0,
        y: 0
    }
})
const customList = ref<fabric.Group[]>([])



onMounted(() => {
    init()
    position.left = container.value?.offsetWidth! / 2
    position.top = container.value?.offsetHeight! / 2
})

function init() {
    canvas.value! = new fabric.Canvas(canvasEl.value!)
    fabric.Image.fromURL(bgImgSrc, (image) => {
        const ratio = Math.min(container.value?.offsetWidth! * 0.8 / image.width!, container.value?.offsetHeight! * 0.8 / image.height!)
        canvasSize.width = image.width! * ratio
        canvasSize.height = image.height! * ratio
        canvas.value!.setBackgroundImage(image, canvas.value!.renderAll.bind(canvas.value!), {
            width: image.width!,
            height: image.height!,
            scaleX: ratio,
            scaleY: ratio
        })
        canvas.value!.renderAll()
    })
    canvas.value!.on('mouse:down', canvasMouseDown)
    canvas.value!.on('mouse:up', canvasMouseUp)

}

/**
 * 开启自由绘画
 */
function canvasMouseDown(e: fabric.IEvent) {
    // 鼠标左键按下时，将当前坐标 赋值给 downPoint。{x: xxx, y: xxx} 的格式
    freePoint.downPoint = e.absolutePointer!
}

// 鼠标在画布上松开
function canvasMouseUp(e: fabric.IEvent) {
    // 绘制矩形的模式下，才执行下面的代码
    if (isPainting.value) {
        // 松开鼠标左键时，将当前坐标 赋值给 upPoint
        freePoint.upPoint = e.absolutePointer!
        // 调用 创建矩形 的方法
        createRect()
        isPainting.value = false
    }
}

function createRect() {
    // 如果点击和松开鼠标，都是在同一个坐标点，不会生成矩形
    if (JSON.stringify(freePoint.downPoint) === JSON.stringify(freePoint.upPoint)) {
        return
    }

    // 创建矩形
    // 矩形参数计算（前面总结的4条公式）
    let top = Math.min(freePoint.downPoint.y, freePoint.upPoint.y)
    let left = Math.min(freePoint.downPoint.x, freePoint.upPoint.x)
    let width = Math.abs(freePoint.downPoint.x - freePoint.upPoint.x)
    let height = Math.abs(freePoint.downPoint.y - freePoint.upPoint.y)

    // 矩形对象
    const rect = new fabric.Rect({
        top,
        left,
        width,
        height,
        fill: 'transparent', // 填充色：透明
        stroke: '#3e86ec' // 边框颜色：黑色
    })

    const circleMap = rect.getCoords().map(v => {
        return new fabric.Circle({
            radius: 5,
            borderColor: 'red',
            fill: 'transparent',
            stroke: 'red', // 边框颜色：黑色
            top: v.y - 5,
            left: v.x - 5
        })
    })

    const text = new fabric.Text('按钮', {
        left: rect.getCoords()[0].x,
        top: rect.getCoords()[0].y - 40
    })

    const group = new fabric.Group([rect, ...circleMap, text])
    // 将矩形添加到画布上
    canvas.value!.add(group)
    customList.value?.push(group)
    console.log('customList', customList.value)

    // 创建完矩形，清空 downPoint 和 upPoint。当然，你也可以不做这步。
    freePoint.downPoint = { x: 0, y: 0 }
    freePoint.upPoint = { x: 0, y: 0 }
}

function addText(value: string) {
    // console.log('value', value)
    console.log('customList.value', customList.value)
    console.log('canvas.value?.getActiveObject()', canvas.value?.getActiveObject())
}


watch(isPainting, (val) => {
    if (val) {
        canvas.value!.selectionColor = 'transparent' // 选框填充色：透明
        canvas.value!.selectionBorderColor = '#3e86ec' // 选框边框颜色：透明度很低的黑色（看上去是灰色）
        canvas.value!.skipTargetFind = true // 禁止选中
    } else {
        canvas.value!.selection = true // 允许框选
        canvas.value!.selectionColor = 'rgba(100, 100, 255, 0.3)' // 选框填充色：半透明的蓝色
        canvas.value!.selectionBorderColor = 'rgba(255, 255, 255, 0.3)' // 选框边框颜色：半透明灰色
        canvas.value!.skipTargetFind = false // 允许选中
    }
})


/**
 * 移动canvas
 * @param e 
 */
const mouseDown = (e: MouseEvent) => {
    if (!e.metaKey) return
    canvas.value!.selection = false
    isMoving.value = true
    canvas.value!.setCursor('move')
    // 计算鼠标在元素中的坐标
    mousePosition.x = e.pageX - canvasContainer.value!.offsetLeft
    mousePosition.y = e.pageY - canvasContainer.value!.offsetTop
}

/**
 * 移动canvas
 * @param e 
 */
const mouseMove = (e: MouseEvent) => {
    if (!isMoving.value || !e.metaKey) return
    if (e.pageX === mousePosition.x && e.pageY - mousePosition.y) return
    position.left = e.pageX - mousePosition.x
    position.top = e.pageY - mousePosition.y
}

/**
 * 移动canvas
 */
const mouseUp = () => {
    if (!isMoving.value) {
        return
    }
    canvas.setCursor('default')
    isMoving.value = false
    cancelAnimationFrame(animationId)
    canvas.selection = true
}


watch(canvasSize, (newVal) => {
    canvas.value!.setWidth(newVal.width)
    canvas.value!.setHeight(newVal.height)
})

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
            <Options :canvas="canvas!" @submit="addText"></Options>
        </div>
        <!-- 侧边工具箱 -->
        <Tool :scale="scale" @update:scale="scale = $event" :is-moving="isMoving" @update:is-moving="isMoving = $event"
            :isPainting="isPainting" @update:is-painting="isPainting = $event">
        </Tool>
    </div>
</template>

<style scoped>
</style>