import { Vue, Mixins, Component, Inject, Ref, Prop, Provide, Watch } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';

class State {
  isZoom: boolean;
  left: number;
  top: number;
  maxHeight: number;
  maxWidth: number;
  prevX: number;
  prevY: number;
  clickX: number;
  clickY: number;
  isDrag: boolean;

  constructor() {
    this.isZoom = false;
    this.left = 0;
    this.top = 0;
    this.maxHeight = 0;
    this.maxWidth = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.isDrag = false;
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

  @Watch('index', { immediate: true, deep: true })
  OnChangeIndex() {
    this.state = new State();
  }

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
  get styleContent() {
    return {
      height: 'calc(100vh - 300px)'
    };
  }
  get imgStyle() {
    const state = this.state;
    const width = state.maxWidth === 0 ? '100%' : `${state.maxWidth}px`;
    const height = state.maxHeight === 0 ? '100%' : `${state.maxHeight}px`;
    const str = `transform: translate(${state.left}px, ${state.top}px), max-width: ${width}, max-height: ${height}`;
    return {
      // width: state.maxWidth === 0 ? '100%' : `${state.maxWidth}px`,
      // height: state.maxHeight === 0 ? '100%' : `${state.maxHeight}px`,
      transform: `translate(${state.left}px, ${state.top}px)`
    };
    return str;
  }

  OnClickNext() {
    this.$emit('on-next');
  }

  OnClickPrev() {
    this.$emit('on-prev');
  }

  MouseWheel(e: MouseEvent) {
    // console.log(e);
  }
  MouseDown(e: MouseEvent) {
    if (e.button == 0) {
      //왼클릭
      if (this.state.isZoom) {
        this.state.isDrag = true;
      }
      this.state.prevX = e.pageX;
      this.state.prevY = e.pageY;
      this.state.clickX = e.pageX;
      this.state.clickY = e.pageY;
    }
  }
  MouseLeave(e: MouseEvent) {
    this.state.isDrag = false;
  }
  MouseUp(e: MouseEvent) {
    if (e.pageX == this.state.clickX && e.pageY == this.state.clickY) {
      //클릭일 경우 확대 변경
      if (this.isZoomAble) {
        this.state.isZoom = !this.state.isZoom;
        this.state.prevX = 0;
        this.state.prevY = 0;
        this.state.left = 0;
        this.state.top = 0;
      }
    }
    this.state.isDrag = false;
  }
  MouseMove(e: MouseEvent) {
    if (this.state.isDrag) {
      e.preventDefault();
      const y = e.pageY - this.state.prevY;
      const x = e.pageX - this.state.prevX;
      this.state.prevX = e.pageX;
      this.state.prevY = e.pageY;
      this.state.left += x;
      this.state.top += y;
    }
  }
}
