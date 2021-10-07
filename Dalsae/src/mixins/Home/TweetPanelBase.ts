import { Vue, Mixins, Component, Inject, Emit } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';
import { ETweetType } from '@/store/Interface';
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

  get home() {
    return ETweetType.E_HOME;
  }

  get mention() {
    return ETweetType.E_MENTION;
  }

  get tweetHome() {
    return moduleTweet.homes;
  }

  get tweetMention() {
    return moduleTweet.mentions;
  }

  get dm() {
    return moduleTweet.mentions;
  }

  get tweetFavorite() {
    return moduleTweet.favorites;
  }

  get tweetOpens() {
    return moduleTweet.opens;
  }
}
