import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import { moduleImage } from '@/store/modules/ImageStore';

@Component
export class ImagePage extends Vue {
  get tweet() {
    return moduleImage.tweet;
  }

  get option() {
    return moduleImage.option;
  }

  get index() {
    return moduleImage.stateImage.index;
  }

  get orgTweet() {
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get media() {
    return this.orgTweet.extended_entities.media;
  }

  OnClickMedia(media: I.Media) {
    const index = this.media.findIndex(x => x.id_str === media.id_str);
    if (index > -1) {
      moduleImage.ChangeState({ ...moduleImage.stateImage, index: index });
    }
  }

  OnKeyDown(e: KeyboardEvent) {
    const { ctrlKey, altKey, shiftKey, key } = e;

    if (ctrlKey && !altKey && !shiftKey && key === 's') {
      console.log('save');
      this.Save();
    } else if (ctrlKey && !altKey && !shiftKey && key === 'a') {
      console.log('save all');
    }
  }

  Save() {
    window.preload.image.DownloadImage(this.media[this.index], this.CallBack);
  }

  CallBack(percent: number) {
    console.log('callback', percent);
  }
}
