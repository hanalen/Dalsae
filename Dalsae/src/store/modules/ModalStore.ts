/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as A from '@/store/Interface';
import * as M from '@/mixins';
import { moduleSwitter } from './SwitterStore';

class MessageState {
  listMessage: M.Message[];
  bMessage: boolean;
  constructor() {
    this.listMessage = [];
    this.bMessage = false;
  }
}

class StateAutoComplete {
  bAutoComplete: boolean;
  autoCompleteWord: string;
  indexAutoComplete: number;
  constructor() {
    this.bAutoComplete = false;
    this.autoCompleteWord = '';
    this.indexAutoComplete = 0;
  }
}

@Module({ dynamic: true, store, name: 'modal' })
class ModalStore extends VuexModule {
  // states
  stateMessage = new MessageState();
  stateAutoComplete = new StateAutoComplete();
  bPin = false;
  bOptionDetail = false;
  bOption = false;
  message = '';

  get users() {
    if (!this.stateAutoComplete.bAutoComplete) return [];
    const word = this.stateAutoComplete.autoCompleteWord.toUpperCase();
    if (!word) return [];
    if (!moduleSwitter.listFollowing || !moduleSwitter.listFollower) return [];
    const following = moduleSwitter.listFollowing.filter(
      x => x.screen_name.toUpperCase().indexOf(word) > -1 || x.name.toUpperCase().indexOf(word) > -1
    );
    const follower = moduleSwitter.listFollower.filter(
      x => x.screen_name.toUpperCase().indexOf(word) > -1 || x.name.toUpperCase().indexOf(word) > -1
    );
    return following.concat(follower);
  }

  @Action
  ChangeMenu(menu: number) {
    this.context.commit('changeMenu', menu);
  }

  @Mutation
  private showOptionModal(bShow: boolean) {
    this.bOption = bShow;
  }

  @Mutation
  private showPinModal(bShow: boolean) {
    this.bPin = bShow;
  }

  @Mutation
  private showOptionDetailModal(bShow: boolean) {
    this.bOptionDetail = bShow;
  }
  @Mutation
  private closeAll() {
    this.bPin = false;
    this.stateMessage.bMessage = false;
    this.bOptionDetail = false;
  }

  @Action
  ShowPinModal(bShow: boolean) {
    this.context.commit('showPinModal', bShow);
  }

  @Action
  ShowMessageModal(bShow: boolean) {
    this.context.commit('showMessageModal', bShow);
  }
  @Action
  ShowOptionDetailModal(bShow: boolean) {
    this.context.commit('showOptionDetailModal', bShow);
  }
  @Action
  ShowOptionModal(bShow: boolean) {
    this.context.commit('showOptionModal', bShow);
  }

  @Mutation
  private setAutoComplete(state: StateAutoComplete) {
    this.stateAutoComplete = state;
  }

  @Action
  SetAutoComplete(state: StateAutoComplete) {
    this.context.commit('setAutoComplete', state);
  }

  @Action
  CloseAll() {
    this.context.commit('closeAll');
  }

  @Mutation
  private removeMessage(msg: M.Message) {
    const idx = this.stateMessage.listMessage.findIndex(x => x.key === msg.key);
    if (idx > -1) this.stateMessage.listMessage.splice(idx, 1);
  }

  @Mutation
  private addMessage(msg: M.Message) {
    this.stateMessage.listMessage.push(msg);
  }

  @Action
  AddMessage(msg: M.Message) {
    msg.key = Date.now();
    this.context.commit('addMessage', msg);
    if (msg.time > 0) {
      setTimeout(() => {
        this.context.commit('removeMessage', msg);
      }, msg.time * 1000);
    }
  }
}

export const moduleModal = getModule(ModalStore);
