/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch, Prop, Ref } from 'vue-property-decorator';
import * as M from '@/mixins';
import * as E from '@/mixins';
import * as I from '@/Interfaces';
import faker from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
import { TweetSelectorBase } from '../Home';
import { ETweetType } from '@/store/Interface';
import { moduleUI } from '@/store/modules/UIStore';
class State {
  scrollTop = 0;
  totalHeight = 0;
  listVisible: M.ScrollItem<I.Tweet>[] = [];
  startIndex = 0;
  endIndex = 50;
  translateY = 0;
  minHeight = 40;
  isScrollLock = false;
  listAddedKey: string[] = [];
  constructor() {
    this.listVisible = [];
  }
}

export class ScrollPanelBase extends Vue {
  state = new State();

  @Ref()
  scrollPanel!: HTMLElement;

  @Ref()
  scrollItem!: Vue[];

  @Prop({ default: [] })
  listData!: M.ScrollItem<I.Tweet>[];

  @Prop()
  tweetType!: ETweetType;

  get panelIndex() {
    switch (this.tweetType) {
      case ETweetType.E_HOME:
        return moduleUI.panelHome.index;
      case ETweetType.E_MENTION:
        return moduleUI.panelMention.index;
      case ETweetType.E_FAVORITE:
        return moduleUI.panelFavorite.index;
      case ETweetType.E_OPEN:
        return moduleUI.panelOpen.index;
      default:
        return moduleUI.panelHome.index;
    }
  }

  @Watch('panelIndex')
  OnChangePanelIndex(newVal: number) {
    if (!this.scrollItem) return;
    console.log('index', newVal);
    const selectTweet = this.listData[newVal];
    const idx = this.state.listVisible.findIndex(x => x.key === selectTweet.key);
    if (idx === -1) {
      console.log('panel index idx is -1');
      console.log('selecttweet', selectTweet);
      console.log(this.state.listVisible);
      return;
    }
    const component = this.scrollItem[idx];
    const tweetPos = component.$el.getBoundingClientRect();
    const panelPos = this.scrollPanel.getBoundingClientRect();
    const tweetBottom = tweetPos.y + tweetPos.height;
    const panelBottom = panelPos.y + panelPos.height;
    console.log(tweetPos, panelPos, selectTweet);
    if (tweetBottom > panelBottom) {
      //내려가는 로직
      const top = tweetBottom - panelBottom;
      console.log('down', panelBottom, tweetBottom);
      this.scrollPanel.scrollTo({ top: this.state.scrollTop + top });
    } else if (tweetPos.top < panelPos.y) {
      //올라가는 로직
      console.log('up');
      this.scrollPanel.scrollTo({ top: selectTweet.scrollTop });
    }
  }

  AddTestData() {
    for (let i = 0; i < 200; i++) {
      const data: I.Tweet = {
        full_text: faker.lorem.text() + faker.lorem.text(),
        created_at: Date.now.toString(),
        entities: { hashtags: [], media: [], urls: [], user_mentions: [] },
        extended_entities: { media: [] },
        favorite_count: 0,
        favorited: false,
        id_str: faker.datatype.number(1000000).toString(),
        in_reply_to_screen_name: '',
        in_reply_to_status_id_str: '',
        in_reply_to_user_id_str: '',
        is_quote_status: false,
        place: '',
        retweet_count: 0,
        retweeted: false,
        retweeted_status: undefined,
        source: '',
        user: {
          profile_image_url_https: faker.image.avatar(),
          name: faker.name.firstName(),
          screen_name: faker.finance.accountName(),
          created_at: Date.now.toString(),
          default_profile: false,
          default_profile_image: false,
          description: '',
          favourites_count: 0,
          follow_request_sent: false,
          followers_count: 0,
          following: false,
          friends_count: 0,
          has_extended_profile: false,
          id_str: faker.datatype.number(1000000).toString(),
          listed_count: 0,
          location: '',
          profile_background_color: '',
          profile_background_image_url: '',
          profile_background_image_url_https: '',
          profile_background_tile: false,
          profile_banner_url: '',
          profile_image_url: faker.image.avatar(),
          profile_link_color: '',
          profile_sidebar_border_color: '',
          profile_sidebar_fill_color: '',
          protected: false,
          statuses_count: 0,
          verified: false
        }
      };
      this.listData.push({
        data: data,
        height: 40,
        isResized: true,
        key: i.toString(),
        scrollTop: this.state.minHeight * i
      });
    }
  }

  SetIndex() {
    this.state.scrollTop = this.scrollPanel.scrollTop;
    let scrollTop = this.state.scrollTop;
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    let startIndex = this.BinarySearch(this.listData, scrollTop);
    startIndex -= 5; //버퍼
    if (startIndex < 0) startIndex = 0;
    if (this.scrollPanel.scrollTop === 0) {
      startIndex = 0;
    }
    this.state.startIndex = startIndex;
    this.state.endIndex = startIndex + Math.floor(this.$el.clientHeight / this.state.minHeight);
    this.SetVisibleData();
  }

  @Watch('state.scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    if (newVal === 0) {
      this.state.listAddedKey = [];
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.SetIndex();
    }, 50);
  }

  BinarySearch(list: M.ScrollItem<I.Tweet>[], scrollTop: number) {
    let low = 0;
    let high = list.length - 1;
    let mid;
    while (low < high) {
      mid = Math.floor((high + low) / 2);
      const item = list[mid];
      if (item.scrollTop <= scrollTop && scrollTop <= item.scrollTop + item.height) {
        return mid;
      } else if (list[mid].scrollTop > scrollTop) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    mid = Math.floor((high + low) / 2);
    if (mid === -1) mid = 0;
    const item = list[mid];
    if (item === undefined) {
      return -1;
    }
    if (item.scrollTop <= scrollTop && scrollTop <= item.scrollTop + item.height) {
      return mid;
    } else {
      return mid - 1;
    }
  }

  isBetween(start: number, end: number, value: number) {
    if (start <= value && value <= end) return true;
    else return false;
  }

  get viewportStyle() {
    return {
      'background-color': 'aliceblue',
      height: this.state.totalHeight + 'px'
    };
  }

  key = 0;
  timer!: NodeJS.Timeout;
  OnResizeWindow() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      moduleTweet.Resized();
    }, 100);
  }

  get Total() {
    let sum = 0;
    this.listData.forEach(item => {
      sum += item.scrollTop;
    });
    return sum;
  }

  async SetVisibleData() {
    //중복 렌더링일 경우 로직 개선 필요
    if (this.listData.length === 0) return;

    this.state.listVisible = this.listData.slice(this.state.startIndex, this.state.endIndex);
  }
}
