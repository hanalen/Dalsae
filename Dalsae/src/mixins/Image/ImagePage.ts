import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleModal } from '@/store/modules/ModalStore';

@Component
export class ImagePage extends Vue {
  indexContext = 0;

  get listMsg() {
    return moduleModal.stateMessage.listMessage;
  }
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

  get listProgress() {
    return moduleImage.stateProgress.listProgress;
  }

  get isShowContext() {
    return moduleImage.stateImage.isShowContext;
  }
  set isShowContext(isShow: boolean) {
    moduleImage.ChangeState({ ...moduleImage.stateImage, isShowContext: isShow });
  }

  get x() {
    return moduleImage.stateImage.clickX;
  }
  get y() {
    return moduleImage.stateImage.clickY;
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
      this.Save(this.index);
    } else if (ctrlKey && !altKey && !shiftKey && key === 'a') {
      for (let i = 0; i < this.media.length; i++) {
        this.Save(i);
      }
    }
  }

  OnClickSave(e: MouseEvent) {
    this.Save(this.index);
  }

  OnClickSaveAll(e: MouseEvent) {
    for (let i = 0; i < this.media.length; i++) {
      this.Save(i);
    }
  }

  OnContext(e: MouseEvent) {
    this.isShowContext = true;
    moduleImage.ChangeState({ ...moduleImage.stateImage, clickX: e.pageX, clickY: e.pageY });
  }

  Save(index: number) {
    moduleImage.ChangeProgress({
      index: index,
      progress: { bError: false, bStartDownload: true, percent: 0 }
    });
    window.preload.image.DownloadImage(this.media[index], index, this.CallBack);
  }

  CallBack(index: number, percent: number, bError: boolean) {
    moduleImage.ChangeProgress({
      index: index,
      progress: { bError: bError, bStartDownload: true, percent: percent }
    });
  }
}
