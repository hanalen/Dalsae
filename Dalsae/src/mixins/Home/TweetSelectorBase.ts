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

interface ContextItem {
  title: string;
  onClick: () => void;
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
    return moduleUI.contextX;
  }
  get y() {
    return moduleUI.contextY;
  }

  get isShowContext() {
    return moduleUI.isShowContext && moduleUI.contextTweet.id_str === this.tweet.id_str;
  }

  set isShowContext(isShow: boolean) {
    const { contextX, contextY } = moduleUI;
    moduleUI.OnContext({ x: contextX, y: contextY, isShow: isShow });
  }

  OnContext(e: MouseEvent) {
    console.log('on context');
    e.preventDefault();
    moduleUI.OnContext({ tweet: this.tweet, x: e.x, y: e.y, isShow: true });
  }

  get listContext() {
    //이미지
    //링크
    //<v-divider></v-divider>
    //답글
    //모두에게답글
    //<v-divider></v-divider>
    //리트윗
    //인용
    //관심글
    //<v-divider></v-divider>
    //프로필보기
    //<v-divider></v-divider>
    //웹에서보기
    //트윗복사
    //트윗삭제

    const listContext: ContextItem[] = [];
    if (this.media) {
      listContext.push();
    }

    return listContext;
  }

  OnClickMedia() {
    console.log('e');
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
