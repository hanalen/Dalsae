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
export class MessageModalBase extends Vue {
  state: State = new State();
  ShowModal(msg: string, title = '알림') {
    this.state.isShow = true;
    this.state.msg = msg;
    this.state.title = title;
    console.log(msg);
    console.log(title);
  }
}
