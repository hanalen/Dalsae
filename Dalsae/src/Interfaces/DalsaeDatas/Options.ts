import * as I from '@/Interfaces';
export interface UIOption {
  isSmallTweet: boolean; //트윗 한줄 표시
  isShowPropic: boolean; //인장 표시
  isBigPropic: boolean; //인장 크게 표시
  isShowPreview: boolean; //이미지 미리보기 표시
  isUseRead: boolean; //읽은 트윗 여부

  isSmallInput: boolean; //트윗 입력칸 작게 표시

  isSendEnter: boolean; //enter키로 트윗 전송
  isSendCheck: boolean; //트윗 전송 시 확인
  isSendRTProtected: boolean; //플텍계 트윗 rt
  isSendRTCheck: boolean; //rt 시 확인 창

  isShowTweet: boolean; //이미지 뷰어 트윗 표시
  isShowBottomPreview: boolean; //이미지 뷰어 하단 미리보기 표시
  isLoadOrgImg: boolean; //이미지 뷰어 원본 불러오기
}

export interface Key {
  isCtrl: boolean;
  isShift: boolean;
  isAlt: boolean;
  key: string;
}

export class Hotkey {
  showTL: Key;
  showMention: Key;
  showDM: Key;
  showFavorite: Key;
  showUrl: Key;

  reply: Key;
  replyAll: Key;
  sendDM: Key;

  loading: Key;
  copy: Key;
  cancle: Key;

  loadConv: Key;
  showQt: Key;
  retweet: Key;
  sendQt: Key;
  sendFavorite: Key;
  hash: Key;
  delete: Key;

  input: Key;
  showContext: Key;
  home: Key;
  end: Key;
  showImage: Key;

  constructor() {
    this.showTL = { isCtrl: false, isAlt: false, isShift: false, key: '1' };
    this.showMention = { isCtrl: false, isAlt: false, isShift: false, key: '2' };
    this.showDM = { isCtrl: false, isAlt: false, isShift: false, key: '3' };
    this.showFavorite = { isCtrl: false, isAlt: false, isShift: false, key: '4' };
    this.showUrl = { isCtrl: false, isAlt: false, isShift: false, key: '5' };
    this.reply = { isCtrl: false, isAlt: false, isShift: false, key: 'r' };
    this.replyAll = { isCtrl: false, isAlt: false, isShift: false, key: 'a' };
    this.sendDM = { isCtrl: false, isAlt: false, isShift: false, key: 'd' };
    this.loading = { isCtrl: false, isAlt: false, isShift: false, key: ' ' };
    this.copy = { isCtrl: true, isAlt: false, isShift: false, key: 'c' };
    this.cancle = { isCtrl: false, isAlt: false, isShift: false, key: 'escape' };
    this.loadConv = { isCtrl: false, isAlt: false, isShift: false, key: 'c' };
    this.showQt = { isCtrl: false, isAlt: false, isShift: false, key: 'x' };
    this.retweet = { isCtrl: false, isAlt: false, isShift: false, key: 't' };
    this.sendQt = { isCtrl: false, isAlt: false, isShift: false, key: 'w' };
    this.sendFavorite = { isCtrl: false, isAlt: false, isShift: false, key: 'f' };
    this.hash = { isCtrl: false, isAlt: false, isShift: false, key: 'h' };
    this.delete = { isCtrl: false, isAlt: false, isShift: false, key: 'delete' };
    this.input = { isCtrl: false, isAlt: false, isShift: false, key: 'u' };
    this.showContext = { isCtrl: false, isAlt: false, isShift: false, key: 'v' };
    this.home = { isCtrl: false, isAlt: false, isShift: false, key: 'home' };
    this.end = { isCtrl: false, isAlt: false, isShift: false, key: 'end' };
    this.showImage = { isCtrl: false, isAlt: false, isShift: false, key: 'g' };
  }
}

export interface MuteOption {
  user: string[];
  keyword: string[];
  client: string[];
  tweet: I.Tweet[];
  highlight: string[];
  isMuteMention: boolean; //멘션함도 뮤트
  isShowMute: boolean; //뮤트된 트윗 우선 표시 여부
}
