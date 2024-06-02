<template>
  <div class="video-player">
    <div class="video-screen">
      <video ref="videoPlayer" :style="styles">
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="video-controls">
      <div class="slider-control">
        <div class="slider">
          <div class="slider-rail"></div>
          <div class="slider-progress"></div>
          <div class="slider-handle"></div>
        </div>
        <div class="slider-time">00:00:00</div>
      </div>
      <div class="control-buttons">
        <a class="control-button prev"></a>
        <a class="control-button start-point"></a>
        <a class="control-button" :class="isPlay ? 'pause' : 'play'"></a>
        <a class="control-button end-point"></a>
        <a class="control-button next"></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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
const styles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}));
const videoPlayer = ref<HTMLVideoElement>();
const isPlay = ref(false);
function loadVideo(url: string) {
  const player = videoPlayer.value;
  if (!player) return;
  player.src = url;
  player.load();
  player.play();
}
onMounted(() => {
  const player = videoPlayer.value;
  if (!player) return;
  player.addEventListener("play", () => {
    isPlay.value = true;
  });
  player.addEventListener("pause", () => {
    isPlay.value = false;
  });
  player.addEventListener("loadedmetadata", (ev) => {
    console.log(ev);
  });
});
defineExpose({ loadVideo });
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
        width: 59%;
        height: 4px;
        background-color: #1677ff;
        border-radius: 2px;
      }
      .slider-handle {
        position: absolute;
        top: 2px;
        left: 59%;
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
  }
}
</style>
