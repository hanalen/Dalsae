import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '../DalsaePage';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
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
export class OptionModalBase extends mixins(Vue, DalsaePage) {
  state: State = new State();

  OnClickAddAccount() {
    this.ShowOptionModal();
    this.ShowPin();
  }

  OnClickAccount(account: I.DalsaeUser) {
    this.ShowOptionModal();
    this.AccountChange(account);
  }

  OnClickOption() {
    this.ShowOptionModal();
    moduleModal.ShowOptionDetailModal(true);
  }
}
