import { Vue, Mixins, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as M from '@/Managers';
import * as I from '@/Interfaces';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';
import { ETweetType } from '@/store/Interface';
import { IPanelState, moduleUI } from '@/store/modules/UIStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';

@Component
export class TweetPanelBase extends Vue {
  get selectMenu() {
    return moduleUI.selectMenu;
  }
  set selectMenu(menu: number) {
    moduleUI.ChangeMenu(menu);
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
    return moduleUI.panelHome.isLoad;
  }

  get isLoadMention() {
    return moduleUI.panelMention.isLoad;
  }

  get isLoadFavorite() {
    return moduleUI.panelFavorite.isLoad;
  }

  KeyDown(e: KeyboardEvent) {
    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        if (moduleUI.stateContext.isShow) {
          moduleUI.ChageContextIndex(moduleUI.stateContext.index - 1);
        } else {
          this.ArrowUp();
        }
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (moduleUI.stateContext.isShow) {
          moduleUI.ChageContextIndex(moduleUI.stateContext.index + 1);
        } else {
          this.ArrowDown();
        }
      }
    }
  }

  get state() {
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
    return state;
  }

  get listTweet() {
    let listTweet!: MIX.ScrollItem<I.Tweet>[];
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
    return listTweet;
  }

  ArrowUp() {
    const state = this.state;
    const listTweet = this.listTweet;
    let index = state.index - 1;

    if (index >= listTweet.length) index = listTweet.length - 1;
    else if (index < 0) index = 0;
    moduleUI.ChangeIndex({
      tweetType: state.tweetType,
      index: index,
      selectedId: listTweet[index].key
    });
  }

  ArrowDown() {
    const state = this.state;
    const listTweet = this.listTweet;
    let index = state.index + 1;

    if (index >= listTweet.length) index = listTweet.length - 1;
    else if (index < 0) index = 0;
    moduleUI.ChangeIndex({
      tweetType: state.tweetType,
      index: index,
      selectedId: listTweet[index].key
    });
  }
}
