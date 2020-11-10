import { Vue, Mixins, Component, Inject, Emit } from 'vue-property-decorator';
import * as MIX from '@/mixins';
class State {
  selected: boolean;
  constructor() {
    this.selected = false;
  }
}

@Component
export class TweetSelectorBase extends Mixins(Vue, MIX.DalsaePage) {
  state: State = new State();
}
