<template>
  <div class="video-input" :style="styles" @click="uploadVideo">
    <img src="/images/video.svg" width="128" />
    <span>点击这里或拖拽文件到这里导入视频</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  width: {
    type: Number,
    default: 1280,
  },
  height: {
    type: Number,
    default: 720,
  },
});
const emits = defineEmits(["change"]);

const styles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height + 60}px`,
}));

function uploadVideo() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "video/*";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      emits("change", fileURL);
    }
  };
  input.click();
}
</script>

<style lang="scss" scoped>
.video-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: var(--container-space);
  cursor: pointer;
  span {
    font-size: 20px;
  }
}
</style>
