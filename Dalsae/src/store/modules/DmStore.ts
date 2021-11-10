/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as M from '@/mixins';
import { moduleSwitter } from './SwitterStore';

interface DmPair {
  id: string; //key
  user: I.User; //대화 상대 정보
  listDm: I.DMEvent[]; //list dm
}

class StateDirectMessage {
  listDmPair: DmPair[];
  selectUser: I.User;
  constructor() {
    this.listDmPair = [];
    this.selectUser = new I.User();
  }
}

@Module({ dynamic: true, store, name: 'dm' })
class DmStore extends VuexModule {
  stateDm = new StateDirectMessage();

  get listUser() {
    return this.stateDm.listDmPair.map(x => x.user);
  }

  get listDm() {
    const pair = this.stateDm.listDmPair.find(x => x.id === this.stateDm.selectUser.id_str);
    if (pair) {
      return pair.listDm;
    } else {
      return [];
    }
  }

  @Mutation
  private addDm(dm: I.DMEvent | I.DMEvent[]) {
    let listDm: I.DMEvent[] = [];
    if (!Array.isArray(dm)) {
      listDm.push(dm);
    } else {
      listDm = dm;
    }
    const { selectID } = moduleSwitter;
    for (const dm of listDm) {
      const sender = dm.message_create?.sender_id;
      const recv = dm.message_create?.target?.recipient_id;
      if (!sender || !recv) continue;

      const key = sender === selectID ? recv : sender; //대화 상대 id
      let pair = this.stateDm.listDmPair.find(x => x.id === key);
      if (!pair) {
        //첫 대화 add
        let user: I.User | undefined;
        //내 팔로잉, 팔로워일 경우 user정보 땡겨옴
        user = moduleSwitter.listFollower.find(x => x.id_str === key);
        if (!user) user = moduleSwitter.listFollowing.find(x => x.id_str === key);
        if (!user) {
          //팔로잉, 워가 아닌 사람과의 dm, user정보 요청 해야 함....
          user = new I.User();
          user.id_str = key;
        }
        pair = { id: key, listDm: [], user: user };
        this.stateDm.listDmPair.push(pair);
      }
      pair.listDm.push(dm);
      pair.user.last_direct_message = dm;
    }
    this.stateDm.listDmPair.sort((a, b) => {
      let c = 0;
      let d = 0;
      if (a.user.last_direct_message?.created_timestamp) {
        c = Number.parseInt(a.user.last_direct_message?.created_timestamp);
      }
      if (b.user.last_direct_message?.created_timestamp) {
        d = Number.parseInt(b.user.last_direct_message?.created_timestamp);
      }
      return d - c;
    });
    for (const pair of this.stateDm.listDmPair) {
      pair.listDm.sort((a, b) => {
        const c = Number.parseInt(a.created_timestamp);
        const d = Number.parseInt(b.created_timestamp);
        return c - d;
      });
    }
    for (const pair of this.stateDm.listDmPair) {
      pair.user.last_direct_message = pair.listDm[pair.listDm.length - 1];
    }
  }

  @Action
  AddDm(dm: I.DMEvent | I.DMEvent[]) {
    this.context.commit('addDm', dm);
  }

  @Mutation
  private changeSelectUser(user: I.User) {
    this.stateDm.selectUser = user;
  }

  @Action
  ChangeSelectUser(user: I.User) {
    this.context.commit('changeSelectUser', user);
  }
}

export const moduleDm = getModule(DmStore);
