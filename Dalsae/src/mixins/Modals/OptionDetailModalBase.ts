import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import store from '@/store';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleOption } from '@/store/modules/OptionStore';
class State {
  selectMenu: number;
  listMenu: ModalMenu[];
  listHotkeyMenu: HotkeyMenu[];
  selectWord: string;
  input: string;
  isInitHotkey: boolean;
  constructor() {
    this.selectMenu = 0;
    this.listMenu = [];
    this.listHotkeyMenu = [];
    this.selectWord = '';
    this.input = '';
    this.isInitHotkey = false;
    this.listMenu.push(
      {
        title: '필터링 설정',
        subTitle: '트윗을 필터링 해줍니다',
        menuSub: [
          { title: '단어 뮤트', icon: 'mdi-filter', menuNumber: 0 },
          { title: '사용자 뮤트', icon: 'mdi-account-off', menuNumber: 1 },
          { title: '클라이언트 뮤트', icon: 'mdi-filter', menuNumber: 2 },
          { title: '트윗 뮤트', icon: 'mdi-filter', menuNumber: 3 }
        ]
      },
      {
        title: '단어 알림 설정',
        subTitle: '특정 단어가 들어간 트윗을 알림 표시 합니다.',
        menuSub: [{ title: '단어 알림', icon: 'mdi-filter', menuNumber: 4 }]
      },
      {
        title: '필터링 상세 설정',
        subTitle: '특정 조건 필터링을 제외 할 수 있습니다.',
        menuSub: [{ title: '필터링 상세 설정', icon: 'mdi-filter', menuNumber: 5 }]
      },
      {
        title: '단축키 설정',
        subTitle: '프로그램을 보다 편하게 ',
        menuSub: [{ title: '단축키 설정', icon: 'mdi-filter', menuNumber: 6 }]
      }
    );
    this.listHotkeyMenu.push(
      {
        title: '화면 전환',
        subtitle: '',
        menuSub: [
          { label: '타임라인 보기', hotKeyType: I.E_HOTKEY.SHOWTL },
          { label: '알림 보기', hotKeyType: I.E_HOTKEY.SHOWMENTION },
          { label: '쪽지 보기', hotKeyType: I.E_HOTKEY.SHOWDM },
          { label: '관심글 보기', hotKeyType: I.E_HOTKEY.SHOWFAVORITE },
          { label: '최근 연 링크 보기', hotKeyType: I.E_HOTKEY.SHOWURL }
        ]
      },
      {
        title: '답변 기능',
        subtitle: '',
        menuSub: [
          { label: '모두에게 답변하기', hotKeyType: I.E_HOTKEY.REPLYALL },
          { label: '작성자에게 답변하기 ', hotKeyType: I.E_HOTKEY.REPLY },
          { label: '쪽지 보내기', hotKeyType: I.E_HOTKEY.SENDDM }
        ]
      },
      {
        title: '트윗 기능',
        subtitle: '',
        menuSub: [
          { label: '대화 불러오기', hotKeyType: I.E_HOTKEY.LOADCONV },
          { label: '인용 트윗 보기', hotKeyType: I.E_HOTKEY.SHOWQT },
          { label: '리트윗', hotKeyType: I.E_HOTKEY.RETWEET },
          { label: '인용 리트윗', hotKeyType: I.E_HOTKEY.SENDQT },
          { label: '관심글 등록', hotKeyType: I.E_HOTKEY.SENDFAVORITE },
          { label: '해시태그 추가', hotKeyType: I.E_HOTKEY.HASH },
          { label: '트윗 삭제', hotKeyType: I.E_HOTKEY.DELETE }
        ]
      },
      {
        title: 'UI 기능',
        subtitle: '',
        menuSub: [
          { label: '입력칸으로 이동', hotKeyType: I.E_HOTKEY.INPUT },
          { label: '트윗 메뉴 열기', hotKeyType: I.E_HOTKEY.SHOWCONTEXT },
          { label: '가장 위로 이동', hotKeyType: I.E_HOTKEY.HOME },
          { label: '가장 아래로 이동', hotKeyType: I.E_HOTKEY.END },
          { label: '미디어 열기', hotKeyType: I.E_HOTKEY.SHOWIMAGE }
        ]
      },
      {
        title: '기타 기능',
        subtitle: '',
        menuSub: [
          { label: '불러오기', hotKeyType: I.E_HOTKEY.LOADING },
          { label: '트윗 복사하기', hotKeyType: I.E_HOTKEY.COPY },
          { label: '입력 취소하기', hotKeyType: I.E_HOTKEY.CANCLE }
        ]
      }
    );
  }
}

interface ModalMenu {
  title: string;
  subTitle: string;
  icon?: string;
  menuSub: ModalMenuSub[];
}

