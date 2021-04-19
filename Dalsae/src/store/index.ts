export * from './Interface';

import Vue from 'vue';
import Vuex, { ActionContext, StoreOptions } from 'vuex';
import * as I from '@/Interfaces';
import * as M from '@/Managers';
import * as A from './Interface';
Vue.use(Vuex);

class State {
  uiOption!: I.UIOption;
  muteOption!: I.MuteOption;
  hotkey!: I.Hotkey;
  switter!: I.Switter;
  tempUser!: I.DalsaeUser;
  tweetDatas!: I.TweetDatas;
}
const store: StoreOptions<State> = {
  state: new State(),
  mutations: {
    AddTweetHome(state: State, addTweet: A.AddTweet) {
      state.tweetDatas.AddHome(addTweet.listTweet, addTweet.id_str);
    }
  },
  actions: {
    AddTweetHome({ getters, commit }: ActionContext<State, State>) {
      const addTweet = getters as A.AddTweet;
      commit('AddTweetHome', addTweet);
    }
  },
  modules: {}
};

export default new Vuex.Store(store);
