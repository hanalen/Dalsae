import { Vue, Mixins, Component, Inject, Emit } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { mixins } from 'vue-class-component';
class State {
  selectMenu: number;
  constructor() {
    this.selectMenu = 0;
  }
}

@Component
export class TweetPanelBase extends Vue {
  state: State = new State();
  mngAccount!: M.AccountManager;
  async MenuChange(menu: number) {
    this.state.selectMenu = menu;
  }

  get tweetHome() {
    return this.mngAccount.homes;
  }

  get tweetMention() {
    return this.mngAccount.mentions;
  }

  get dm() {
    return this.mngAccount.mentions;
  }

  get tweetFavorite() {
    return this.mngAccount.favorites;
  }

  get tweetOpens() {
    return this.mngAccount.opens;
  }
}
