<template>
  <div class="video-player">
    <div class="video-screen">
      <video ref="videoPlayer" :autoplay="false" :style="styles">
        Your browser does not support the video tag.
      </video>
      <div v-if="props.subtitleText" class="video-overlay">
        {{ props.subtitleText }}
      </div>
    </div>
    <div class="video-controls">
      <div class="slider-control">
        <div ref="sliderContainer" class="slider" @click="setProgress">
          <i v-for="tag in tags" :key="tag" :style="{ left: tag }"></i>
          <div ref="slider" class="slider-rail" @click="setProgress"></div>
          <div class="slider-progress" :style="{ width: schedule }"></div>
          <div
            class="slider-handle"
            :style="{ left: schedule }"
            @mousedown="mouseDown"
          ></div>
        </div>
        <div class="slider-time">{{ currentTimeDisplay }}</div>
      </div>
      <div class="control-buttons">
        <a class="control-button fast-back" @click="fastBackTime"></a>
        <a class="control-button prev" @click="prevTime"></a>
        <a
          class="control-button"
          :class="isPlay ? 'pause' : 'play'"
          @click="togglePlay"
        ></a>
        <a class="control-button next" @click="nextTime"></a>
        <a class="control-button fast-forward" @click="fastForwardTime"></a>
        <a class="control-button mark" @click="insertTimePoint"></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { videoLoadedParams } from "@/global.d";
</script>
<script setup lang="ts">
import { ref, computed, watch, inject, onMounted, onUnmounted } from "vue";
import type { PropType } from "vue";
import utils from "@/utils";

const props = defineProps({
  width: {
    type: Number,
    default: 1280,
  },
  height: {
    type: Number,
    default: 720,
  },
  subtitleText: {
    type: String,
    default: "",
  },
  subtitleTimes: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});
const emits = defineEmits<{
  (e: "loaded", data: videoLoadedParams): void;
  (e: "updateTime", time: number): void;
  (e: "insertTimePoint", time: number): void;
}>();
const styles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}));
const tags = computed(() => {
  return props.subtitleTimes.map((time) => {
    return `${(time / duration.value) * 100}%`;
  });
});
const videoPlayer = ref<HTMLVideoElement>();
const slider = ref<HTMLDivElement>();
const sliderContainer = ref<HTMLDivElement>();
const isPlay = ref(false);
const duration = ref(0);
const currentTime = ref(0);
watch(currentTime, (val) => {
  emits("updateTime", val);
});
const currentTimeDisplay = computed(() => {
  return utils.formatTime(currentTime.value);
});
const schedule = computed(() => {
  return `${(currentTime.value / duration.value) * 100}%`;
});
let stopPropagation = false;
function loadVideo(url: string) {
  const player = videoPlayer.value;
  if (!player) return;
  player.src = url;
  player.load();
}
function togglePlay() {
  const player = videoPlayer.value;
  if (!player) return;
  if (player.paused || player.ended) {
    if (player.ended) {
      player.currentTime = 0;
    }
    player.play();
    isPlay.value = true;
  } else {
    player.pause();
    isPlay.value = false;
  }
}
function setProgress(e: MouseEvent) {
  if (stopPropagation) return;
  const player = videoPlayer.value;
  if (!player) return;
  const width = slider.value?.clientWidth as number;
  const clickX = e.offsetX;
  player.currentTime = (clickX / width) * duration.value;
}
function mouseDown(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  stopPropagation = true;
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
}
function mouseMove(e: MouseEvent) {
  const player = videoPlayer.value;
  if (!sliderContainer.value || !player) return;
  const rect = sliderContainer.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const width = sliderContainer.value.clientWidth;
  const duration = player.duration;
  let percent = (offsetX / width) * 100;

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  currentTime.value = (percent / 100) * duration;
}
function mouseUp(e: MouseEvent) {
  e.stopPropagation();
  document.removeEventListener("mousemove", mouseMove);
  document.removeEventListener("mouseup", mouseUp);
  videoPlayer.value!.currentTime = currentTime.value;
  setTimeout(() => (stopPropagation = false));
}
function setPlayStart() {
  isPlay.value = true;
}
function setPlayStop() {
  isPlay.value = false;
}
function setDuration() {
  const player = videoPlayer.value;
  if (!player) return;
  duration.value = player.duration;
  emits("loaded", {
    duration: player.duration,
  });
}
function setCurrentTime() {
  const player = videoPlayer.value;
  if (!player) return;
  if (stopPropagation) return;
  currentTime.value = player.currentTime;
}
function getCurrentTime() {
  return currentTime.value;
}
function setPlayTime(time: number) {
  videoPlayer.value!.currentTime = time;
}
function insertTimePoint() {
  emits("insertTimePoint", currentTime.value);
}
function handleKeyDown(event: KeyboardEvent) {
  const shortcut = {
    s: togglePlay,
    i: insertTimePoint,
    ArrowLeft: prevTime,
    ArrowRight: nextTime,
    p: fastBackTime,
    n: fastForwardTime,
  };
  if (event.altKey) {
    const key = event.key as keyof typeof shortcut;
    const keys = Object.keys(shortcut) as Array<keyof typeof shortcut>;
    if (keys.includes(key)) {
      event.preventDefault();
      shortcut[key]();
    }
  }
}
function prevTime() {
  const player = videoPlayer.value;
  if (!player) return;
  for (let i = props.subtitleTimes.length; i >= 0; i--) {
    if (props.subtitleTimes[i] < currentTime.value) {
      player.currentTime = props.subtitleTimes[i];
      return;
    }
  }
  player.currentTime = 0;
}
function nextTime() {
  const player = videoPlayer.value;
  if (!player) return;
  for (let i = 0; i < props.subtitleTimes.length; i++) {
    if (props.subtitleTimes[i] > currentTime.value) {
      player.currentTime = props.subtitleTimes[i];
      return;
    }
  }
}
function fastBackTime() {
  const player = videoPlayer.value;
  if (!player) return;
  player.currentTime -= 5;
}
function fastForwardTime() {
  const player = videoPlayer.value;
  if (!player) return;
  player.currentTime += 5;
}
onMounted(() => {
  const player = videoPlayer.value;
  if (!player) return;
  player.addEventListener("play", setPlayStart);
  player.addEventListener("pause", setPlayStop);
  player.addEventListener("loadedmetadata", setDuration);
  player.addEventListener("timeupdate", setCurrentTime);
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  const player = videoPlayer.value;
  if (!player) return;
  player.removeEventListener("play", setPlayStart);
  player.removeEventListener("pause", setPlayStop);
  player.removeEventListener("loadedmetadata", setDuration);
  player.removeEventListener("timeupdate", setCurrentTime);
  window.removeEventListener("keydown", handleKeyDown);
});
defineExpose({ loadVideo, getCurrentTime, setPlayTime });
</script>

