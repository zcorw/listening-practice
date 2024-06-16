<template>
  <div class="container">
    <div ref="videoSide" class="video-side">
      <div class="header">
        <div v-if="!!showPlayer" class="back" @click="back"></div>
      </div>
      <VideoPlayer
        v-if="!!showPlayer"
        ref="video"
        :width="videoStyle.width"
        :height="videoStyle.height"
        :subtitleText="subtitleText"
        :subtitleTimes="subtitleTimes"
        @loaded="videoLoaded"
        @insertTimePoint="insertTimePoint"
        @update-time="updateTime"
      />
      <VideoInput
        v-else
        @change="uploadVideo"
        :width="videoStyle.width"
        :height="videoStyle.height"
      />
      <SubtitleInput v-model:text="subtitleText" />
    </div>
    <div class="subtitle-side">
      <SubtitleSection
        :subtitles="subtitleList"
        :disabled="subtitleCurrentNode === null"
        @download="downloadSubtitle"
        @upload="uploadSubtitle"
        @jump="jump"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, provide, onMounted } from "vue";
import VideoInput from "./components/VideoInput.vue";
import VideoPlayer from "./components/VideoPlayer.vue";
import SubtitleInput from "./components/SubtitleInput.vue";
import SubtitleSection from "./components/SubtitleSection.vue";
import subtitleHook from "./utils/subtitleHook";
import utils from "./utils";
import type { Subtitle } from "./utils/subtitleHook";
import type { videoLoadedParams } from "./global.d";

const showPlayer = ref(false);
const video = ref();
const videoSide = ref<HTMLElement>();
const videoStyle = ref<{ width: number; height: number }>({
  width: 1280,
  height: 720,
});
const videoName = ref<string>("");
let subtitleCurrentNode = ref<Subtitle | null>(null);
provide("subtitleCurrentNode", subtitleCurrentNode);
const subtitleText = ref<string>("");
const {
  list: subtitleList,
  init,
  splitSubtitle,
  getCurrentSubtitle,
  clear,
} = subtitleHook();
const subtitleTimes = computed(() => {
  if (subtitleList.value.length === 0) {
    return [];
  }
  return subtitleList.value.slice(1).map((item) => item.startTime);
});
watch(
  subtitleCurrentNode,
  (val, oldVal) => {
    if (val === null) {
      subtitleText.value = "";
      return;
    }
    if (oldVal === null) {
      subtitleText.value = val.text;
      return;
    }
    if (val.text !== oldVal.text) {
      subtitleText.value = val.text;
    }
  },
  { deep: true },
);
watch(subtitleText, (val) => {
  if (!subtitleCurrentNode.value) return;
  subtitleCurrentNode.value.text = val;
});
function uploadVideo(url: string, name: string) {
  showPlayer.value = true;
  videoName.value = name;
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
  subtitleCurrentNode.value = init(data.duration);
}
function insertTimePoint(time: number) {
  if (!subtitleCurrentNode.value) return;
  splitSubtitle(time, subtitleCurrentNode.value);
}
function updateTime(time: number) {
  subtitleCurrentNode.value = getCurrentSubtitle(time);
}
function downloadSubtitle() {
  const srt = utils.convertToSRT(subtitleList.value);
  utils.download(srt, `${utils.removeFileExtension(videoName.value)}.srt`);
}
async function uploadSubtitle() {
  const end = subtitleList.value[subtitleList.value.length - 1].endTime;
  const srt = await utils.upload();
  subtitleList.value = utils.parseSRT(srt, end);
  updateTime(video.value.getCurrentTime());
}
function jump(time: number) {
  video.value?.setPlayTime(time);
}
function back() {
  video.value?.videoStop();
  showPlayer.value = false;
  subtitleCurrentNode.value = null;
  clear();
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
    .header {
      height: 30px;
      .back {
        cursor: pointer;
        height: 30px;
        width: 30px;
        background-image: url(/images/back.svg);
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
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
    padding-top: var(--container-space);
  }
}
</style>
