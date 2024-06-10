<template>
  <div class="subtitle-section">
    <div class="subtitle-title">字幕</div>
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
});
const list = computed(() => {
  return props.subtitles.map((subtitle) => {
    return {
      startTime: utils.formatTime(subtitle.startTime),
      endTime: utils.formatTime(subtitle.endTime),
      text: subtitle.text,
    };
  });
});
</script>

<style lang="scss" scoped>
.subtitle-section {
  .subtitle-title {
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
</style>
