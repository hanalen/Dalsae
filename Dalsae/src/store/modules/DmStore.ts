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
  constructor() {
    this.listDmPair = [];
  }
}

@Module({ dynamic: true, store, name: 'dm' })
class DmStore extends VuexModule {
  stateDm = new StateDirectMessage();

  @Mutation
  private addDm(dm: I.DMEvent | I.DMEvent[]) {
    let listDm: I.DMEvent[] = [];
    if (!Array.isArray(dm)) {
      listDm.push(dm);
    } else {
      listDm = dm;
    }
    const { selectID } = moduleSwitter;
    listDm.forEach(item => {
      const sender = item.message_create?.sender_id;
      const recv = item.message_create?.target?.recipient_id;
      if (!sender || !recv) return;

      const key = sender === selectID ? recv : sender; //대화 상대 id
      const find = this.stateDm.listDmPair.find(x => x.id === key);
      if (!find) {
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
        this.stateDm.listDmPair.push({ id: key, listDm: [item], user: user });
      } else {
        if (!find.listDm.find(x => x.id === item.id)) {
          const date = new Date(Number.parseInt(item.created_timestamp)).getTime();
          let idx = 0;
          for (let i = 0, len = find.listDm.length; i < len; i++) {
            const next = new Date(Number.parseInt(find.listDm[i].created_timestamp)).getTime();
            if (date > next) {
              break;
            }
            idx = i + 1;
          }
          find.listDm.splice(idx, 0, item);
        } else {
          console.log('dm exists!');
        }
      }
    });
  }

  @Action
  AddDm(dm: I.DMEvent | I.DMEvent[]) {
    this.context.commit('addDm', dm);
  }
}

export const moduleDm = getModule(DmStore);
