import { Vue, Component, Inject, Emit } from 'vue-property-decorator';

class State {
  selectMenu: number;
  constructor() {
    this.selectMenu = 0;
  }
}
@Component
export class TweetPanelBase extends Vue {
  state: State = new State();

  async MenuChange(menu: number) {
    this.state.selectMenu = menu;
  }
}
