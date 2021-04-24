/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
export interface IOptionStore {
  uiOption: I.UIOption;
  muteOption: I.MuteOption;
  hotKey: I.Hotkey;
}

@Module({ dynamic: true, store, name: 'option' })
class OptionStore extends VuexModule {
  private uiOption!: I.UIOption;
  private muteOption!: I.MuteOption;
  private hotKey!: I.Hotkey;

  // states
  tweetDatas: I.TweetDatas = new I.TweetDatas();

  // getters
  @Mutation
  private changeOption(uiOption: I.UIOption) {
    this.uiOption = uiOption;
  }
  @Mutation
  private changeMuteOption(muteOption: I.MuteOption) {
    this.muteOption = muteOption;
  }
  @Mutation
  private changeHotkey(hotKey: I.Hotkey) {
    this.hotKey = hotKey;
  }
  @Mutation
  private changeOptions(options: IOptionStore) {
    if (options) {
      this.hotKey = options.hotKey;
      this.uiOption = options.uiOption;
      this.muteOption = options.muteOption;
    } else {
      this.uiOption = {
        isBigPropic: true,
        isLoadOrgImg: false,
        isSendCheck: false,
        isSendEnter: true,
        isSendRTCheck: true,
        isSendRTProtected: true,
        isShowBottomPreview: true,
        isShowPreview: true,
        isShowPropic: true,
        isShowTweet: true,
        isSmallInput: false,
        isSmallTweet: false,
        isUseRead: false
      };
      this.muteOption = {
        highlight: [],
        keyword: [],
        tweet: [],
        user: [],
        client: [],
        isMuteMention: true,
        isShowMute: true
      };
      this.hotKey = new I.Hotkey();
    }
  }

  @Action
  ChangeOptions(options: IOptionStore) {
    this.context.commit('changeOptions', options);
  }

  @Action
  ChangeOption(uiOption: I.UIOption) {
    this.context.commit('changeOption', uiOption);
  }
  @Action
  ChangeMuteOption(muteOption: I.MuteOption) {
    this.context.commit('changeMuteOption', muteOption);
  }
  @Action
  ChangeHotkey(hotkey: I.Hotkey) {
    this.context.commit('changeHotkey', hotkey);
  }
}

export const moduleOption = getModule(OptionStore);
