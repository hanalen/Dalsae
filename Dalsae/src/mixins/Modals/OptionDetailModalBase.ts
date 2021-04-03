import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';
import * as I from '@/Interfaces';
class State {
  isShow: boolean;
  selectMenu: number;
  listMenu: ModalMenu[];
  selectWord: string;
  input: string;
  constructor() {
    this.isShow = false;
    this.selectMenu = 0;
    this.listMenu = [];
    this.selectWord = '';
    this.input = '';
    const menu1: ModalMenu = {
      title: '필터링 설정',
      subTitle: '트윗을 필터링 해줍니다',
      menuSub: []
    };
    menu1.menuSub.push({ title: '단어 뮤트', icon: 'mdi-filter', menuNumber: 0 });
    menu1.menuSub.push({ title: '사용자 뮤트', icon: 'mdi-account-off', menuNumber: 1 });
    menu1.menuSub.push({ title: '클라이언트 뮤트', icon: 'mdi-filter', menuNumber: 2 });
    menu1.menuSub.push({ title: '트윗 뮤트', icon: 'mdi-filter', menuNumber: 3 });
    this.listMenu.push(menu1);
    const menu2: ModalMenu = {
      title: '단축키 설정',
      subTitle: '프로그램을 보다 편하게 ',
      menuSub: []
    };
    menu2.menuSub.push({ title: '단축키 설정', icon: 'mdi-filter', menuNumber: 4 });
    this.listMenu.push(menu2);
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

@Component
export class OptionDetailModalBase extends mixins(Vue, DalsaePage) {
  state = new State();
  muteOption = this.mngOption.muteOption;
  hotKey = this.mngOption.hotKey;

  @Watch('state.selectMenu') //메뉴 넘어갈 때 입력하던 값 초기화
  OnSelectMenuChanged() {
    this.state.input = '';
  }

  async ShowModal() {
    this.state.isShow = true;
  }

  async ClickClose() {
    this.ModalClose();
  }

  async ModalClose() {
    this.state.isShow = false;
  }

  CloseModal() {
    this.state.isShow = false;
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
    console.log(list);
    console.log(tweet);
    const index = list.indexOf(tweet);
    if (index === -1) return;
    list.splice(index, 1);
  }
  SetHotkey() {
    for (const [key, value] of Object.entries(this.hotKey)) {
      console.log(value);
      let str = value.isCtrl ? 'Ctrl+' : '';
      str += value.isAlt ? 'Alt+' : '';
      str += value.isShift ? 'Shift+' : '';
      str += value.key.charAt(0).toUpperCase() + value.key.substring(1, 999);
      if (str == ' ') str = 'Space';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs[key] as any).lazyValue = str;
    }
  }

  OnKeyDown(e: KeyboardEvent, name: string) {
    if (!e.target) return;
    console.log(e);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs[name] as any).lazyValue = str;
  }
}
