import { Vue, Mixins, Component, Inject, Ref, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';

@Component
export class ImageContentBase extends Mixins(Vue) {
  @Prop()
  tweet!: I.Tweet;

  @Ref()
  imgDiv!: HTMLElement[];

  @Ref()
  img!: HTMLImageElement[];
  isZoom = false;
  index = 0;
  marginLeft = 0;
  marginTop = 0;
  maxWidth = 0;
  maxHeight = 0;

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

  MouseWheel(e: Event) {
    console.log(e);
  }
  MouseDown(e: Event) {
    console.log(e);
  }
  MouseLeave(e: Event) {
    console.log(e);
  }
  MouseUp(e: Event) {
    console.log(e);
  }
  MouseMove(e: Event) {
    console.log(e);
  }
}
