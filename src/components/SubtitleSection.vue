<template>
  <div class="subtitle-section">
    <div class="subtitle-title">
      字幕
      <div>
        <a class="download-btn" :class="{ disabled: disabled }" @click="upload">
          导入
        </a>
        <a
          class="download-btn"
          :class="{ disabled: disabled }"
          @click="download"
        >
          下载
        </a>
      </div>
    </div>
    <div class="subtitle-container">
      <div
        class="subtitle-item"
        v-for="subtitle in list"
        :key="subtitle.startTime"
      >
        <p>
          <span>{{ subtitle.startTime }}</span>
          <span>{{ "----->>" }}</span>
          <span>{{ subtitle.endTime }}</span>
        </p>
        <p>{{ subtitle.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import type { Subtitle } from "@/utils/subtitleHook";
import utils from "@/utils";
const props = defineProps({
  subtitles: {
    type: Array as PropType<Subtitle[]>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits<{
  (e: "download"): void;
  (e: "upload"): void;
}>();
const list = computed(() => {
  return props.subtitles.map((subtitle) => {
    return {
      startTime: utils.formatTime(subtitle.startTime),
      endTime: utils.formatTime(subtitle.endTime),
      text: subtitle.text,
    };
  });
});
function download() {
  emits("download");
}
function upload() {
  emits("upload");
}
</script>

<style lang="scss" scoped>
.subtitle-section {
  .subtitle-title {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .subtitle-container {
    .subtitle-item {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dcdfe6;
      p {
        line-height: 1.5;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.download-btn {
  color: #409eff;
  cursor: pointer;
  float: right;
  font-size: 14px;
  &.disabled {
    cursor: not-allowed;
    color: #c0c4cc;
  }
}
</style>
