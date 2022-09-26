<script setup lang="ts">
import { ref } from "vue";
const selectValue = ref<string>("navBar");

interface Props {
    canvas: fabric.Canvas
}

interface Emits {
    (e: "submit", value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const onConfirm = () => {
    console.log('props.canvas', props.canvas.getObjects())
    emits('submit', selectValue.value)
}

</script>

<template>
    <div class="shadow p-5 fixed bg-white absolute ">
        <div class="flex justify-center">
            <div class="mb-3 xl:w-96">
                <select v-model="selectValue"
                    class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    aria-label="Default select example">
                    <option selected>Open this select menu</option>
                    <option value="navBar">导航栏</option>
                    <option value="button">按钮</option>
                    <option value="sider">侧边栏</option>
                </select>
            </div>
        </div>
        <div class="flex space-x-2 justify-center">
            <button type="button" class="btn-primary">取消</button>
            <button type="button" class="btn-primary" @click="onConfirm">确认</button>
        </div>
    </div>
</template>

<style scoped>
</style>
