import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';

class State {
  isShow: boolean;
  pin: string;
  constructor() {
    this.isShow = false;
    this.pin = '';
  }
}

@Component
export class OptionDetailModalBase extends mixins(Vue, DalsaePage) {
  state = new State();

  async ShowModal() {
    this.state.isShow = true;
  }

  async ClickClose() {
    this.ModalClose();
  }

  async ModalClose() {
    this.state.isShow = false;
    this.state.pin = '';
  }

  CloseModal() {
    this.state.isShow = false;
  }
}
