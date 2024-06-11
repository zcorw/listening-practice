import { ref } from "vue";

export interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
}

export default function subtitleHook() {
  const list = ref<Subtitle[]>([]);
  function init(videoLength: number) {
    const head: Subtitle = {
      startTime: 0,
      endTime: videoLength,
      text: "",
    };
    list.value = [head];
    return head;
  }
  function splitSubtitle(time: number, subtitle: Subtitle): Subtitle {
    const index = list.value.indexOf(subtitle);
    if (index !== -1) {
      const newSubtitle: Subtitle = {
        startTime: time,
        endTime: subtitle.endTime,
        text: "",
      };
      subtitle.endTime = time;
      list.value.splice(index + 1, 0, newSubtitle);
      return newSubtitle;
    } else {
      throw new Error("该节点不存在");
    }
  }
  function getCurrentSubtitle(time: number): Subtitle {
    for (let i = 0; i < list.value.length; i++) {
      const current = list.value[i];
      if (time >= current.startTime && time < current.endTime) {
        return list.value[i];
      }
    }
    throw new Error("超出时间范围");
  }
  return {
    list,
    init,
    splitSubtitle,
    getCurrentSubtitle,
  };
}
