/* eslint-disable @typescript-eslint/camelcase */
import { ITweetStore } from './modules/TweetStore';
import { IOptionStore } from './modules/OptionStore';
import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

export interface IRootState {
  tweet: ITweetStore;
  option: IOptionStore;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({ getters: {} });
