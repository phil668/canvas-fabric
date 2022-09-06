<script setup lang="ts">
import { onMounted, ref, watch, reactive } from 'vue';
import { fabric } from 'fabric'
import { computed } from '@vue/reactivity';

interface CanvasSize {
    width: number;
    height: number
}

interface Position {
    left: number;
    top: number
}

const canvasEl = ref<HTMLCanvasElement>()
const instance = ref<fabric.Canvas>()
const bgImgSrc = new URL('../assets/Snipaste_2022-09-03_23-59-56.png', import.meta.url).href
const bgimg = ref<fabric.Image>()
const canvasScale = ref<number>(1)
const canvasOriginWidth = ref<number>(800)
const canvasOriginHeight = ref<number>(600)
const position = reactive<Position>({
    left: 0,
    top: 0
})
const canvasSize = computed<CanvasSize>(() => {
    return {
        width: canvasOriginWidth.value * canvasScale.value,
        height: canvasOriginHeight.value * canvasScale.value
    }
})
// 

onMounted(() => {
    instance.value = new fabric.Canvas(canvasEl.value!)
    setCanvasBgImage(bgImgSrc)
    const img = new Image()
    img.src = bgImgSrc
    img.onload = function () {
        console.log('img.width', img.width)
        console.log('img.height', img.height)
    }
})

function setCanvasBgImage(url: string) {
    if (url && url.length > 0) {
        fabric.Image.fromURL(bgImgSrc, (imgElement) => {
            bgimg.value = imgElement
            scaleAndPositionImage()
        })
    } else {
        instance.value?.setBackgroundImage('', instance.value.renderAll.bind(instance.value))
        instance.value?.renderAll()
    }
}

function scaleAndPositionImage() {
    const canvasAspect = canvasSize.value.width / canvasSize.value.height;
    const imgAspect = bgimg.value?.width! / bgimg.value?.height!
    let scaleFactor
    if (canvasAspect >= imgAspect) {
        scaleFactor = canvasSize.value.width / bgimg.value?.width!
        position.left = 0;
        position.top = -((bgimg.value?.height! * scaleFactor) - canvasSize.value.height) / 2
    } else {
        scaleFactor = canvasSize.value.height / bgimg.value?.height!
        position.top = 0
        position.left = - ((bgimg.value?.width! * scaleFactor) - canvasSize.value.width) / 2
    }
    instance.value?.setBackgroundImage(bgimg.value!, instance.value.renderAll.bind(instance.value), {
        top: position.top,
        left: position.left,
        scaleX: scaleFactor,
        scaleY: scaleFactor
    })
    instance.value?.renderAll()
}

watch(canvasSize, (newVal) => {
    instance.value?.setWidth(newVal.width)
    instance.value?.setHeight(newVal.height)
})


</script>
    
    <template>
    <button class="mr-10" @click="canvasScale *= 1.25">+</button>
    <button @click="canvasScale /= 1.25">-</button>
    <canvas ref="canvasEl" :width="canvasSize.width" :height="canvasSize.height"
        class="mt-4 border-dashed border-2 border-blueGray"></canvas>
</template>
    
    <style scoped>
    </style>