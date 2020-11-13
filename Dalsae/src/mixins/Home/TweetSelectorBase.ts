import { Vue, Mixins, Component, Inject, Emit, Provide, Prop } from 'vue-property-decorator';
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
export class TweetSelectorBase extends Mixins(Vue, MIX.DalsaePage) {
  state: State = new State();

  @Prop()
  tweet!: I.Tweet;

  get isSmall() {
    const option = this.mngOption.uiOption;
    return option.isSmallTweet && !this.state.isFocus && !this.state.isSelected;
  }

  get isNormal() {
    const option = this.mngOption.uiOption;
    return (
      !option.isSmallTweet || (option.isSmallTweet && (this.state.isFocus || this.state.isSelected))
    );
  }
}
