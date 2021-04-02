import * as I from '@/Interfaces';

export class OptionManager {
  uiOption!: I.UIOption;
  muteOption!: I.MuteOption;
  hotKey!: I.Hotkey;
  constructor() {
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
      isMuteMention: true,
      isShowMute: true
    };
    this.hotKey = new I.Hotkey();
  }
}
