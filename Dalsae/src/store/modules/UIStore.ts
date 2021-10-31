/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleSwitter } from './SwitterStore';
import { moduleOption } from './OptionStore';
import { ContextItem } from '@/mixins';

export interface IStatePanel {
  tweetType: ETweetType;
  index: number;
  selectedId: string;
  isLoad: boolean;
}

class StateContext {
  tweet: I.Tweet | undefined;
  index: number;
  maxIndex: number;
  isShow: boolean;
  x: number;
  y: number;
  listContext: ContextItem[];
  constructor() {
    this.tweet = undefined;
    this.index = 0;
    this.maxIndex = 0;
    this.isShow = false;
    this.x = 0;
    this.y = 0;
    this.listContext = [];
  }
}

class StateInput {
  replyTweet: I.Tweet | undefined;
  inputText: string;
  listImage: string[];
  constructor() {
    this.replyTweet = undefined;
    this.inputText = '';
    this.listImage = [];
  }
}

class StatePanel {
  home: IStatePanel;
  mention: IStatePanel;
  constructor() {
    this.home = {
      tweetType: ETweetType.E_HOME,
      index: -1,
      selectedId: '',
      isLoad: false
    };
    this.mention = {
      tweetType: ETweetType.E_MENTION,
      index: -1,
      selectedId: '',
      isLoad: false
    };
  }
}

interface StateUI {
  selectMenu: number;
}

@Module({ dynamic: true, store, name: 'ui' })
class UIStore extends VuexModule {
  // states
  stateUI: StateUI = { selectMenu: 0 };
  statePanel: StatePanel = new StatePanel();
  stateContext: StateContext = new StateContext();

  stateInput: StateInput = new StateInput();

  get selectTweet() {
    let state: IStatePanel | undefined = undefined;
    let listTweet: M.ScrollItem<I.Tweet>[] = [];
    switch (this.stateUI.selectMenu) {
      case 0:
        state = this.statePanel.home;
        listTweet = moduleTweet.homes;
        break;
      case 1:
        listTweet = moduleTweet.mentions;
        break;
      case 3:
        listTweet = moduleTweet.favorites;
        break;
      case 4:
        listTweet = moduleTweet.opens;
        break;
      case 5:
        listTweet = moduleTweet.convs;
        break;
      default:
        listTweet = moduleTweet.homes;
        break;
    }
    if (!state) return undefined;
    else return listTweet[state.index];
  }

  @Mutation
  private setStateUI(state: StateUI) {
    this.stateUI = state;
  }

  @Action
  SetStateUI(state: StateUI) {
    this.context.commit('setStateUI', state);
  }

  @Mutation
  private setStatePanel(state: StatePanel) {
    this.statePanel = state;
  }

  @Action
  SetStatePanel(state: StatePanel) {
    this.context.commit('setStatePanel', state);
  }

  @Mutation
  private setStateContext(state: StateContext) {
    this.stateContext = state;
  }

  @Action
  SetStateContext(state: StateContext) {
    this.context.commit('setStateContext', state);
  }

  @Action
  Home(tweetType: ETweetType) {
    if (tweetType === ETweetType.E_HOME) {
      const home: IStatePanel = {
        ...this.statePanel.home,
        index: 0,
        selectedId: moduleTweet.homes[0].key
      };
      const state: StatePanel = { ...this.statePanel, home: home };
      this.context.commit('setStatePanel', state);
    } else if (tweetType === ETweetType.E_MENTION) {
      const mention: IStatePanel = {
        ...this.statePanel.mention,
        index: 0,
        selectedId: moduleTweet.homes[0].key
      };
      const state: StatePanel = { ...this.statePanel, mention: mention };
      this.context.commit('setStatePanel', state);
    }
  }
}

export const moduleUI = getModule(UIStore);
