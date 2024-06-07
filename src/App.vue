<template>
  <div class="container">
    <div ref="videoSide" class="video-side">
      <VideoPlayer
        v-if="!!showPlayer"
        ref="video"
        :width="videoStyle.width"
        :height="videoStyle.height"
        @loaded="videoLoaded"
      />
      <VideoInput
        v-else
        @change="uploadVideo"
        :width="videoStyle.width"
        :height="videoStyle.height"
      />
      <SubtitleInput />
    </div>
    <div class="subtitle-side"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import VideoInput from "./components/VideoInput.vue";
import VideoPlayer from "./components/VideoPlayer.vue";
import SubtitleInput from "./components/SubtitleInput.vue";
import subtitleStore, { Subtitle } from "./utils/subtitleStore";
import type { videoLoadedParams } from "./global.d";

let subtitleHeadNode: Subtitle | null = null;

const showPlayer = ref(false);
const video = ref();
const videoSide = ref<HTMLElement>();
const videoStyle = ref<{ width: number; height: number }>({
  width: 1280,
  height: 720,
});
function uploadVideo(url: string) {
  showPlayer.value = true;
  nextTick(() => video.value?.loadVideo(url));
}
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.target === videoSide.value) {
      const _width = entry.contentRect.width;
      const width = _width > 1280 ? 1280 : _width < 640 ? 640 : _width;
      videoStyle.value = {
        width,
        height: width * 0.5625,
      };
    }
  }
});
function videoLoaded(data: videoLoadedParams) {
  subtitleHeadNode = subtitleStore.init(data.duration);
}
onMounted(() => {
  resizeObserver.observe(videoSide.value as HTMLElement);
});
</script>

<style lang="scss" scoped>
.container {
  --container-space: 24px;
  max-width: 1754px;
  margin: auto;
  display: flex;
  .video-side {
    box-sizing: border-box;
    flex: 1;
    max-width: 1304px;
    min-width: 640px;
    margin-left: var(--container-space);
    padding-top: var(--container-space);
    padding-right: var(--container-space);
  }
  .subtitle-side {
    width: 304px;
    padding-right: var(--container-space);
  }
}
</style>
