import { Vue, Mixins, Component, Inject, Emit } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
class State {
  isSelected: boolean;
  isFocus: boolean;
  constructor() {
    this.isFocus = false;
    this.isSelected = false;
  }
}

@Component
export class TweetBase extends Mixins(Vue, MIX.DalsaePage) {
  state: State = new State();
  tweet!: I.Tweet;
}
