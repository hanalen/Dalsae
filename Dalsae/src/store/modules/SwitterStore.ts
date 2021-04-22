/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as A from '@/store/Interface';
import store from '@/store';
// export class StoreState {
//   uiOption!: I.UIOption;
//   muteOption!: I.MuteOption;
//   hotkey!: I.Hotkey;
//   switter!: I.Switter;
//   tempUser!: I.DalsaeUser;
//   tweetDatas!: I.TweetDatas;
//   constructor() {
//     this.tweetDatas = new I.TweetDatas();
//   }
// }

export interface ISwitterState {
  switter: I.Switter;
}

@Module({ dynamic: true, store, name: 'switter' })
class SwitterStore extends VuexModule {
  // states
  public switter!: I.Switter;

  // getters
  get selectID() {
    let id = this.switter?.selectUser.user_id;
    id = id ? id : '';
    return id;
  }

  // mutations
  @Mutation
  public increment(delta: number) {
    console.log(`increment mutation: ${delta}`);
    // this.count += delta;
  }

  @Action({ commit: 'SetKey' })
  public SetKey(setKey: A.SetKey) {
    console.log('set key!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(setKey);
  }

  // actions
  @Action({ commit: 'increment' })
  public incr(delta: number) {
    console.log(`increment action: ${delta}`);
    return delta;
  }
}

export const moduleSwitter = getModule(SwitterStore);
