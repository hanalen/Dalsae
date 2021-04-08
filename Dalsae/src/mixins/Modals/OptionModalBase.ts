import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '../DalsaePage';
import * as I from '@/Interfaces';
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

  OnClickAddAccount(e: MouseEvent) {
    console.log(e);
    this.ShowOptionModal();
    this.ShowPin();
  }

  OnClickAccount(account: I.DalsaeUser) {
    console.log(account);
    this.AccountChange(account);
  }

  OnClickOption(e: MouseEvent) {
    console.log(e);
    this.ShowOptionModal();
    this.ShowOptionDetailModal();
  }
}
