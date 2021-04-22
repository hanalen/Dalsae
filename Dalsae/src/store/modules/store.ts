/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import * as M from '@/Managers';

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

function selectUser(state: StoreState) {
  if (state.switter?.selectUser.user_id) {
    return state.switter.selectUser;
  } else {
    return null;
  }
}

function selectID(state: StoreState) {
  let id = state.switter?.selectUser.user_id;
  id = id ? id : '';
  return id;
}

function publicKey(state: StoreState) {
  return state.switter ? state.switter?.selectUser?.oauth_token : '';
}

function secretKey(state: StoreState) {
  return state.switter ? state.switter?.selectUser?.oauth_token_secret : '';
}

function homes(state: StoreState) {
  const tweets = state.tweetDatas.dicTweets.get('');
  return tweets ? tweets.homes : [];
}

const store = new StoreState();

export default {
  state: store,
  getters: {
    selectUser,
    selectID,
    publicKey,
    secretKey,
    homes
  },
  mutations: {},
  actions: {}
};
