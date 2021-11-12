import { Vue, Mixins, Component, Inject, Emit, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleUtil } from '@/store/modules/UtilStore';

@Component
export class ImagePreviewBase extends Vue {
  isHover = false;
  @Prop()
  media!: I.Media[];

  @Prop()
  tweet!: I.Tweet;

  get isVideo() {
    return this.media[0].type !== 'photo';
  }

  imgPreview(src: I.Media) {
    return src.media_url_https + ':thumb';
  }

  Click(e: Event) {
    moduleUtil.OpenImage(this.tweet);
  }
  MouseOver(e: Event) {
    this.isHover = true;
  }
  MouseOut(e: Event) {
    this.isHover = false;
  }

  get styleSize() {
    return {
      width: this.size + 'px',
      height: this.size + 'px'
    };
  }

  get styleGroup() {
    return {
      right: this.media.length * 8 + this.size + 'px'
    };
  }

  get size() {
    return moduleOption.uiOption.isSmallPreview ? 90 : 100;
  }

  get maxWidth() {
    if (this.media) return (this.media.length * 8 + this.size).toString() + 'px';
    else return '0px';
  }
}
