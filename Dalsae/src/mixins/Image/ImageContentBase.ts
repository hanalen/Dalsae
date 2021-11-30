import { Vue, Mixins, Component, Inject, Ref, Prop, Provide, Watch } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';
import { moduleImage } from '@/store/modules/ImageStore';
import { copyImageToClipboard } from 'copy-image-clipboard';
import { moduleModal } from '@/store/modules/ModalStore';
import { Messagetype } from '@/mixins';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export class ImageContentBase extends Mixins(Vue) {
  get tweet() {
    return moduleImage.tweet;
  }

  get index() {
    return moduleImage.stateImage.index;
  }

  set index(index: number) {
    moduleImage.ChangeState({ ...moduleImage.stateImage, index: index });
  }

  get isZoom() {
    return moduleImage.stateImage.isZoom;
  }

  @Ref()
  imgDiv!: HTMLElement[];

  @Ref()
  img!: HTMLImageElement[];

  GetSrc(media: I.Media) {
    if (moduleOption.uiOption.isLoadOrgImg) {
      return `${media.media_url}:orig`;
    } else {
      return media.media_url;
    }
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
    return this.tweet.orgTweet;
  }

  get media() {
    return this.orgTweet.extended_entities.media;
  }
  get styleContent() {
    return {
      height: 'calc(100vh - 310px)'
    };
  }
  get imgStyle() {
    const { isZoom, maxWidth, maxHeight, left, top } = moduleImage.stateImage;
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
    moduleImage.ChangeState({ ...moduleImage.stateImage, isZoom: true });
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
    moduleImage.ChangeState({ ...moduleImage.stateImage, isZoom: true });
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
    if (moduleImage.stateImage.isZoom) {
      this.SetImageSize(1.0);
    } else {
      moduleImage.ChangeState({ ...moduleImage.stateImage, maxWidth: 0, maxHeight: 0 });
    }
  }
  SetImageSize(percent: number) {
    //percent: 0.0~1.0 단위!
    const img = this.img[this.index];
    moduleImage.ChangeState({
      ...moduleImage.stateImage,
      maxWidth: img.naturalWidth * percent,
      maxHeight: img.naturalHeight * percent
    });
  }

  OnClickNext() {
    this.$emit('on-next');
  }

  OnClickPrev() {
    this.$emit('on-prev');
  }

  MouseWheel(e: WheelEvent) {
    if (e.deltaY < 0) {
      this.Zoom();
    } else if (e.deltaY > 0) {
      this.ZoomOut();
    }
  }
  MouseDown(e: MouseEvent) {
    if (e.button == 0) {
      //왼클릭
      if (moduleImage.stateImage.isZoom) {
        moduleImage.ChangeState({ ...moduleImage.stateImage, isDrag: true });
      }
      moduleImage.ChangeState({
        ...moduleImage.stateImage,
        prevX: e.pageX,
        prevY: e.pageY,
        clickX: e.pageX,
        clickY: e.pageY
      });
    }
  }
  MouseLeave(e: MouseEvent) {
    // moduleImage.ChangeState({ ...moduleImage.stateImage, isDrag: false });
  }
  MouseUp(e: MouseEvent) {
    const { clickX, clickY, isZoom } = moduleImage.stateImage;
    if (e.pageX == clickX && e.pageY == clickY) {
      //클릭일 경우 확대 변경
      if (this.isZoomAble) {
        moduleImage.ChangeState({
          ...moduleImage.stateImage,
          isZoom: !isZoom,
          prevX: 0,
          prevY: 0,
          left: 0,
          top: 0
        });
        this.ZoomReset();
      }
    }
    moduleImage.ChangeState({ ...moduleImage.stateImage, isDrag: false });
  }
  MouseMove(e: MouseEvent) {
    const { isDrag, prevX, prevY, left, top } = moduleImage.stateImage;
    if (isDrag) {
      e.preventDefault();
      const y = e.pageY - prevY;
      const x = e.pageX - prevX;
      moduleImage.ChangeState({
        ...moduleImage.stateImage,
        prevX: e.pageX,
        prevY: e.pageY,
        left: left + x,
        top: top + y
      });
    }
  }
  async CopyImage(index: number) {
    const url = this.media[index].media_url_https;
    copyImageToClipboard(url)
      .then(() => {
        moduleModal.AddMessage({
          errorType: Messagetype.E_INFO,
          message: '이미지가 복사 되었습니다',
          time: 1
        });
      })
      .catch((e: Error) => {
        moduleModal.AddMessage({
          errorType: Messagetype.E_INFO,
          message: `이미지가 복사에 실패했습니다. ${e.message}`,
          time: 1
        });
      });
  }
  OnKeyDown(e: KeyboardEvent) {
    const { isZoom, top, left } = moduleImage.stateImage;
    if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
      moduleImage.Reset();
      const index = Number.parseInt(e.key) - 1;
      if (index >= this.media.length) return;
      this.index = index;
    } else if (e.code === 'ArrowLeft') {
      const index = this.index - 1;
      if (index < 0) return;
      else if (index >= this.media.length) return;
      moduleImage.Reset();
      this.index = index;
    } else if (e.code === 'ArrowRight') {
      const index = this.index + 1;
      if (index < 0) return;
      else if (index >= this.media.length) return;
      moduleImage.Reset();
      this.index = index;
    } else if (e.key === 'e') {
      this.Zoom();
    } else if (e.key === 'q') {
      this.ZoomOut();
    } else if (e.key === 'w') {
      if (!isZoom) return;
      moduleImage.ChangeState({ ...moduleImage.stateImage, top: top + 20 });
    } else if (e.key === 'a') {
      if (!isZoom) return;
      moduleImage.ChangeState({ ...moduleImage.stateImage, left: left + 20 });
    } else if (e.key === 's') {
      if (!isZoom) return;
      moduleImage.ChangeState({ ...moduleImage.stateImage, top: top - 20 });
    } else if (e.key === 'd') {
      if (!isZoom) return;
      moduleImage.ChangeState({ ...moduleImage.stateImage, left: left - 20 });
    } else if (e.key === 'r') {
      if (moduleOption.uiOption.isLoadOrgImg) return;
      this.ZoomReset();
      moduleModal.AddMessage({
        errorType: MIX.Messagetype.E_INFO,
        message: '이미지 원본을 불러왔습니다.',
        time: 1
      });
      moduleImage.Reset();
      moduleOption.ChangeOption({ ...moduleOption.uiOption, isLoadOrgImg: true });
    } else if (e.key === ' ') {
      if (this.isZoomAble) {
        moduleImage.ChangeState({
          ...moduleImage.stateImage,
          isZoom: !isZoom,
          prevX: 0,
          prevY: 0,
          left: 0,
          top: 0
        });
        this.ZoomReset();
      }
    } else if (e.key === 'c' && e.ctrlKey && !e.shiftKey && !e.altKey) {
      this.CopyImage(this.index);
    } else if (e.key === 'F3' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      window.ipc.files.OpenImageFolder();
    }
  }
}
