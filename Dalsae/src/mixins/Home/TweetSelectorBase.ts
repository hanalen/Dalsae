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
  titleTwo?: string;
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
  selected!: boolean;

  OnClickTweet(e: MouseEvent) {
    e.preventDefault();
    moduleUI.ChangeSelectTweet(this.tweet.id_str);
  }

  get via() {
    let via = this.orgTweet.source;
    via = via.substring(via.indexOf('>') + 1, 999);
    via = via.substring(0, via.indexOf('<'));
    return via;
  }

  get x() {
    return moduleUI.stateContext.x;
  }
  get y() {
    return moduleUI.stateContext.y;
  }

  get isShowContext() {
    return (
      moduleUI.stateContext.isShow && moduleUI.stateContext.tweet?.id_str === this.tweet.id_str
    );
  }
  set isShowContext(isShow: boolean) {
    if (isShow) moduleUI.ChangeSelectTweet(this.tweet.id_str);
    const { x, y } = moduleUI.stateContext;
    moduleUI.SetStateContext({
      ...moduleUI.stateContext,
      x: x,
      y: y,
      isShow: isShow,
      maxIndex: 0,
      listContext: this.listContext,
      index: 0
    });
  }

  get contextIndex() {
    return moduleUI.stateContext.index;
  }

  set contextIndex(value: number) {
    moduleUI.SetStateContext({ ...moduleUI.stateContext, index: value });
  }

  get contextMaxIndex() {
    const index = this.listContext.length - 1;
    const ret = this.listContext[index].value;
    if (ret) return ret;
    else return 0;
  }

  OnContext(e: MouseEvent) {
    e.preventDefault();
    moduleUI.SetStateContext({
      ...moduleUI.stateContext,
      tweet: this.tweet,
      x: e.x,
      y: e.y,
      isShow: true,
      maxIndex: this.contextMaxIndex,
      listContext: this.listContext,
      index: 0
    });
  }

  get listUsers() {
    const arr: I.UserMention[] = [];
    //org, user, mentions
    arr.push(this.tweet.orgUser);
    if (!arr.find(x => x.id_str === this.tweet.user.id_str)) arr.push(this.tweet.user);
    this.tweet.entities.user_mentions.forEach(user => {
      if (!arr.find(x => x.id_str === user.id_str)) arr.push(user);
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
      listContext.push({
        title: '',
        onClick: () => {
          return;
        },
        isDivider: true
      });
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
      listContext.push({
        title: '',
        onClick: () => {
          return;
        },
        isDivider: true
      });
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
    listContext.push({
      title: '',
      onClick: () => {
        return;
      },
      isDivider: true
    });

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
    listContext.push({
      title: '',
      onClick: () => {
        return;
      },
      isDivider: true
    });

    this.listUsers.forEach(user => {
      listContext.push({
        title: `@${user.screen_name} 의 프로필 보기`,
        titleTwo: user.name,
        onClick: this.OnClickProfile,
        value: value++,
        isDivider: false
      });
      listContext.push({
        title: '',
        onClick: () => {
          return;
        },
        isDivider: true
      });
    });

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
      listContext.push({
        title: '',
        onClick: () => {
          return;
        },
        isDivider: true
      });
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
    listContext.push({
      title: '',
      onClick: () => {
        return;
      },
      isDivider: true
    });

    listContext.push({
      title: `${this.via} 뮤트`,
      onClick: this.OnClickMuteClient,
      value: value++,
      isDivider: false
    });

    listContext.push({
      title: '트윗 뮤트',
      onClick: this.OnClickMuteTweet,
      value: value++,
      isDivider: false
    });

    if (this.orgUser.id_str === moduleSwitter.selectID) {
      listContext.push({
        title: '',
        onClick: () => {
          return;
        },
        isDivider: true
      });

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
    moduleUtil.OpenLink({ tweet: this.tweet, title: context.title });
  }

  OnClickReply(value: number) {
    moduleUtil.Reply(this.tweet);
  }

  OnClickReplyAll(value: number) {
    moduleUtil.ReplyAll(this.tweet);
  }

  OnClickRetweet(value: number) {
    moduleUtil.Retweet(this.tweet);
  }

  OnClickQT(value: number) {
    moduleUtil.OnClickQt(this.tweet);
  }

  OnClickFavorite(value: number) {
    moduleApi.favorites.Create(this.tweet);
  }

  OnClickProfile(value: number) {
    const context = this.listContext.find(x => x.value === value);
    if (!context) return;
    const userScreenName = context.title.substring(0, context.title.indexOf(' '));
    window.ipc.profile.OpenProfileWindow(
      userScreenName,
      moduleSwitter.stateSwitter.switter,
      moduleSwitter.stateIds.followDatas,
      moduleSwitter.stateIds.dicBlockIds
    );
  }

  OnClickHash(value: number) {
    const context = this.listContext.find(x => x.value === value);
    if (!context) return;
    const hash = this.tweet.entities.hashtags.find(x => x.text === context.title.replace('#', ''));
    if (!hash) return;
    moduleUtil.AddHash(hash);
  }

  OnClickWeb(value: number) {
    moduleUtil.OnClickViewWeb(this.tweet);
  }

  OnClickCopy(value: number) {
    moduleUtil.CopyTweet(this.tweet);
  }

  OnClickMuteClient(value: number) {
    const client = moduleOption.muteOption.client.concat(this.via);
    const muteoption = { ...moduleOption.muteOption, client: client };
    moduleOption.ChangeMuteOption(muteoption);
  }

  OnClickMuteTweet(value: number) {
    const tweet = new I.Tweet();
    tweet.id_str = this.tweet.orgTweet.id_str;
    tweet.full_text = this.tweet.orgTweet.full_text;
    const tweets = moduleOption.muteOption.tweet.concat(tweet);
    const muteoption = { ...moduleOption.muteOption, tweet: tweets };
    moduleOption.ChangeMuteOption(muteoption);
  }

  OnClickDelete(value: number) {
    moduleApi.statuses.Destroy(this.tweet);
  }

  get orgTweet() {
    return this.tweet.orgTweet;
  }

  get orgUser() {
    return this.tweet.orgUser;
  }

  get media() {
    return this.orgTweet.extended_entities?.media;
  }

  get isSmall() {
    return moduleOption.uiOption.isSmallTweet && !this.selected;
  }

  get isNormal() {
    if (!moduleOption.uiOption.isSmallTweet) {
      return true;
    } else {
      return this.selected;
    }
    return true;
    // const option = store.state.option.uiOption;
    // return (
    //   !option.isSmallTweet || (option.isSmallTweet && (this.state.isFocus || this.state.isSelected))
    // );
  }
}