interface ModalMenuSub {
  title: string;
  icon: string;
  menuNumber: number;
}

interface HotkeyMenu {
  title: string;
  subtitle: string;
  menuSub: HotkeySubMenu[];
}

interface HotkeySubMenu {
  hotKeyType: string;
  label: string;
}

@Component
export class OptionDetailModalBase extends Vue {
  test = '';
  get isShow() {
    return moduleModal.bOptionDetail;
  }
  set isShow(bShow: boolean) {
    moduleModal.ShowOptionDetailModal(bShow);
  }

  get muteOption() {
    return moduleOption.muteOption;
  }

  get hotKey() {
    return moduleOption.hotKey;
  }

  state = new State();

  @Watch('state.selectMenu') //메뉴 넘어갈 때 입력하던 값 초기화
  OnSelectMenuChanged(newMenu: number) {
    this.state.input = '';
    if (newMenu === 6 && !this.state.isInitHotkey) {
      //created에서 호출 시 ref 생성 전이라 오류 생김
      this.SetHotkey();
      this.state.isInitHotkey = true;
    }
  }

  async ClickClose() {
    this.ModalClose();
  }

  async ModalClose() {
    this.isShow = false;
  }

  OnClickClose() {
    this.CloseModal();
    this.SaveHotkey();
    window.preload.SaveOption({
      hotKey: moduleOption.hotKey,
      muteOption: moduleOption.muteOption,
      uiOption: moduleOption.uiOption
    });
  }

  CloseModal() {
    this.isShow = false;
  }

  SaveHotkey() {
    if (!this.state.isInitHotkey) return;
    const map = new Map();
    const anyHotKey = this.hotKey as any;
    for (const key of Object.keys(anyHotKey)) {
      const hotKeyType = (anyHotKey[key] as I.Key).hotkeyType;
      const str = this.GetTextFiledText(hotKeyType);
      const isCtrl = str.indexOf('Ctrl') > -1;
      const isAlt = str.indexOf('Alt') > -1;
      const isShift = str.indexOf('Shift') > -1;
      let code = str
        .replace('Ctrl+', '')
        .replace('Shift+', '')
        .replace('Alt+');
      if (code == 'Space') {
        code = ' ';
      }
      map.set(key, {
        isCtrl: isCtrl,
        isShift: isShift,
        isAlt: isAlt,
        key: code,
        hotkeyType: hotKeyType
      });
    }
    const hotkey = Object.fromEntries(map);
    moduleOption.ChangeHotkey(hotkey);
  }

  OnAdd(list: string[], word: string) {
    this.state.input = '';
    if (list.indexOf(word) === -1)
      //중복 등록 안되게
      list.push(word);
  }

  OnRemove(list: string[], word: string) {
    const index = list.indexOf(word);
    if (index === -1) return;
    list.splice(index, 1);
  }

  OnRemoveTweet(list: I.Tweet[], tweet: I.Tweet) {
    const index = list.indexOf(tweet);
    if (index === -1) return;
    list.splice(index, 1);
  }
  SetHotkey() {
    for (const [key, value] of Object.entries(this.hotKey)) {
      const hotKey = value as I.Key;
      let str = hotKey.isCtrl ? 'Ctrl+' : '';
      str += hotKey.isAlt ? 'Alt+' : '';
      str += hotKey.isShift ? 'Shift+' : '';
      str += hotKey.key.charAt(0).toUpperCase() + hotKey.key.substring(1, 999);
      if (str == ' ') str = 'Space';
      this.SetTextFieldText(hotKey.hotkeyType, str);
    }
  }

  OnKeyDown(e: KeyboardEvent, name: string) {
    if (!e.target) return;
    e.preventDefault();
    let str = '';
    if (e.ctrlKey) {
      str += 'Ctrl+';
    }
    if (e.shiftKey) {
      str += 'Shift+';
    }
    if (e.altKey) {
      str += 'Alt+';
    }
    if (e.code != 'ControlLeft' && e.code != 'ShiftLeft' && e.code != 'AltLeft') {
      const code = e.code.replace('Key', '').replace('Digit', '');
      if (code == ' ') {
        //space의 key는 ' '
        str += 'Space';
      } else {
        str += code.charAt(0).toUpperCase() + code.substring(1, 999); //키는 첫글자만 대문자로. home->Home
      }
    }
    this.SetTextFieldText(name, str);
  }

  GetTextFiledText(refName: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((this.$refs[refName] as Vue[])[0] as any).lazyValue; //이새낀 왜 어레이냐
  }

  SetTextFieldText(refName: string, text: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((this.$refs[refName] as Vue[])[0] as any).lazyValue = text; //이새낀 왜 어레이냐
  }
}
