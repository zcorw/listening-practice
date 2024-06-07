export class Subtitle {
  public next: Subtitle | null = null;
  public prev: Subtitle | null = null;
  constructor(
    public startTime: number,
    public endTime: number,
    public text: string,
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.text = text;
  }

  checkWithTime(time: number) {
    return time >= this.startTime && time <= this.endTime;
  }

  updateText(text: string) {
    this.text = text;
  }

  setNext(next: Subtitle | null) {
    this.next = next;
  }

  setPrev(prev: Subtitle | null) {
    this.prev = prev;
  }

  setEndTime(time: number) {
    this.endTime = time;
  }
}

function init(videoLength: number) {
  return new Subtitle(0, videoLength, "");
}

function splitSubtitle(time: number, subtitle: Subtitle) {
  const newSubtitle = new Subtitle(time, subtitle.endTime, "");
  newSubtitle.setNext(subtitle.next);
  newSubtitle.setPrev(subtitle);
  subtitle.setNext(newSubtitle);
  return newSubtitle;
}

function getCurrentSubtitle(time: number, startSubtitle: Subtitle) {
  let subtitle: Subtitle | null = startSubtitle;
  while (subtitle) {
    if (subtitle.checkWithTime(time)) {
      return subtitle;
    }
    subtitle = subtitle.next;
  }
  return null;
}

export default {
  init,
  splitSubtitle,
  getCurrentSubtitle,
};
