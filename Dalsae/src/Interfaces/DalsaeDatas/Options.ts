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
  hotkeyType: E_HOTKEY;
}

export enum E_HOTKEY {
  SHOWTL = 'SHOWTL',
  SHOWMENTION = 'SHOWMENTION',
  SHOWDM = 'SHOWDM',
  SHOWFAVORITE = 'SHOWFAVORITE',
  SHOWURL = 'SHOWURL',
  REPLY = 'REPLY',
  REPLYALL = 'REPLYALL',
  SENDDM = 'SENDDM',
  LOADING = 'LOADING',
  COPY = 'COPY',
  CANCLE = 'CANCLE',
  LOADCONV = 'LOADCONV',
  SHOWQT = 'SHOWQT',
  RETWEET = 'RETWEET',
  SENDQT = 'SENDQT',
  SENDFAVORITE = 'SENDFAVORITE',
  HASH = 'HASH',
  DELETE = 'DELETE',
  INPUT = 'INPUT',
  SHOWCONTEXT = 'SHOWCONTEXT',
  HOME = 'HOME',
  END = 'END',
  SHOWIMAGE = 'SHOWIMAGE'
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
    this.showTL = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: '1',
      hotkeyType: E_HOTKEY.SHOWTL
    };
    this.showMention = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: '2',
      hotkeyType: E_HOTKEY.SHOWMENTION
    };
    this.showDM = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: '3',
      hotkeyType: E_HOTKEY.SHOWDM
    };
    this.showFavorite = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: '4',
      hotkeyType: E_HOTKEY.SHOWFAVORITE
    };
    this.showUrl = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: '5',
      hotkeyType: E_HOTKEY.SHOWURL
    };
    this.reply = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'r',
      hotkeyType: E_HOTKEY.REPLY
    };
    this.replyAll = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'a',
      hotkeyType: E_HOTKEY.REPLYALL
    };
    this.sendDM = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'd',
      hotkeyType: E_HOTKEY.SENDDM
    };
    this.loading = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: ' ',
      hotkeyType: E_HOTKEY.LOADING
    };
    this.copy = {
      isCtrl: true,
      isAlt: false,
      isShift: false,
      key: 'c',
      hotkeyType: E_HOTKEY.COPY
    };
    this.cancle = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'escape',
      hotkeyType: E_HOTKEY.CANCLE
    };
    this.loadConv = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'c',
      hotkeyType: E_HOTKEY.LOADCONV
    };
    this.showQt = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'x',
      hotkeyType: E_HOTKEY.SHOWQT
    };
    this.retweet = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 't',
      hotkeyType: E_HOTKEY.RETWEET
    };
    this.sendQt = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'w',
      hotkeyType: E_HOTKEY.SENDQT
    };
    this.sendFavorite = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'f',
      hotkeyType: E_HOTKEY.SENDFAVORITE
    };
    this.hash = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'h',
      hotkeyType: E_HOTKEY.HASH
    };
    this.delete = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'delete',
      hotkeyType: E_HOTKEY.DELETE
    };
    this.input = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'u',
      hotkeyType: E_HOTKEY.INPUT
    };
    this.showContext = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'v',
      hotkeyType: E_HOTKEY.SHOWCONTEXT
    };
    this.home = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'home',
      hotkeyType: E_HOTKEY.HOME
    };
    this.end = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'end',
      hotkeyType: E_HOTKEY.END
    };
    this.showImage = {
      isCtrl: false,
      isAlt: false,
      isShift: false,
      key: 'g',
      hotkeyType: E_HOTKEY.SHOWIMAGE
    };
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
