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

export interface IPanelState {
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
  panels: IPanelState[];
  constructor() {
    this.panels = [];
  }
  get home() {
    return this.panels.find(x => x.tweetType === ETweetType.E_HOME);
  }
  get mention() {
    return this.panels.find(x => x.tweetType === ETweetType.E_MENTION);
  }
  get conv() {
    return this.panels.find(x => x.tweetType === ETweetType.E_CONV);
  }
}

interface StateUI {
  selectMenu: number;
}

@Module({ dynamic: true, store, name: 'ui' })
class UIStore extends VuexModule {
  // states
  constructor(modules: any) {
    super(modules);
    for (const value in ETweetType) {
      this.statePanel.panels.push({
        tweetType: Number.parseInt(value) as ETweetType,
        index: -1,
        selectedId: '',
        isLoad: false
      });
    }
  }
  stateUI: StateUI = { selectMenu: 0 };
  statePanel: StatePanel = new StatePanel();
  stateContext: StateContext = new StateContext();

  stateInput: StateInput = new StateInput();

  get selectTweet() {
    const statePanel = this.statePanel.panels.find(x => x.tweetType === this.stateUI.selectMenu);
    if (!statePanel) return undefined;
    let listTweet: M.ScrollItem<I.Tweet>[] = [];
    switch (this.stateUI.selectMenu) {
      case 0:
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
    return listTweet[statePanel.index];
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
}

export const moduleUI = getModule(UIStore);
