/* eslint-disable @typescript-eslint/camelcase */
export * from './Interface';

import Vue from 'vue';
import Vuex, { ActionContext, StoreOptions } from 'vuex';
import * as I from '@/Interfaces';
import * as M from '@/Managers';
import * as A from './Interface';
Vue.use(Vuex);

export class StoreState {
  uiOption!: I.UIOption;
  muteOption!: I.MuteOption;
  hotkey!: I.Hotkey;
  switter!: I.Switter;
  tempUser!: I.DalsaeUser;
  tweetDatas!: I.TweetDatas;
  constructor() {
    this.tweetDatas = new I.TweetDatas();
  }
}

const store: StoreOptions<StoreState> = {
  state: new StoreState(),
  mutations: {
    InitSwitter(state: StoreState, switter: I.Switter) {
      state.switter = switter;
      switter.listUser?.forEach(user => {
        state.tweetDatas.dicTweets.set(user.user_id, new I.Tweets());
      });
    },
    AddUser(state: StoreState, addUser: A.AddUser) {
      const user = state.switter.listUser?.find(x => x.user_id === addUser.userId);
      if (user) {
        state.switter.selectUser = user;
      } else {
        const selUser = state.switter.selectUser;
        selUser.oauth_token = addUser.publicKey;
        selUser.oauth_token_secret = addUser.secretKey;
        selUser.name = addUser.name;
        selUser.screen_name = addUser.screenName;
        selUser.user_id = addUser.userId;
        state.switter.listUser?.push(JSON.parse(JSON.stringify(selUser)));

        state.tweetDatas.dicTweets.set(addUser.userId, new I.Tweets());
      }
    },
    SetKey(state: StoreState, setKey: A.SetKey) {
      state.tempUser = new I.DalsaeUser();
      state.tempUser.oauth_token = setKey.publicKey;
      state.tempUser.oauth_token_secret = setKey.secretKey;
    },
    AddTweet(state: StoreState, addTweet: A.AddTweet) {
      switch (addTweet.type) {
        case A.ETweetType.E_HOME:
          if (addTweet.listTweet) {
            state.tweetDatas.AddHomeList(addTweet.listTweet, addTweet.user_id_str);
          } else {
            state.tweetDatas.AddHome(addTweet.tweet, addTweet.user_id_str);
          }
          break;
        case A.ETweetType.E_MENTION:
          if (addTweet.listTweet) {
            state.tweetDatas.AddMentionList(addTweet.listTweet, addTweet.user_id_str);
          } else {
            state.tweetDatas.AddMention(addTweet.tweet, addTweet.user_id_str);
          }
          break;
        case A.ETweetType.E_DM:
          break;
        case A.ETweetType.E_FAVORITE:
          break;
        case A.ETweetType.E_OPEN:
          break;
      }
    }
  },
  actions: {
    InitSwitter({ getters, commit }: ActionContext<StoreState, StoreState>) {
      console.log('getters');
      console.log(getters);
      commit('InitSwitter', getters as I.Switter);
    },
    AddUser({ getters, commit }: ActionContext<StoreState, StoreState>) {
      commit('AddUser', getters as A.AddUser);
    },
    SetKey({ getters, commit }: ActionContext<StoreState, StoreState>) {
      commit('SetKey', getters as A.SetKey);
    },
    UpdateUserInfo({ getters, commit }: ActionContext<StoreState, StoreState>) {
      const user = getters as I.User;
      commit('UpdateUserInfo', user);
    },
    ChangeAccount({ getters, commit }: ActionContext<StoreState, StoreState>) {
      const user = getters as I.DalsaeUser;
      commit('ChangeAccount', user);
    },
    // UpdateUserInfo({ getters, commit }: ActionContext<StoreState, StoreState>) {

    // },
    AddTweet({ getters, commit }: ActionContext<StoreState, StoreState>) {
      const addTweet = getters as A.AddTweet;
      commit('AddTweet', addTweet);
    }
  },
  getters: {
    selectUser: state => {
      if (state.switter?.selectUser.user_id) {
        return state.switter.selectUser;
      } else {
        return null;
      }
    },
    selectID: state => {
      let id = state.switter?.selectUser.user_id;
      id = id ? id : '';
      return id;
    },
    publicKey: state => {
      return state.switter ? state.switter?.selectUser?.oauth_token : '';
    },
    secretKey: state => {
      return state.switter ? state.switter?.selectUser?.oauth_token_secret : '';
    },
    homes: (state, getters) => {
      const tweets = state.tweetDatas.dicTweets.get(getters.selectID);
      return tweets ? tweets.homes : [];
    }
  }
};

export default new Vuex.Store(store);
