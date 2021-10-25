/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as A from '@/store/Interface';
import { moduleSwitter } from './SwitterStore';

@Module({ dynamic: true, store, name: 'modal' })
class ModalStore extends VuexModule {
  // states
  bMessage = false;
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
  private showMessageModal(bShow: boolean) {
    this.bMessage = bShow;
  }
  @Mutation
  private showOptionDetailModal(bShow: boolean) {
    this.bOptionDetail = bShow;
  }
  @Mutation
  private closeAll() {
    this.bPin = false;
    this.bMessage = false;
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
}

export const moduleModal = getModule(ModalStore);
