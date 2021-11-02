import { Vue, Mixins, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';
import { ETweetType } from '@/store/Interface';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { eventBus } from '@/plugins';
import { moduleUtil } from '@/store/modules/UtilStore';

@Component
export class TweetPanelBase extends Vue {
  get selectMenu() {
    return moduleUI.stateUI.selectMenu;
  }
  set selectMenu(menu: number) {
    moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: menu });
  }

  @Watch('selectMenu', { immediate: true, deep: true })
  OnChangeSelectMenu(newVal: number, oldVal: number) {
    if (oldVal === 5) {
      moduleTweet.ClearConv(moduleSwitter.selectID);
    }
  }

  get home() {
    return ETweetType.E_HOME;
  }

  get mention() {
    return ETweetType.E_MENTION;
  }

  get conv() {
    return ETweetType.E_CONV;
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

  get tweetConv() {
    return moduleTweet.convs;
  }

  get tweetOpens() {
    return moduleTweet.opens;
  }

  get isLoadHome() {
    return moduleUI.statePanel.home.isLoad;
  }

  get isLoadMention() {
    return moduleUI.statePanel.mention.isLoad;
  }

  get isLoadFavorite() {
    return moduleUI.statePanel.favorite.isLoad;
  }

  KeyDown(e: KeyboardEvent) {
    if (!moduleUtil.isFocusPanel || document?.activeElement?.tagName === 'TEXTAREA') return;
    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        if (moduleUI.stateContext.isShow) {
          let index = moduleUI.stateContext.index - 1;
          if (index < 0) index = 0;
          moduleUI.SetStateContext({ ...moduleUI.stateContext, index: index });
        } else {
          this.ArrowUp();
        }
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (moduleUI.stateContext.isShow) {
          let index = moduleUI.stateContext.index + 1;
          const maxLen = moduleUI.stateContext.listContext.length;
          if (index >= maxLen) index = maxLen - 1;
          moduleUI.SetStateContext({ ...moduleUI.stateContext, index: index });
        } else {
          this.ArrowDown();
        }
      }
    }
  }

  get listTweet() {
    let listTweet!: I.Tweet[] | undefined;
    switch (this.selectMenu) {
      case 0:
        listTweet = this.tweetHome;
        break;
      case 1:
        listTweet = this.tweetMention;
        break;
      case 2:
        break;
      case 3:
        listTweet = this.tweetFavorite;
        break;
      case 4:
        listTweet = this.tweetOpens;
        break;
      default:
        listTweet = this.tweetHome;
        break;
    }
    return listTweet !== undefined ? listTweet : [];
  }

  async ArrowUp() {
    if (this.listTweet.length === 0) {
      eventBus.$emit('FocusInput');
      return;
    }
    if (await moduleUI.Up()) {
      eventBus.$emit('FocusInput');
    }
  }

  async ArrowDown() {
    if (this.listTweet.length === 0) return;
    await moduleUI.Down();
  }
}
