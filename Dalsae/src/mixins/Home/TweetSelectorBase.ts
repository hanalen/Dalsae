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

interface ContextItem {
  title: string;
  onClick: () => void | undefined;
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

  get listContext() {
    let value = 0;
    const listContext: ContextItem[] = [];
    if (this.media) {
      listContext.push({
        title: this.orgTweet.extended_entities.media[0].display_url,
        onClick: this.OnClickMedia,
        value: value++,
        isDivider: false
      });
      listContext.push({ title: '', onClick: () => {}, isDivider: true });
    }
    if (this.orgTweet.entities.urls.length > 0) {
      this.orgTweet.entities.urls.forEach(url => {
        listContext.push({
          title: url.display_url,
          onClick: this.OnClickMedia,
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
      isDivider: false
    });
    listContext.push({
      title: '모두에게답글',
      onClick: this.OnClickReplyAll,
      value: value++,
      isDivider: false
    });
    listContext.push({ title: '', onClick: () => {}, isDivider: true });

    listContext.push({
      title: this.orgTweet.retweeted ? '리트윗 해제' : '리트윗',
      onClick: this.OnClickRetweet,
      value: value++,
      isDivider: false
    });
    listContext.push({
      title: '인용 리트윗',
      onClick: this.OnClickQT,
      value: value++,
      isDivider: false
    });
    listContext.push({
      title: this.orgTweet.favorited ? '관심글 해제' : '관심글',
      onClick: this.OnClickFavorite,
      value: value++,
      isDivider: false
    });
    listContext.push({ title: '', onClick: () => {}, isDivider: true });

    this.listUsers.forEach(user => {
      listContext.push({
        title: `${user}의 프로필 보기`,
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
      isDivider: false
    });

    if (this.orgUser.id_str === moduleSwitter.selectID) {
      listContext.push({ title: '', onClick: () => {}, isDivider: true });

      listContext.push({
        title: '트윗 삭제',
        onClick: this.OnClickDelete,
        value: value++,
        isDivider: false
      });
    }

    return listContext;
  }

  OnClickMedia() {
    console.log('media');
  }

  OnClickLing() {
    console.log('link');
  }

  OnClickReply() {
    console.log('reply');
  }

  OnClickReplyAll() {
    console.log('reply all');
  }

  OnClickRetweet() {
    console.log('retweet');
  }

  OnClickQT() {
    console.log('qt');
  }

  OnClickFavorite() {
    console.log('favo');
  }

  OnClickProfile() {
    console.log('profile');
  }

  OnClickWeb() {
    console.log('web');
  }

  OnClickCopy() {
    console.log('copy');
  }

  OnClickDelete() {
    console.log('delete');
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
