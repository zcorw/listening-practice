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
        v-for="(subtitle, i) in list"
        :key="subtitle.startTime"
        @click="jump(subtitle)"
      >
        <p>
          <span>{{ subtitle.startString }}</span>
          <span>{{ "----->>" }}</span>
          <span>{{ subtitle.endString }}</span>
        </p>
        <p>{{ subtitle.text }}</p>
        <div
          v-if="i !== 0"
          class="close"
          @click.stop="close(subtitle.startTime)"
        ></div>
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
  (e: "jump", time: number): void;
  (e: "remove", time: number): void;
}>();
const list = computed(() => {
  return props.subtitles.map((subtitle) => {
    return {
      startString: utils.formatTime(subtitle.startTime),
      endString: utils.formatTime(subtitle.endTime),
      ...subtitle,
    };
  });
});
function download() {
  emits("download");
}
function upload() {
  emits("upload");
}
function jump(subtitle: Subtitle) {
  emits("jump", subtitle.startTime);
}
function close(time: number) {
  emits("remove", time);
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
      position: relative;
      padding: 10px;
      border-bottom: 1px solid #dcdfe6;
      cursor: pointer;
      &:hover {
        background-color: rgb(217, 236, 255);
      }
      p {
        line-height: 1.5;
        display: flex;
        justify-content: space-between;
      }
      .close {
        position: absolute;
        display: none;
        top: 10px;
        left: -20px;
        width: 20px;
        height: 20px;
        background-image: url(/images/close.svg);
        background-size: 100%;
        background-repeat: no-repeat;
        cursor: pointer;
      }
      &:hover .close {
        display: block;
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
