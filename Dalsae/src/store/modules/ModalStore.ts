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

@Module({ dynamic: true, store, name: 'modal' })
class ModalStore extends VuexModule {
  // states
  stateMessage = new MessageState();
  bPin = false;
  bOptionDetail = false;
  bOption = false;
  bAutoComplete = false;
  autoCompleteWord = '';
  message = '';
  indexAutoComplete = 0;

  get users() {
    if (!this.bAutoComplete) return [];
    const word = this.autoCompleteWord.toUpperCase();
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
  private setAutoComplete(changeEvent: A.ChangeAutoComplete) {
    this.bAutoComplete = changeEvent.bShow;
    this.autoCompleteWord = changeEvent.word;
    this.indexAutoComplete = 0;
  }

  @Action
  SetAutoComplete(changeEvent: A.ChangeAutoComplete) {
    this.context.commit('setAutoComplete', changeEvent);
  }

  @Mutation
  private setIndexAutoComplete(index: number) {
    this.indexAutoComplete = index;
  }

  @Action
  SetIndexAutoComplete(index: number) {
    this.context.commit('setIndexAutoComplete', index);
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
