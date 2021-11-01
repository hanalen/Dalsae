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
    this.favorite = {
      tweetType: ETweetType.E_FAVORITE,
      index: -1,
      selectedId: '',
      isLoad: false
    };
    this.open = {
      tweetType: ETweetType.E_OPEN,
      index: -1,
      selectedId: '',
      isLoad: false
    };
    this.conv = {
      tweetType: ETweetType.E_CONV,
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
    let listTweet: I.Tweet[] = [];
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
  Home(tweetType: ETweetType) {
    if (tweetType === ETweetType.E_HOME) {
      const home: IStatePanel = {
        ...this.statePanel.home,
        index: 0,
        selectedId: moduleTweet.homes[0].id_str
      };
      const state: StatePanel = { ...this.statePanel, home: home };
      this.context.commit('setStatePanel', state);
    } else if (tweetType === ETweetType.E_MENTION) {
      const mention: IStatePanel = {
        ...this.statePanel.mention,
        index: 0,
        selectedId: moduleTweet.homes[0].id_str
      };
      const state: StatePanel = { ...this.statePanel, mention: mention };
      this.context.commit('setStatePanel', state);
    }
  }

  @Action
  End(tweetType: ETweetType) {
    if (tweetType === ETweetType.E_HOME) {
      const tweets = moduleTweet.homes;
      const home: IStatePanel = {
        ...this.statePanel.home,
        index: tweets.length - 1,
        selectedId: tweets[tweets.length - 1].id_str
      };
      const state: StatePanel = { ...this.statePanel, home: home };
      this.context.commit('setStatePanel', state);
    }
  }

  @Action
  ChangeSelectTweet(idStr: string) {
    let panel: IStatePanel | undefined = undefined;
    let listTweet: I.Tweet[] | undefined = undefined;
    if (this.stateUI.selectMenu === ETweetType.E_HOME) {
      panel = this.statePanel.home;
      listTweet = moduleTweet.homes;
      if (!panel || !listTweet) return;
      const idx = listTweet.findIndex(x => x.id_str === idStr);
      const home: IStatePanel = {
        ...this.statePanel.home,
        index: idx,
        selectedId: idStr
      };
      const state: StatePanel = { ...this.statePanel, home: home };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_MENTION) {
      panel = this.statePanel.mention;
      listTweet = moduleTweet.mentions;
      if (!panel || !listTweet) return;
      const idx = listTweet.findIndex(x => x.id_str === idStr);
      const mention: IStatePanel = {
        ...this.statePanel.mention,
        index: idx,
        selectedId: idStr
      };
      const state: StatePanel = { ...this.statePanel, mention: mention };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_FAVORITE) {
      panel = this.statePanel.favorite;
      listTweet = moduleTweet.favorites;
      if (!panel || !listTweet) return;
      const idx = listTweet.findIndex(x => x.id_str === idStr);
      const favorite: IStatePanel = {
        ...this.statePanel.home,
        index: idx,
        selectedId: idStr
      };
      const state: StatePanel = { ...this.statePanel, favorite: favorite };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_CONV) {
      panel = this.statePanel.conv;
      listTweet = moduleTweet.convs;
      if (!panel || !listTweet) return;
      const idx = listTweet.findIndex(x => x.id_str === idStr);
      const conv: IStatePanel = {
        ...this.statePanel.conv,
        index: idx,
        selectedId: idStr
      };
      const state: StatePanel = { ...this.statePanel, conv: conv };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_OPEN) {
      panel = this.statePanel.open;
      listTweet = moduleTweet.opens;
      if (!panel || !listTweet) return;
      const idx = listTweet.findIndex(x => x.id_str === idStr);
      const open: IStatePanel = {
        ...this.statePanel.open,
        index: idx,
        selectedId: idStr
      };
      const state: StatePanel = { ...this.statePanel, open: open };
      this.context.commit('setStatePanel', state);
    }
  }

  @Action
  Up(): boolean {
    let panel: IStatePanel | undefined = undefined;
    let listTweet: I.Tweet[] | undefined = undefined;
    if (this.stateUI.selectMenu === ETweetType.E_HOME) {
      panel = this.statePanel.home;
      listTweet = moduleTweet.homes;
      if (!panel || !listTweet) return true;
      const index = panel.index - 1;
      if (index < 0) return true; //focus input
      const home: IStatePanel = {
        ...this.statePanel.home,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, home: home };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_MENTION) {
      panel = this.statePanel.mention;
      listTweet = moduleTweet.mentions;
      if (!panel || !listTweet) return true;
      const index = panel.index - 1;
      if (index < 0) return true; //focus input
      const mention: IStatePanel = {
        ...this.statePanel.mention,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, mention: mention };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_FAVORITE) {
      panel = this.statePanel.favorite;
      listTweet = moduleTweet.favorites;
      if (!panel || !listTweet) return true;
      const index = panel.index - 1;
      if (index < 0) return true; //focus input
      const favorite: IStatePanel = {
        ...this.statePanel.favorite,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, favorite: favorite };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_CONV) {
      panel = this.statePanel.conv;
      listTweet = moduleTweet.convs;
      if (!panel || !listTweet) return true;
      const index = panel.index - 1;
      if (index < 0) return true; //focus input
      const conv: IStatePanel = {
        ...this.statePanel.conv,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, conv: conv };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_OPEN) {
      panel = this.statePanel.open;
      listTweet = moduleTweet.opens;
      if (!panel || !listTweet) return true;
      const index = panel.index - 1;
      if (index < 0) return true; //focus input
      const opens: IStatePanel = {
        ...this.statePanel.open,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, open: opens };
      this.context.commit('setStatePanel', state);
    }
    return false;
  }

  @Action
  Down(): boolean {
    let panel: IStatePanel | undefined = undefined;
    let listTweet: I.Tweet[] | undefined = undefined;
    if (this.stateUI.selectMenu === ETweetType.E_HOME) {
      panel = this.statePanel.home;
      listTweet = moduleTweet.homes;
      if (!panel || !listTweet) return true;
      const index = panel.index + 1;
      const len = listTweet.length;
      if (index >= len) return true; //end
      const home: IStatePanel = {
        ...this.statePanel.home,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, home: home };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_MENTION) {
      panel = this.statePanel.mention;
      listTweet = moduleTweet.mentions;
      if (!panel || !listTweet) return true;
      const index = panel.index + 1;
      const len = listTweet.length;
      if (index >= len) return true; //end
      const mention: IStatePanel = {
        ...this.statePanel.mention,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, mention: mention };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_FAVORITE) {
      panel = this.statePanel.favorite;
      listTweet = moduleTweet.favorites;
      if (!panel || !listTweet) return true;
      const index = panel.index + 1;
      const len = listTweet.length;
      if (index >= len) return true; //end
      const favorite: IStatePanel = {
        ...this.statePanel.favorite,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, favorite: favorite };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_CONV) {
      panel = this.statePanel.conv;
      listTweet = moduleTweet.convs;
      if (!panel || !listTweet) return true;
      const index = panel.index + 1;
      const len = listTweet.length;
      if (index >= len) return true; //end
      const convs: IStatePanel = {
        ...this.statePanel.conv,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, conv: convs };
      this.context.commit('setStatePanel', state);
    } else if (this.stateUI.selectMenu === ETweetType.E_OPEN) {
      panel = this.statePanel.open;
      listTweet = moduleTweet.opens;
      if (!panel || !listTweet) return true;
      const index = panel.index + 1;
      const len = listTweet.length;
      if (index >= len) return true; //end
      const open: IStatePanel = {
        ...this.statePanel.open,
        index: index,
        selectedId: listTweet[index].id_str
      };
      const state: StatePanel = { ...this.statePanel, conv: open };
      this.context.commit('setStatePanel', state);
    }
    return false;
  }
}

export const moduleUI = getModule(UIStore);
