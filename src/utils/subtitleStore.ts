export class Subtitle {
  public next: Subtitle | null = null;
  public prev: Subtitle | null = null;
  private _text: string;
  private _onText: ((text: string) => void) | null = null;
  constructor(
    public startTime: number,
    public endTime: number,
    text: string,
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this._text = text;
  }

  get text() {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
    this._onText?.(text);
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

  onTextEvent(callback: (text: string) => void) {
    this._onText = callback;
  }

  removeTextEvent() {
    this._onText = null;
  }
}

function init(videoLength: number) {
  return new Subtitle(0, videoLength, "");
}

function splitSubtitle(time: number, subtitle: Subtitle) {
  const newSubtitle = new Subtitle(time, subtitle.endTime, "");
  subtitle.setEndTime(time);
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
