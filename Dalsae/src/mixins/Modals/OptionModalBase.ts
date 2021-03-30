import { Vue, Component, Inject, Emit } from 'vue-property-decorator';

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
  // isShow = false;
}
