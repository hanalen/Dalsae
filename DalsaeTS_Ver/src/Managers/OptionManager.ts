// import * as I from '@/Interfaces';

// export class OptionManager {
//   uiOption!: I.UIOption;
//   muteOption!: I.MuteOption;
//   hotKey!: I.Hotkey;
//   constructor() {
//     this.uiOption = {
//       isBigPropic: true,
//       isLoadOrgImg: false,
//       isSendCheck: false,
//       isSendEnter: true,
//       isSendRTCheck: true,
//       isSendRTProtected: true,
//       isShowBottomPreview: true,
//       isShowPreview: true,
//       isShowPropic: true,
//       isShowTweet: true,
//       isSmallInput: false,
//       isSmallTweet: false,
//       isUseRead: false
//     };
//     this.muteOption = {
//       highlight: [],
//       keyword: [],
//       tweet: [],
//       user: [],
//       client: [],
//       isMuteMention: true,
//       isShowMute: true
//     };
//     this.hotKey = new I.Hotkey();
//   }

//   ChangeOptions(options: OptionManager) {
//     this.uiOption = options.uiOption;
//     this.muteOption = options.muteOption;
//     this.hotKey = options.hotKey;
//   }

//   ChangeOption(uiOption: I.UIOption) {
//     this.uiOption = uiOption;
//   }
//   ChangeMuteOption(muteOption: I.MuteOption) {
//     this.muteOption = muteOption;
//   }
//   ChangeHotkey(hotkey: I.Hotkey) {
//     this.hotKey = hotkey;
//   }
// }
