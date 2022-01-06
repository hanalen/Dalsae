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
import { moduleDom } from './DomStore';
import { moduleUtil } from './UtilStore';

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
  video: string;
  constructor() {
    this.replyTweet = undefined;
    this.inputText = '';
    this.listImage = [];
    this.video = '';
  }
}

export class StatePanel {
  listIcon = [
    {
      name: 'mdi-home',
      value: 0
    },
    {
      name: 'mdi-bell-outline',
      value: 1
    },
    {
      name: 'mdi-email-outline',
      value: 2
    },
    {
      name: 'mdi-heart-outline',
      value: 3
    },
    {
      name: 'mdi-link',
      value: 4
    }
  ];
  home: IStatePanel;
  mention: IStatePanel;
  favorite: IStatePanel;
  open: IStatePanel;
  conv: IStatePanel;
  user: IStatePanel;
  constructor() {
    this.home = {
      tweetType: ETweetType.E_HOME,
      index: 0,
      selectedId: '',
      isLoad: false
    };
    this.mention = {
      tweetType: ETweetType.E_MENTION,
      index: 0,
      selectedId: '',
      isLoad: false
    };
    this.favorite = {
      tweetType: ETweetType.E_FAVORITE,
      index: 0,
      selectedId: '',
      isLoad: false
    };
    this.open = {
      tweetType: ETweetType.E_OPEN,
      index: 0,
      selectedId: '',
      isLoad: false
    };
    this.conv = {
      tweetType: ETweetType.E_CONV,
      index: 0,
      selectedId: '',
      isLoad: false
    };
    this.user = {
      tweetType: ETweetType.E_USER,
      index: 0,
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

  get minHeight() {
    return 30;
  }

  get selectTweet() {
    let state: IStatePanel | undefined = undefined;
    let listTweet: I.Tweet[] | undefined = [];
    switch (this.stateUI.selectMenu) {
      case ETweetType.E_HOME:
        state = this.statePanel.home;
        listTweet = moduleTweet.homes;
        break;
      case ETweetType.E_MENTION:
        state = this.statePanel.mention;
        listTweet = moduleTweet.mentions;
        break;
      case ETweetType.E_FAVORITE:
        state = this.statePanel.favorite;
        listTweet = moduleTweet.favorites;
        break;
      case ETweetType.E_OPEN:
        state = this.statePanel.open;
        listTweet = moduleTweet.opens;
        break;
      case ETweetType.E_CONV:
        state = this.statePanel.conv;
        listTweet = moduleTweet.convs;
        break;
      case ETweetType.E_USER:
        state = this.statePanel.user;
        listTweet = moduleTweet.userTweets;
        break;
      default:
        listTweet = moduleTweet.homes;
        break;
    }
    if (!state || !listTweet) return undefined;
    else return listTweet[state.index];
  }

  get selectTweetList() {
    switch (this.stateUI.selectMenu) {
      case ETweetType.E_HOME:
        return moduleTweet.homes;
      case ETweetType.E_MENTION:
        return moduleTweet.mentions;
      case ETweetType.E_FAVORITE:
        return moduleTweet.favorites;
      case ETweetType.E_OPEN:
        return moduleTweet.opens;
      case ETweetType.E_CONV:
        return moduleTweet.convs;
      case ETweetType.E_USER:
        return moduleTweet.userTweets;
    }
    return moduleTweet.homes;
  }

  get selectPanel() {
    switch (this.stateUI.selectMenu) {
      case ETweetType.E_HOME:
        return this.statePanel.home;
      case ETweetType.E_MENTION:
        return this.statePanel.mention;
      case ETweetType.E_FAVORITE:
        return this.statePanel.favorite;
      case ETweetType.E_CONV:
        return this.statePanel.conv;
      case ETweetType.E_OPEN:
        return this.statePanel.open;
      case ETweetType.E_USER:
        return this.statePanel.user;
    }
    return this.statePanel.home;
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
  private setStateInput(state: StateInput) {
    this.stateInput = state;
  }

  @Action
  SetStateInput(state: StateInput) {
    this.context.commit('setStateInput', state);
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
  ChangeSelectTweet(idStr: string) {
    let panel: IStatePanel | undefined = undefined;
    let listTweet: I.Tweet[] | undefined = undefined;

    if (this.stateUI.selectMenu === ETweetType.E_HOME) {
      panel = this.statePanel.home;
      listTweet = moduleTweet.homes;
    } else if (this.stateUI.selectMenu === ETweetType.E_MENTION) {
      panel = this.statePanel.mention;
      listTweet = moduleTweet.mentions;
    } else if (this.stateUI.selectMenu === ETweetType.E_FAVORITE) {
      panel = this.statePanel.favorite;
      listTweet = moduleTweet.favorites;
    } else if (this.stateUI.selectMenu === ETweetType.E_CONV) {
      panel = this.statePanel.conv;
      listTweet = moduleTweet.convs;
    } else if (this.stateUI.selectMenu === ETweetType.E_OPEN) {
      panel = this.statePanel.open;
      listTweet = moduleTweet.opens;
    } else if (this.stateUI.selectMenu === ETweetType.E_USER) {
      panel = this.statePanel.user;
      listTweet = moduleTweet.userTweets;
    }
    let idx = 0;
    if (!panel || !listTweet) return;
    idx = listTweet.findIndex(x => x.id_str === idStr);
    moduleUtil.ScrollToIndex(idx);
  }

  @Mutation
  private resetScrollDatas() {
    this.statePanel = new StatePanel();
  }
}

export const moduleUI = getModule(UIStore);
