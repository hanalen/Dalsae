import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';

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
}
