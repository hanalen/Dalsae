/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as M from '@/mixins';

class StateDom {
  audio!: HTMLAudioElement;
  textArea!: HTMLTextAreaElement;
}

@Module({ dynamic: true, store, name: 'dom' })
class DomStore extends VuexModule {
  listScrollPanel: M.ScrollPanelBase[] = [];
  stateDom = new StateDom();

  @Mutation
  private updateRTandFav(tweet: I.Tweet) {
    for (const panel of this.listScrollPanel) {
      for (const item of panel.stateData.listData) {
        const currentTweet = item.data as I.Tweet;
        if (currentTweet.orgTweet.id_str === tweet.orgTweet.id_str) {
          currentTweet.orgTweet.retweeted = tweet.retweeted;
          currentTweet.orgTweet.favorited = tweet.favorited;
        }
      }
    }
  }

  @Mutation
  private registeScrollPanel(panel: M.ScrollPanelBase) {
    this.listScrollPanel.push(panel);
  }

  @Action
  RegisteScrollPanel(panel: M.ScrollPanelBase) {
    this.context.commit('registeScrollPanel', panel);
  }

  @Mutation
  private resetScrollDatas() {
    this.listScrollPanel.forEach(item => {
      item.Clear();
    });
  }

  @Action
  ResetScrollDatas() {
    this.context.commit('resetScrollDatas');
  }

  @Mutation
  private registerAudio(audio: HTMLAudioElement) {
    this.stateDom.audio = audio;
  }

  @Action
  RegisterAudio(audio: HTMLAudioElement) {
    this.context.commit('registerAudio', audio);
  }

  @Mutation
  private registerTextArea(text: HTMLTextAreaElement) {
    this.stateDom.textArea = text;
  }

  @Action
  RegisterTextArea(text: HTMLTextAreaElement) {
    this.context.commit('registerTextArea', text);
  }
}

export const moduleDom = getModule(DomStore);
