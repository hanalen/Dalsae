import { Vue, Mixins, Component, Inject, Emit, Provide, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import store from '@/store';
class State {
  isSelected: boolean;
  isFocus: boolean;
  constructor() {
    this.isFocus = false;
    this.isSelected = false;
  }
}
import { eventBus } from '@/plugins/EventBus';

@Component
export class TweetSelectorBase extends Vue {
  state: State = new State();

  @Prop()
  tweet!: I.Tweet;

  @Prop()
  selected = false;

  OnClickTweet(e: MouseEvent) {
    e.preventDefault();
    eventBus.$emit('OnClickTweet', this.tweet.id_str);
  }

  get isSmall() {
    const option = store.state.option.uiOption;
    return option.isSmallTweet && !this.state.isFocus && !this.state.isSelected;
  }

  get isNormal() {
    const option = store.state.option.uiOption;
    return (
      !option.isSmallTweet || (option.isSmallTweet && (this.state.isFocus || this.state.isSelected))
    );
  }
}
