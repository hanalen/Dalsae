import { Vue, Mixins, Component, Inject, Emit, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';

class State {
  isHover: boolean;
  constructor() {
    this.isHover = false;
  }
}

@Component
export class ImagePreviewBase extends Mixins(Vue, MIX.DalsaePage) {
  state: State = new State();
  @Prop()
  media!: I.Media[]; //이미지 뷰어 때문에 tweet으로 들고 있어야 함...

  @Inject()
  OpenImage!: () => void;

  imgPreview(src: I.Media) {
    return src.media_url_https + ':thumb';
  }

  Click(e: Event) {
    // console.log('click');
    this.state.isHover = this.state.isHover;
    this.OpenImage();
    // window.preload.image.OpenImageWindow(this.mngTweet.homes[0], this.mngOption.uiOption);
    // window.preload.image.OpenImageWindow(this.mngTweet.homes[0]);
  }
  MouseOver(e: Event) {
    // this.state.isHover = true;
  }
  MouseOut(e: Event) {
    // this.state.isHover = false;
  }

  get imgClass() {
    return this.state.isHover ? 'bounce-enter-active' : 'bounce-leave-active';
  }

  get maxWidth() {
    if (this.media) return (this.media.length * 8 + 100).toString() + 'px';
    else return '0px';
  }
}
