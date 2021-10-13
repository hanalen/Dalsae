import { Vue, Mixins, Component, Inject, Emit, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleOption } from '@/store/modules/OptionStore';

class State {
  isHover: boolean;
  constructor() {
    this.isHover = false;
  }
}

@Component
export class ImagePreviewBase extends Vue {
  state: State = new State();
  @Prop()
  media!: I.Media[]; //이미지 뷰어 때문에 tweet으로 들고 있어야 함...

  @Prop()
  tweet!: I.Tweet;

  imgPreview(src: I.Media) {
    return src.media_url_https + ':thumb';
  }

  Click(e: Event) {
    this.state.isHover = this.state.isHover;
    window.preload.image.OpenImageWindow(this.tweet, moduleOption.uiOption);
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
