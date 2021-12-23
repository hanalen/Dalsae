/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import * as M from '@/mixins';
import { ETweetType, RegisterPanel } from '../Interface';
import { moduleUI } from './UIStore';

class StateDom {
  audio!: HTMLAudioElement;
  textArea!: HTMLTextAreaElement;
  textAreaheight: number;
  constructor() {
    this.textAreaheight = 0;
  }
}

interface ScrollPanel {
  panelType: ETweetType;
  panel: M.ScrollPanelBase;
}

class StateScrollPanel {
  listScrollPanel: ScrollPanel[] = [];

  ScrollToIndex(index: number) {
    const pair = this.listScrollPanel.find(x => x.panelType === moduleUI.stateUI.selectMenu);
    if (!pair) return;
    pair.panel.ScrollToIndex(index);
  }

  Add(type: ETweetType, panel: M.ScrollPanelBase) {
    this.listScrollPanel.push({ panelType: type, panel: panel });
  }
}

@Module({ dynamic: true, store, name: 'dom' })
class DomStore extends VuexModule {
  stateScrollPanel = new StateScrollPanel();
  stateDom = new StateDom();

  get scrollHome() {
    return this.stateScrollPanel.listScrollPanel.find(x => x.panelType === ETweetType.E_HOME);
  }

  get scrollMention() {
    return this.stateScrollPanel.listScrollPanel.find(x => x.panelType === ETweetType.E_MENTION);
  }

  get scrollFavorite() {
    return this.stateScrollPanel.listScrollPanel.find(x => x.panelType === ETweetType.E_FAVORITE);
  }

  get scrollOpen() {
    return this.stateScrollPanel.listScrollPanel.find(x => x.panelType === ETweetType.E_OPEN);
  }

  get scrollConv() {
    return this.stateScrollPanel.listScrollPanel.find(x => x.panelType === ETweetType.E_CONV);
  }

  @Mutation
  private updateRTandFav(tweet: I.Tweet) {
    for (const panel of this.stateScrollPanel.listScrollPanel) {
      for (const item of panel.panel.stateData.listData) {
        const currentTweet = item.data as I.Tweet;
        if (currentTweet.orgTweet.id_str === tweet.orgTweet.id_str) {
          currentTweet.orgTweet.retweeted = tweet.retweeted;
          currentTweet.orgTweet.favorited = tweet.favorited;
          item.isResized = true;
        }
      }
    }
  }

  @Mutation
  private registeScrollPanel(panel: RegisterPanel) {
    this.stateScrollPanel.Add(panel.panelType, panel.panel);
  }

  @Action
  RegisteScrollPanel(panel: RegisterPanel) {
    this.context.commit('registeScrollPanel', panel);
  }

  @Mutation
  private resetScrollDatas() {
    for (const panel of this.stateScrollPanel.listScrollPanel) {
      panel.panel.Clear();
    }
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

  @Mutation
  private deleteTweet(tweet: I.Tweet) {
    for (const panel of this.stateScrollPanel.listScrollPanel) {
      const find = panel.panel.stateData.listData.find(x => x.key === tweet.id_str);
      if (find) {
        const t = find.data as I.Tweet;
        t.isDelete = true;
        break;
      }
    }
  }

  @Action
  DeleteTweet(tweet: I.Tweet) {
    this.context.commit('deleteTweet', tweet);
  }

  @Mutation
  private setTextAreaHeight(height: number) {
    this.stateDom.textAreaheight = height;
  }

  @Action
  SetTextAreaHeight(height: number) {
    this.context.commit('setTextAreaHeight', height);
  }
}

export const moduleDom = getModule(DomStore);
