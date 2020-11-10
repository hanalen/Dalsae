import { Vue, Mixins, Component, Inject, Emit } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
class State {
  selectMenu: number;
  constructor() {
    this.selectMenu = 0;
  }
}

@Component
export class TweetPanelBase extends Vue {
  state: State = new State();
  mngTweet!: M.TweetDataManager;

  async MenuChange(menu: number) {
    this.state.selectMenu = menu;
  }

  get tweetHome() {
    return this.mngTweet?.homes;
  }

  get tweetMention() {
    return this.mngTweet?.mentions;
  }

  get dm() {
    return this.mngTweet?.mentions;
  }

  get tweetFavorite() {
    return this.mngTweet?.favorites;
  }

  get tweetOpens() {
    return this.mngTweet?.opens;
  }
}