<style lang="scss" scoped>
.video-player {
  display: flex;
  flex-direction: column;
  .video-screen {
    position: relative;
  }
  .video-controls {
    .slider-control {
      display: flex;
    }
    .slider-time {
      width: 55px;
      line-height: 30px;
      margin: 0 10px;
    }
    .slider {
      flex: 1;
      position: relative;
      margin: 11px 5px;
      padding: 4px 0;
      i {
        display: inline-block;
        position: absolute;
        top: -14px;
        width: 15px;
        height: 10px;
        margin-left: -7px;
        background-image: url(/images/triangle.svg);
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .slider-rail {
        position: absolute;
        top: 2px;
        width: 100%;
        height: 4px;
        background-color: #d9d9d9;
        border-radius: 2px;
      }
      .slider-progress {
        position: absolute;
        top: 2px;
        width: 0%;
        height: 4px;
        background-color: #1677ff;
        border-radius: 2px;
      }
      .slider-handle {
        position: absolute;
        top: 2px;
        left: 0%;
        width: 12px;
        height: 12px;
        background-color: #fff;
        border: #1677ff 2px solid;
        border-radius: 50%;
        margin-left: -6px;
        margin-top: -4px;
      }
    }
  }
  .control-buttons {
    display: flex;
    justify-content: center;
    .control-button {
      width: 30px;
      height: 30px;
      background-size: 100%;
      margin: 0 15px;
      cursor: pointer;
    }
    .prev {
      background-image: url(/images/prev.svg);
    }
    .start-point {
      background-image: url(/images/start-point.svg);
    }
    .play {
      background-image: url(/images/play.svg);
    }
    .pause {
      background-image: url(/images/pause.svg);
    }
    .end-point {
      background-image: url(/images/end-point.svg);
    }
    .next {
      background-image: url(/images/next.svg);
    }
    .mark {
      background-image: url(/images/mark.svg);
    }
    .fast-forward {
      background-image: url(/images/fast-forward.svg);
    }
    .fast-back {
      background-image: url(/images/fast-back.svg);
    }
  }
  .video-overlay {
    position: absolute;
    bottom: 20px;
    left: 15%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    width: 70%; /* 防止字幕过长 */
    box-sizing: border-box; /* 包含内边距和边框在宽度计算中 */
    text-align: center;
    font-size: 14px;
    white-space: break-spaces;
  }
}
</style>
