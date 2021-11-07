/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Ref } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { eventBus } from '@/plugins';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUtil } from '@/store/modules/UtilStore';
@Component
export class TweetInputBase extends Vue {
  @Ref()
  textArea!: HTMLInputElement;
  @Ref()
  refFile!: HTMLInputElement;
  get inputText() {
    return moduleUI.stateInput.inputText;
  }

  set inputText(text: string) {
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: text });
  }

  get listImage() {
    return moduleUI.stateInput.listImage;
  }

  set listImage(listImage: string[]) {
    moduleUI.SetStateInput({ ...moduleUI.stateInput, listImage: listImage });
  }

  get isAddedMedia() {
    if (this.listImage.length > 0) {
      return this.listImage[0].indexOf('data:image/gif') === 0;
    } else {
      return false;
    }
  }

  regex = new RegExp(
    /[(http|ftp|https):\/\/]*[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi
  );

  OnClickAddImage(e: MouseEvent) {
    this.refFile.click();
  }

  OnFileChange(e: Event) {
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files) return;
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
      this.FileToString(files[i]);
    }
  }

  OnDrop(e: DragEvent) {
    if (!e.dataTransfer) return;
    const files = e.dataTransfer.items;
    for (let i = 0; i < files.length; i++) {
      if (files[i].kind == 'file') {
        this.FileToString(files[i].getAsFile());
      }
    }
  }

  FileToString(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = e.target?.result as string;
      this.AddImage(img);
    };
    reader.readAsDataURL(file);
  }

  AddImage(img: string) {
    if (this.isAddedMedia) {
      moduleModal.AddMessage({
        errorType: M.Messagetype.E_INFO,
        message: 'GIF는 하나만 등록 가능합니다.',
        time: 3
      });
    } else if (this.listImage.length >= 4) {
      moduleModal.AddMessage({
        errorType: M.Messagetype.E_INFO,
        message: '이미지는 4장까지 등록 가능합니다.',
        time: 3
      });
    } else if (this.listImage.findIndex(x => x === img) > -1) {
      //동일한 이미지 등록 시 스킵처리
      moduleModal.AddMessage({
        errorType: M.Messagetype.E_INFO,
        message: '동일한 파일은 추가 할 수 없습니다.',
        time: 3
      });
    } else {
      const isGif = img.indexOf('data:image/gif') === 0;
      if (isGif && this.listImage.length > 0) {
        moduleModal.AddMessage({
          errorType: M.Messagetype.E_INFO,
          message: '이미지와 GIF는 동시에 등록이 불가능합니다.',
          time: 3
        });
      } else {
        const listImage: string[] = this.listImage.slice();
        listImage.push(img);
        this.listImage = listImage;
      }
    }
  }

  OnDragEnter(e: Event) {
    console.log(e);
  }

  OnDragEnd(e: Event) {
    console.log(e);
  }

  OnEsc(e: Event) {
    this.inputText = '';
    this.listImage = [];
    moduleUI.SetStateInput({ ...moduleUI.stateInput, replyTweet: new I.Tweet() });
  }

  selectionChange(e: Event) {
    if (e.type === 'focus') return; //focus일 경우 selection위치가 변경되지 않음, 자동 완성에 필요한 예외 처리
    const position = (e.target as HTMLInputElement).selectionStart;
    if (position === null) return;
    let sIndex = 0; //word로 끊을 시작 index
    let eIndex = 0; //word로 끊을 끝 index
    for (let i = position; i > -1; i--) {
      //현재 커서 앞의 최초 스페이스 찾기
      sIndex = i; //index 0이 @일 경우도 있으므로 시작이 0일 수도 있어서 매번 대입
      if (this.inputText[i - 1] === ' ') {
        break;
      }
    }
    for (let i = position; i <= this.inputText.length; i++) {
      //현재 커서 뒤의 최초 스페이스 찾기
      eIndex = i; //index가 length일 경우도 있으므로 매번 대입
      if (this.inputText[i] === ' ' || this.inputText[i] === '\n') {
        break;
      }
    }
    const word = this.inputText.substring(sIndex, eIndex);
    if (word === `@${moduleModal.stateAutoComplete.autoCompleteWord}`) return;
    if (word[0] === '@') {
      moduleModal.SetAutoComplete({
        ...moduleModal.stateAutoComplete,
        bAutoComplete: true,
        autoCompleteWord: word.substring(1, word.length),
        indexAutoComplete: 0
      });
    } else {
      moduleModal.SetAutoComplete({
        ...moduleModal.stateAutoComplete,
        bAutoComplete: false,
        autoCompleteWord: '',
        indexAutoComplete: 0
      });
    }
  }
  CheckLastLine(e: KeyboardEvent) {
    const index = this.inputText.lastIndexOf('\n');
    if (index == -1) return true;
    if (!e.target) return;
    const pos = (e.target as HTMLInputElement).selectionStart; //커서 위치
    if (!pos) return;
    // console.log('index: '+index + '/ pos: '+pos + '/ len: '+this.tweetText.length)
    if (index < pos && pos <= this.inputText.length) {
      return true;
    } else {
      return false;
    }
  }

  ArrowDown(e: KeyboardEvent) {
    if (this.CheckLastLine(e)) {
      if (moduleUtil.isFocusPanel) {
        e.stopPropagation();
        e.preventDefault();
        eventBus.$emit('FocusPanel');
      }
    }
  }

  EnterDown(e: KeyboardEvent) {
    const { ctrlKey, shiftKey, altKey } = e;
    const { isSendEnter, isSendCheck } = moduleOption.uiOption;
    if (ctrlKey && !shiftKey && !altKey) {
      e.preventDefault();
      if (isSendCheck) {
        this.CheckSendTweet();
      } else {
        this.SendTweet();
      }
    } else if (isSendEnter && !ctrlKey && !shiftKey && !altKey) {
      e.preventDefault();
      if (isSendCheck) {
        this.CheckSendTweet();
      } else {
        this.SendTweet();
      }
    }
  }

  OnClickTweet(e: Event) {
    this.SendTweet();
  }

  CheckSendTweet() {
    moduleModal.SetStateAlert({
      isShow: true,
      title: '트윗 전송 확인',
      message: '트윗을 보내시겠습니까?',
      isYesNo: true,
      callback: (b: boolean) => {
        if (b) {
          this.SendTweet();
        }
      }
    });
  }

  SendTweet() {
    const { inputText, listImage, replyTweet } = moduleUI.stateInput;
    moduleApi.statuses.Update(inputText, listImage, replyTweet?.id_str);
    this.inputText = '';
    this.listImage = [];
    moduleUI.SetStateInput({ ...moduleUI.stateInput, replyTweet: new I.Tweet() });
  }

  ClearInput(e: Event) {
    // console.log(e);
  }

  Paste(e: ClipboardEvent) {
    if (!e.clipboardData) return;
    const files = e.clipboardData.items;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'image/png') {
        this.FileToString(files[i].getAsFile());
      }
    }
  }
  GetTweetLength() {
    let count = 0;
    const { inputText } = this;
    for (let i = 0; i < inputText.length; i++) {
      const num = inputText[i].charCodeAt(0);
      if (0 <= num && num <= 4351) count += 1;
      else if (8192 <= num && num <= 8205) count += 1;
      else if (8208 <= num && num <= 8223) count += 1;
      else if (8242 <= num && num <= 8247) count += 1;
      else if (num < 0) count += 0;
      else count += 2;
    }
    if (this.regex.test(inputText)) {
      //링크가 있을 경우
      const arr = inputText.match(this.regex);
      arr?.forEach(function(url) {
        count = count - url.length + 23;
      });
    }
    return count;
  }
  OnChange(e: InputEvent) {
    const el = e.target as HTMLTextAreaElement;
    if (el) {
      this.inputText = el.value;
    }
  }
}
