/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Inject, Emit, Provide, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import store from '@/store';
class State {
  isFocus: boolean;
  constructor() {
    this.isFocus = false;
  }
}
import { eventBus } from '@/plugins/EventBus';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleUtil } from '@/store/modules/UtilStore';

export interface ContextItem {
  title: string;
  hotKey?: string;
  onClick: (value: number) => void;
  value?: number;
  isDivider: boolean;
}
@Component
export class TweetSelectorBase extends Vue {
  state: State = new State();

  @Prop()
  tweet!: I.Tweet;

  @Prop()
  selected = false;

  OnClickTweet(e: MouseEvent) {
    e.preventDefault();
    eventBus.$emit('OnClickTweet', this.tweet.id_str);
  }

  get x() {
    return moduleUI.stateContext.x;
  }
  get y() {
    return moduleUI.stateContext.y;
  }

  get isShowContext() {
    return moduleUI.stateContext.isShow && moduleUI.stateContext.tweet.id_str === this.tweet.id_str;
  }
  set isShowContext(isShow: boolean) {
    if (isShow) eventBus.$emit('OnClickTweet', this.tweet.id_str);
    const { x, y } = moduleUI.stateContext;
    moduleUI.OnContext({ x: x, y: y, isShow: isShow, maxIndex: 0, listContext: this.listContext });
  }

  get contextIndex() {
    return moduleUI.stateContext.index;
  }

  set contextIndex(value: number) {
    moduleUI.ChageContextIndex(value);
  }

  get contextMaxIndex() {
    const index = this.listContext.length - 1;
    const ret = this.listContext[index].value;
    if (ret) return ret;
    else return 0;
  }

  OnContext(e: MouseEvent) {
    e.preventDefault();
    moduleUI.OnContext({
      tweet: this.tweet,
      x: e.x,
      y: e.y,
      isShow: true,
      maxIndex: this.contextMaxIndex,
      listContext: this.listContext
    });
  }

  get listUsers() {
    const arr: string[] = [];
    let name = '';
    name = `${this.orgUser.screen_name} / ${this.orgUser.name}`;
    if (!arr.includes(name)) arr.push(name);
    name = `${this.tweet.user.screen_name} / ${this.tweet.user.name}`;
    if (!arr.includes(name)) arr.push(name);
    this.orgTweet.entities.user_mentions.forEach(user => {
      name = `${user.screen_name} / ${user.name}`;
      if (!arr.includes(name)) arr.push(name);
    });
    return arr;
  }

  GetHotKeyText(key: I.Key) {
    if (!key.key) return;
    let ret = '';
    if (key.isCtrl) ret += 'Ctrl + ';
    if (key.isShift) ret += 'Shift + ';
    if (key.isAlt) ret += 'Alt + ';
    ret += key.key.toUpperCase();
    return ret;
  }

