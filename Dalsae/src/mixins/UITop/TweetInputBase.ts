import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Ref } from 'vue-property-decorator';
import * as M from '@/Managers';
import * as I from '@/Interfaces';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { eventBus } from '@/plugins';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
@Component
export class TweetInputBase extends Vue {
  @Ref()
  textArea!: HTMLInputElement;
  get inputText() {
    return moduleUI.stateInput.inputText;
  }

  set inputText(text: string) {
    moduleUI.SetInputText(text);
  }

  get listImage() {
    return moduleUI.stateInput.listImage;
  }

  set listImage(listImage: string[]) {
    moduleUI.SetImage(listImage);
  }

  regex = new RegExp(
    /[(http|ftp|https):\/\/]*[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi
  );

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
    if (this.listImage.length >= 4) {
      //todo error message
      //이미지 4개 초과 시 에러 메시지 출력
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const img = e.target?.result as string;
      for (let i = 0; i < this.listImage.length; i++) {
        if (this.listImage[i] === img) {
          //동일한 이미지 등록 시 스킵처리
          return;
        }
      }
      const listImage: string[] = this.listImage.slice();
      listImage.push(img);
      this.listImage = listImage;
    };
    reader.readAsDataURL(file);
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
    moduleUI.ChangeReplyTweet(new I.Tweet());
  }

  selectionChange(e: Event) {
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
    if (word[0] === '@') {
      moduleModal.SetAutoComplete({ bShow: true, word: word.substring(1, word.length) });
    } else {
      moduleModal.SetAutoComplete({ bShow: false, word: '' });
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
      e.stopPropagation();
      e.preventDefault();
      console.log('input key down');
      eventBus.$emit('FocusPanel', moduleUI.selectMenu);
    }
  }

  EnterDown(e: KeyboardEvent) {
    const { ctrlKey, shiftKey, altKey } = e;
    const { isSendEnter } = moduleOption.uiOption;
    if (ctrlKey && !shiftKey && !altKey) {
      e.preventDefault();
      this.SendTweet();
    } else if (isSendEnter && !ctrlKey && !shiftKey && !altKey) {
      e.preventDefault();
      this.SendTweet();
    }
  }

  OnClickTweet(e: Event) {
    this.SendTweet();
  }

  SendTweet() {
    const { inputText, listImage, replyTweet } = moduleUI.stateInput;
    moduleApi.statuses.Update(inputText, listImage, replyTweet.id_str);
    this.inputText = '';
    this.listImage = [];
    moduleUI.ChangeReplyTweet(new I.Tweet());
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
}
