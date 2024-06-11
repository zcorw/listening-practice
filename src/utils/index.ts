import type { Subtitle } from "./subtitleHook";
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

const parseTime = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":");
  const [secs] = seconds.split(",");
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(secs);
};

function convertToSRT(subtitles: Subtitle[]) {
  let index = 1;
  return subtitles
    .map((subtitle) => {
      if (subtitle.text.trim() === "") {
        return "";
      }
      const start = formatTime(subtitle.startTime) + ",000";
      const end = formatTime(subtitle.endTime) + ",000";
      return `${index++}\n${start} --> ${end}\n${subtitle.text.trim()}\n`;
    })
    .filter(Boolean)
    .join("\n");
}

const parseSRT = (srt: string, end: number): Subtitle[] => {
  const subtitles: Subtitle[] = [];
  const blocks = srt.split("\n\n");

  blocks.forEach((block) => {
    const lines = block.split("\n");
    if (lines.length >= 3) {
      const timeMatch = lines[1].match(
        /(\d{1,}:\d{2}:\d{2},\d{3}) --> (\d{1,}:\d{2}:\d{2},\d{3})/,
      );
      if (timeMatch) {
        const startTime = parseTime(timeMatch[1]);
        const endTime = parseTime(timeMatch[2]);
        const text = lines.slice(2).join("\n");
        if (
          subtitles.length > 0 &&
          startTime !== subtitles[subtitles.length - 1].endTime
        ) {
          subtitles.push({
            startTime: subtitles[subtitles.length - 1].endTime,
            endTime: startTime,
            text: "",
          });
        }
        subtitles.push({ startTime, endTime, text });
      }
    }
  });
  if (subtitles[0].startTime !== 0) {
    subtitles.unshift({
      startTime: 0,
      endTime: subtitles[0].startTime,
      text: "",
    });
  }
  if (subtitles[subtitles.length - 1].endTime !== end) {
    subtitles.push({
      startTime: subtitles[subtitles.length - 1].endTime,
      endTime: end,
      text: "",
    });
  }
  return subtitles;
};

function download(str: string, filename?: string) {
  const blob = new Blob([str], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = filename || "subtitle.srt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function upload(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".srt";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsText(target.files![0]);
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

export default {
  formatTime,
  convertToSRT,
  parseSRT,
  download,
  upload,
};