  get listContext() {
    let value = 0;
    const listContext: ContextItem[] = [];
    const hotKey = moduleOption.hotKey;
    if (this.media) {
      listContext.push({
        title: this.orgTweet.extended_entities.media[0].display_url,
        onClick: this.OnClickMedia,
        value: value++,
        hotKey: this.GetHotKeyText(hotKey.showImage),
        isDivider: false
      });
      listContext.push({ title: '', onClick: () => {}, isDivider: true });
    }
    if (this.orgTweet.entities.urls.length > 0) {
      this.orgTweet.entities.urls.forEach(url => {
        listContext.push({
          title: url.display_url,
          onClick: this.OnClickLink,
          value: value++,
          isDivider: false
        });
      });
      listContext.push({ title: '', onClick: () => {}, isDivider: true });
    }

    listContext.push({
      title: '답글',
      onClick: this.OnClickReply,
      value: value++,
      hotKey: this.GetHotKeyText(hotKey.reply),
      isDivider: false
    });
    listContext.push({
      title: '모두에게답글',
      onClick: this.OnClickReplyAll,
      value: value++,
      hotKey: this.GetHotKeyText(hotKey.replyAll),
      isDivider: false
    });
    listContext.push({ title: '', onClick: () => {}, isDivider: true });

    listContext.push({
      title: this.orgTweet.retweeted ? '리트윗 해제' : '리트윗',
      onClick: this.OnClickRetweet,
      value: value++,
      hotKey: this.GetHotKeyText(hotKey.retweet),
      isDivider: false
    });
    listContext.push({
      title: '인용 리트윗',
      onClick: this.OnClickQT,
      value: value++,
      hotKey: this.GetHotKeyText(hotKey.sendQt),
      isDivider: false
    });
    listContext.push({
      title: this.orgTweet.favorited ? '관심글 해제' : '관심글',
      onClick: this.OnClickFavorite,
      value: value++,
      hotKey: this.GetHotKeyText(hotKey.sendFavorite),
      isDivider: false
    });
    listContext.push({ title: '', onClick: () => {}, isDivider: true });

    this.listUsers.forEach(user => {
      listContext.push({
        title: `${user}의 프로필 보기(미구현)`,
        onClick: this.OnClickProfile,
        value: value++,
        isDivider: false
      });
    });

    listContext.push({ title: '', onClick: () => {}, isDivider: true });
    if (this.tweet.entities.hashtags.length) {
      this.orgTweet.entities.hashtags.forEach(hash => {
        listContext.push({
          title: `#${hash.text}`,
          onClick: this.OnClickHash,
          hotKey: this.GetHotKeyText(hotKey.hash),
          value: value++,
          isDivider: false
        });
      });
      listContext.push({ title: '', onClick: () => {}, isDivider: true });
    }

    listContext.push({
      title: '웹에서 열기',
      onClick: this.OnClickWeb,
      value: value++,
      isDivider: false
    });
    listContext.push({
      title: '트윗 내용 복사',
      onClick: this.OnClickCopy,
      value: value++,
      hotKey: this.GetHotKeyText(hotKey.copy),
      isDivider: false
    });

    if (this.orgUser.id_str === moduleSwitter.selectID) {
      listContext.push({ title: '', onClick: () => {}, isDivider: true });

      listContext.push({
        title: '트윗 삭제',
        onClick: this.OnClickDelete,
        value: value++,
        hotKey: this.GetHotKeyText(hotKey.delete),
        isDivider: false
      });
    }

    return listContext;
  }

  OnClickMedia(value: number) {
    moduleUtil.OpenImage(this.tweet);
  }

  OnClickLink(value: number) {
    const context = this.listContext.find(x => x.value === value);
    if (!context) return;
    moduleUtil.OpenLink(this.tweet, context.title);
  }

  OnClickReply(value: number) {
    console.log('reply');
    console.log(this.tweet.orgTweet, this.tweet.orgUser);
    moduleUtil.Reply(this.tweet);
  }

  OnClickReplyAll(value: number) {
    console.log('reply all');
    moduleUtil.ReplyAll(this.tweet);
  }

  OnClickRetweet(value: number) {
    console.log('retweet');
    moduleApi.statuses.Retweet(this.tweet);
  }

  OnClickQT(value: number) {
    console.log('qt');
    moduleUtil.OnClickQt(this.tweet);
  }

  OnClickFavorite(value: number) {
    console.log('favo');
    moduleApi.favorites.Create(this.tweet);
  }

  OnClickProfile(value: number) {
    console.log('profile');
    const context = this.listContext.find(x => x.value === value);
    if (!context) return;
    const userScreenName = context.title.substring(0, context.title.indexOf(' /'));
    console.log('user', userScreenName);
    window.preload.profile.OpenProfileWindow(userScreenName, moduleSwitter.switter);
  }

  OnClickHash(value: number) {
    console.log(value);
    const context = this.listContext.find(x => x.value === value);
    if (!context) return;
    const hash = this.tweet.entities.hashtags.find(x => x.text === context.title.replace('#', ''));
    console.log('hash', hash);
    if (!hash) return;
    moduleUtil.AddHash(hash);
  }

  OnClickWeb(value: number) {
    console.log('web');
    moduleUtil.OnClickViewWeb(this.tweet);
  }

  OnClickCopy(value: number) {
    console.log('copy');
    moduleUtil.CopyTweet(this.tweet);
  }

  OnClickDelete(value: number) {
    console.log('delete');
    moduleApi.statuses.Destroy(this.tweet);
  }

  get orgTweet() {
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get orgUser() {
    return this.orgTweet.user;
  }

  get media() {
    return this.orgTweet.extended_entities?.media;
  }

  get isSmall() {
    return false;
    // const option = store.state.option.uiOption;
    // return option.isSmallTweet && !this.state.isFocus && !this.state.isSelected;
  }

  get isNormal() {
    return true;
    // const option = store.state.option.uiOption;
    // return (
    //   !option.isSmallTweet || (option.isSmallTweet && (this.state.isFocus || this.state.isSelected))
    // );
  }
}
