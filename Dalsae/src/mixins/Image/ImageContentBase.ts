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
    const { isZoom, maxWidth, maxHeight, left, top } = this.state;
    const width = maxWidth === 0 ? '100%' : `${maxWidth}px`;
    const height = maxHeight === 0 ? '100%' : `${maxHeight}px`;
    if (isZoom && maxWidth === 0 && maxHeight === 0) {
      return {
        transform: `translate(${left}px, ${top}px)`
      };
    } else {
      return {
        'max-width': width,
        'max-height': height,
        transform: `translate(${left}px, ${top}px)`
      };
    }
  }

  Zoom() {
    if (!this.isZoomAble) return;
    this.state.isZoom = true;
    const img = this.img[this.index];
    let percent = 1.0;
    if (img.clientHeight <= img.naturalHeight) {
      //확대 비율을 구하기
      percent = img.clientHeight / img.naturalHeight;
    } else if (img.clientWidth <= img.naturalWidth) {
      percent = img.clientWidth / img.naturalWidth;
    }
    percent = parseFloat((percent + 0.1).toFixed(1));
    if (percent < 0.1) percent = 0.1;
    else if (percent > 1.0) percent = 1.0;

    this.SetImageSize(percent);
  }

  ZoomOut() {
    if (!this.isZoomAble) return;
    this.state.isZoom = true;
    const img = this.img[this.index];
    let percent = 1.0;
    if (img.clientHeight <= img.naturalHeight) {
      //확대 비율을 구하기
      percent = img.clientHeight / img.naturalHeight;
    } else if (img.clientWidth <= img.naturalWidth) {
      percent = img.clientWidth / img.naturalWidth;
    }
    percent = parseFloat((percent - 0.1).toFixed(1));
    if (percent < 0.1) percent = 0.1;
    else if (percent > 1.0) percent = 1.0;

    this.SetImageSize(percent);
  }

  ZoomReset() {
    if (this.state.isZoom) {
      this.SetImageSize(1.0);
    } else {
      this.state.maxWidth = 0;
      this.state.maxHeight = 0;
    }
  }
  SetImageSize(percent: number) {
    //percent: 0.0~1.0 단위!
    const img = this.img[this.index];
    this.state.maxWidth = img.naturalWidth * percent;
    this.state.maxHeight = img.naturalHeight * percent;
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
        this.ZoomReset();
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
  OnKeyDown(e: KeyboardEvent) {
    if (e.key === '1') {
      this.$emit('on-change-index', 0);
    } else if (e.key === '2') {
      this.$emit('on-change-index', 1);
    } else if (e.key === '3') {
      this.$emit('on-change-index', 2);
    } else if (e.key === '4') {
      this.$emit('on-change-index', 3);
    } else if (e.key === 'e') {
      this.Zoom();
    } else if (e.key === 'q') {
      this.ZoomOut();
    } else if (e.key === 'w') {
      if (!this.state.isZoom) return;
      this.state.top -= 20;
    } else if (e.key === 'a') {
      if (!this.state.isZoom) return;
      this.state.left -= 20;
    } else if (e.key === 's') {
      if (!this.state.isZoom) return;
      this.state.top += 20;
    } else if (e.key === 'd') {
      if (!this.state.isZoom) return;
      this.state.left += 20;
    } else if (e.key === ' ') {
      if (this.isZoomAble) {
        const zoom = !this.state.isZoom;
        this.state = new State();
        this.state.isZoom = zoom;
      }
    }
  }
}
