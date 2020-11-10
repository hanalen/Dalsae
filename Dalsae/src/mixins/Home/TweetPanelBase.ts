import { Vue, Component, Inject, Emit } from 'vue-property-decorator';

class State {
  selectMenu: number;
  constructor() {
    this.selectMenu = 0;
  }
}

export class TweetPanelBase {
  state: State = new State();

  async MenuChange(menu: number) {
    this.state.selectMenu = menu;
  }
}
