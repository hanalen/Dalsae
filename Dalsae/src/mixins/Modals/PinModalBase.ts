import { Vue, Component, Inject, Emit } from 'vue-property-decorator';

class State {
  isShow: boolean;
  pin: string;
  constructor() {
    this.isShow = false;
    this.pin = '';
  }
}

@Component
export class PinModalBase extends Vue {
  state = new State();
}
