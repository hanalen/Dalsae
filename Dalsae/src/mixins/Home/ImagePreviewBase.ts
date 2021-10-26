import { Vue, Mixins, Component, Inject, Emit, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export class ImagePreviewBase extends Vue {
  isHover = false;
  @Prop()
  media!: I.Media[];

  @Prop()
  tweet!: I.Tweet;

  imgPreview(src: I.Media) {
    return src.media_url_https + ':thumb';
  }

  Click(e: Event) {
    // this.state.isHover = this.state.isHover;
    window.preload.image.OpenImageWindow(this.tweet, moduleOption.uiOption);
  }
  MouseOver(e: Event) {
    this.isHover = true;
  }
  MouseOut(e: Event) {
    this.isHover = false;
  }

  get maxWidth() {
    if (this.media) return (this.media.length * 8 + 100).toString() + 'px';
    else return '0px';
  }
}
