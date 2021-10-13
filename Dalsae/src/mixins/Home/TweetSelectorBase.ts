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

interface ContextItem {
  title: string;
  hotKey?: string;
  onClick: (value: number) => void | undefined;
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
    const { x, y } = moduleUI.stateContext;
    moduleUI.OnContext({ x: x, y: y, isShow: isShow, maxIndex: 0 });
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
      maxIndex: this.contextMaxIndex
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
    window.preload.image.OpenImageWindow(this.tweet, moduleOption.uiOption);
  }

  OnClickLink(value: number) {
    const context = this.listContext.find(x => x.value === value);
    if (!context) return;
    const url = this.orgTweet.entities.urls.find(x => x.display_url === context.title);
    if (!url) return;
    window.preload.OpenBrowser(url.expanded_url);
  }

  OnClickReply(value: number) {
    console.log('reply');
    const mentions = `@${this.orgUser.screen_name} `;
    moduleUI.ChangeReplyTweet(this.tweet);
    moduleUI.SetInputText(mentions);
  }

  OnClickReplyAll(value: number) {
    console.log('reply all');
    const set = new Set();
    set.add(this.tweet.user.screen_name);
    set.add(this.orgUser.screen_name);
    this.orgTweet.entities.user_mentions.forEach(user => {
      set.add(user.screen_name);
    });
    const screenName = moduleSwitter.selectUser?.user.screen_name;
    if (screenName) set.delete(screenName);
    let mentions = '';
    set.forEach(user => {
      mentions += `@${user} `;
    });
    moduleUI.ChangeReplyTweet(this.tweet);
    moduleUI.SetInputText(mentions);
  }

  OnClickRetweet(value: number) {
    console.log('retweet');
    if (this.orgTweet.retweeted) moduleApi.call.statuses.UnRetweet(this.orgTweet.id_str);
    else moduleApi.call.statuses.Retweet(this.orgTweet.id_str);
  }

  OnClickQT(value: number) {
    console.log('qt');
    const str = `https://twitter.com/${this.orgUser.screen_name}/status/${this.orgTweet.id_str}`;
    moduleUI.SetInputText(str);
  }

  OnClickFavorite(value: number) {
    console.log('favo');
    if (this.orgTweet.favorited) moduleApi.call.favorites.Destroy(this.orgTweet.id_str);
    else moduleApi.call.favorites.Create(this.orgTweet.id_str);
  }

  OnClickProfile(value: number) {
    console.log('profile');
  }

  OnClickWeb(value: number) {
    console.log('web');
    const url = `https://twitter.com/${this.orgUser.screen_name}/status/${this.orgTweet.id_str}`;
    window.preload.OpenBrowser(url);
  }

  OnClickCopy(value: number) {
    console.log('copy');
  }

  OnClickDelete(value: number) {
    console.log('delete');
    moduleApi.call.statuses.Destroy(this.orgTweet.id_str);
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
