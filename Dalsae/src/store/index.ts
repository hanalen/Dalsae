/* eslint-disable @typescript-eslint/camelcase */
import { ISwitterState } from './modules/SwitterStore';
import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

export interface IRootState {
  switter: ISwitterState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({ getters: {} });
