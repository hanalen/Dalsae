import { Vue, Mixins, Component, Inject, Ref, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';

class State {
  isZoom: boolean;
  left: number;
  top: number;
  maxHeight: number;
  maxWidth: number;

  constructor() {
    this.isZoom = false;
    this.left = 0;
    this.top = 0;
    this.maxHeight = 0;
    this.maxWidth = 0;
  }
}

@Component
export class ImageContentBase extends Mixins(Vue) {
  @Prop()
  tweet!: I.Tweet;

  @Prop()
  index!: number;

  @Ref()
  imgDiv!: HTMLElement[];

  @Ref()
  img!: HTMLImageElement[];

  state = new State();

  get isZoomAble() {
    const div = this.imgDiv[this.index];
    const img = this.img[this.index];
    if (div.clientHeight <= img.clientHeight || div.clientWidth <= img.clientWidth)
      ///img가 그림 배경보다 클 경우에만 zoom동작
      return true;
    else return false;
  }

  get orgTweet() {
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get media() {
    return this.orgTweet.extended_entities.media;
  }

  get imgStyle() {
    const state = this.state;
    const width = state.maxWidth === 0 ? '100%' : `${state.maxWidth}px`;
    const height = state.maxHeight === 0 ? '100%' : `${state.maxHeight}px`;
    const str = `transform: translate(${state.left}px, ${state.top}px), max-width: ${width}, max-height: ${height}`;
    return str;
  }

  OnClickNext() {
    this.$emit('on-next');
  }

  OnClickPrev() {
    this.$emit('on-prev');
  }

  MouseWheel(e: Event) {
    // console.log(e);
  }
  MouseDown(e: Event) {
    // console.log(e);
  }
  MouseLeave(e: Event) {
    // console.log(e);
  }
  MouseUp(e: Event) {
    // console.log(e);
  }
  MouseMove(e: Event) {
    // console.log(e);
  }
}
