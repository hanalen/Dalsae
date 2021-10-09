import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
class State {
  isShow: boolean;
  msg: string;
  title: string;
  buttons: string[];
  constructor() {
    this.isShow = false;
    this.msg = '';
    this.title = '';
    this.buttons = [];
  }
}
@Component
export class OptionModalBase extends Vue {
  state: State = new State();

  OnClickAddAccount() {
    moduleModal.ShowOptionModal(true);
    moduleModal.ShowPinModal(true);
  }

  OnClickAccount(account: I.DalsaeUser) {
    moduleModal.ShowOptionModal(true);
    moduleSwitter.ChangeAccount(account);
  }

  OnClickOptionDetail() {
    moduleModal.ShowOptionModal(false);
    moduleModal.ShowOptionDetailModal(true);
  }
}
