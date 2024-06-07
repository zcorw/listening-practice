<template>
  <div class="video-subtitle">
    <div class="textarea-contrainer">
      <textarea
        ref="textarea"
        class="textarea"
        :value="text"
        @input="hanldeChange"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const textarea = ref<HTMLTextAreaElement>();
const text = ref("");
function setHeight(height: number) {
  if (height < 33) {
    height = 33;
  }
  const element = textarea.value as HTMLTextAreaElement;
  const styles = {
    height: `${height}px`,
    "min-height": `${height}px`,
  };

  Object.assign(element.style, styles);
}
function hanldeChange() {
  const element = textarea.value as HTMLTextAreaElement;
  element.style.height = "33px";
  text.value = element.value;
  setHeight(element.scrollHeight);
}
onMounted(() => {
  setHeight(33);
});
</script>

<style lang="scss" scoped>
.video-subtitle {
  margin-top: 20px;
  .textarea {
    display: block;
    width: 100%;
    height: 33px;
    min-height: 33px;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    overflow: hidden;
    &:focus {
      outline: none;
      border-color: #409eff;
    }
  }
}
</style>
