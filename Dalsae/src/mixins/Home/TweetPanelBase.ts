import { Vue, Mixins, Component, Inject, Emit } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';
import { ETweetType } from '@/store/Interface';
import { IPanelState, moduleUI } from '@/store/modules/UIStore';

@Component
export class TweetPanelBase extends Vue {
  get selectMenu() {
    return moduleUI.selectMenu;
  }
  set selectMenu(menu: number) {
    moduleUI.ChangeMenu(menu);
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

  KeyDown(e: KeyboardEvent) {
    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.ArrowUp();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.ArrowDown();
      }
    }
  }

  ArrowUp() {
    let state!: IPanelState;
    switch (this.selectMenu) {
      case 0:
        state = moduleUI.panelHome;
        break;
      case 1:
        state = moduleUI.panelMention;
        break;
      case 2:
        state = moduleUI.panelDm;
        break;
      case 3:
        state = moduleUI.panelFavorite;
        break;
      case 4:
        state = moduleUI.panelOpen;
        break;
      default:
        state = moduleUI.panelHome;
        break;
    }
    moduleUI.ChangeIndex({ tweetType: state.tweetType, index: state.index - 1 });
  }

  ArrowDown() {
    let state!: IPanelState;
    switch (this.selectMenu) {
      case 0:
        state = moduleUI.panelHome;
        break;
      case 1:
        state = moduleUI.panelMention;
        break;
      case 2:
        state = moduleUI.panelDm;
        break;
      case 3:
        state = moduleUI.panelFavorite;
        break;
      case 4:
        state = moduleUI.panelOpen;
        break;
      default:
        state = moduleUI.panelHome;
        break;
    }
    moduleUI.ChangeIndex({ tweetType: state.tweetType, index: state.index + 1 });
  }
}
