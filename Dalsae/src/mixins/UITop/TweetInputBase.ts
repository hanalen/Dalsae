import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';

class State {
  tweet: string;
  listImage: string[];
  constructor() {
    this.tweet = '';
    this.listImage = [];
  }
}

@Component
export class TweetInputBase extends mixins(Vue, DalsaePage) {
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
    this.api.call.statuses.Update(this.state.tweet, this.state.listImage);
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
}
