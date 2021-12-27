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
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleDom } from '@/store/modules/DomStore';

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
    if (oldVal === 5 && newVal !== 5) {
      moduleTweet.ClearConv(moduleSwitter.selectID);
    }
  }

  get home() {
    return ETweetType.E_HOME;
  }

  get mention() {
    return ETweetType.E_MENTION;
  }

  get open() {
    return ETweetType.E_OPEN;
  }

  get favorite() {
    return ETweetType.E_FAVORITE;
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

  get tweetOpen() {
    return moduleTweet.opens;
  }

  get isLoadHome() {
    return moduleUI.statePanel.home.isLoad;
  }

  get isLoadMention() {
    return moduleUI.statePanel.mention.isLoad;
  }

  get isLoadConv() {
    return moduleUI.statePanel.conv.isLoad;
  }

  get isLoadFavorite() {
    return moduleUI.statePanel.favorite.isLoad;
  }
  get indexHome() {
    return moduleUI.statePanel.home.index;
  }
  get indexMention() {
    return moduleUI.statePanel.mention.index;
  }
  get indexFavorite() {
    return moduleUI.statePanel.favorite.index;
  }
  get indexOpen() {
    return moduleUI.statePanel.open.index;
  }
  get indexConv() {
    return moduleUI.statePanel.conv.index;
  }

  get stylePanel() {
    if (moduleOption.uiOption.isSmallInput) {
      return {
        height: 'calc(100vh - 99px)'
      };
    } else {
      return {
        height: 'calc(100vh - 156px)'
      };
    }
  }

  KeyDown(e: KeyboardEvent) {
    if (!moduleUtil.isFocusPanel || document?.activeElement?.tagName === 'TEXTAREA') return;
    if (!e.altKey && !e.shiftKey) {
      if (e.code === 'ArrowUp' && !e.ctrlKey) {
        e.preventDefault();
        if (moduleUI.stateContext.isShow) {
          let index = moduleUI.stateContext.index - 1;
          if (index < 0) index = 0;
          moduleUI.SetStateContext({ ...moduleUI.stateContext, index: index });
        } else {
          this.ArrowUp();
        }
      } else if (e.code === 'ArrowDown' && !e.ctrlKey) {
        e.preventDefault();
        if (moduleUI.stateContext.isShow) {
          let index = moduleUI.stateContext.index + 1;
          const maxLen = moduleUI.stateContext.listContext.length;
          if (index >= maxLen) index = maxLen - 1;
          moduleUI.SetStateContext({ ...moduleUI.stateContext, index: index });
        } else {
          this.ArrowDown();
        }
      } else if (e.code === 'ArrowUp' && e.ctrlKey && !moduleUI.stateContext.isShow) {
        const tweet = moduleUI.selectTweet;
        if (!tweet) return;
        const tweets = moduleUI.selectTweetList;
        if (!tweets) return;
        const idx = tweets.findIndex(x => x.id === tweet.id);
        for (let i = idx - 1; i > -1; i--) {
          if (tweets[i].user.id === tweet.user.id) {
            moduleUtil.ScrollToIndex(i);
            break;
          }
        }
      } else if (e.code === 'ArrowDown' && e.ctrlKey && !moduleUI.stateContext.isShow) {
        const tweet = moduleUI.selectTweet;
        if (!tweet) return;
        const tweets = moduleUI.selectTweetList;
        if (!tweets) return;
        const idx = tweets.findIndex(x => x.id === tweet.id);
        for (let i = idx + 1; i < tweets.length; i++) {
          if (tweets[i].user.id === tweet.user.id) {
            moduleUtil.ScrollToIndex(i);
            break;
          }
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
        listTweet = this.tweetOpen;
        break;
      default:
        listTweet = this.tweetHome;
        break;
    }
    return listTweet !== undefined ? listTweet : [];
  }

  ArrowUp() {
    if (this.listTweet.length === 0) {
      moduleDom.stateDom.textArea.focus();
      return;
    }
    const idx = moduleUI.selectPanel.index;
    if (idx === 0) moduleDom.stateDom.textArea.focus();
    else moduleUtil.ScrollToIndex(idx - 1);
  }

  ArrowDown() {
    if (this.listTweet.length === 0) return;
    const idx = moduleUI.selectPanel.index;
    moduleUtil.ScrollToIndex(idx + 1);
  }
}
