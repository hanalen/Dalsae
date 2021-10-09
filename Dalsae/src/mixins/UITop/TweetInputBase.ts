import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import * as M from '@/Managers';
import { moduleApi } from '@/store/modules/APIStore';

class State {
  tweet: string;
  listImage: string[];
  constructor() {
    this.tweet = '';
    this.listImage = [];
  }
}

@Component
export class TweetInputBase extends Vue {
  regex = new RegExp(
    /[(http|ftp|https):\/\/]*[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi
  );
  state = new State();

  OnDrop(e: DragEvent) {
    if (!e.dataTransfer) return;
    const files = e.dataTransfer.items;
    for (let i = 0; i < files.length; i++) {
      if (files[i].kind == 'file') {
        this.FileToString(files[i].getAsFile());
      }
    }
  }

  FileToString(file: File | null) {
    if (!file) return;
    if (this.state.listImage.length >= 4) {
      //todo error message
      //이미지 4개 초과 시 에러 메시지 출력
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const img = e.target?.result as string;
      for (let i = 0; i < this.state.listImage.length; i++) {
        if (this.state.listImage[i] === img) {
          //동일한 이미지 등록 시 스킵처리
          return;
        }
      }
      this.state.listImage.push(img);
    };
    reader.readAsDataURL(file);
  }

  OnDragEnter(e: Event) {
    console.log(e);
  }

  OnDragEnd(e: Event) {
    console.log(e);
  }

  OnEsc(e: Event) {
    this.state.tweet = '';
    this.state.listImage = [];
  }

  selectionChange(e: Event) {
    // console.log(e);
  }

  ArrowDown(e: Event) {
    // console.log(e);
  }

  ArrowUp(e: Event) {
    // console.log(e);
  }

  EnterDown(e: Event) {
    e.preventDefault();
    this.SendTweet();
  }

  OnClickTweet(e: Event) {
    this.SendTweet();
  }

  SendTweet() {
    moduleApi.call.statuses.Update(this.state.tweet, this.state.listImage);
    this.state.tweet = '';
    this.state.listImage = [];
  }

  ClearInput(e: Event) {
    // console.log(e);
  }

  Paste(e: ClipboardEvent) {
    if (!e.clipboardData) return;
    const files = e.clipboardData.items;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'image/png') {
        this.FileToString(files[i].getAsFile());
      }
    }
  }
  GetTweetLength() {
    let count = 0;
    const { tweet } = this.state;
    for (let i = 0; i < tweet.length; i++) {
      const num = tweet[i].charCodeAt(0);
      if (0 <= num && num <= 4351) count += 1;
      else if (8192 <= num && num <= 8205) count += 1;
      else if (8208 <= num && num <= 8223) count += 1;
      else if (8242 <= num && num <= 8247) count += 1;
      else if (num < 0) count += 0;
      else count += 2;
    }
    if (this.regex.test(tweet)) {
      //링크가 있을 경우
      const arr = tweet.match(this.regex);
      arr?.forEach(function(url) {
        count = count - url.length + 23;
      });
    }
    return count;
  }
}
