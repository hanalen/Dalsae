/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch, Prop, Ref } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/mixins';
import * as E from '@/mixins';
import * as I from '@/Interfaces';
import faker from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
import { TweetSelectorBase } from '../Home';
import { ETweetType } from '@/store/Interface';
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

  @Prop({ default: [] })
  listData!: M.ScrollItem<I.Tweet>[];

  @Prop()
  tweetType!: ETweetType;

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
    let scrollTop = this.state.scrollTop; // - 1000; // 상단 버퍼 px
    if (scrollTop < 0) {
      scrollTop = 0;
      // scrollTop = this.state.scrollTop;
    }
    let startIndex = this.BinarySearch(this.listData, scrollTop);
    startIndex -= 5; //버퍼
    if (startIndex < 0) startIndex = 0;
    if (this.scrollPanel.scrollTop === 0) {
      startIndex = 0;
    }
    this.state.startIndex = startIndex;
    this.state.endIndex = startIndex + Math.floor(this.$el.clientHeight / this.state.minHeight);
    // if (scrollTop === 0) {
    //   console.log('scropp top is 0', this.scrollPanel.scrollTop);
    //   this.state.startIndex = 0; //예외처리
    // }
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
    const { startIndex, endIndex, listVisible } = this.state;
    ///렌더링 범위가 바뀌지 않을 경우 변경하지 않음
    if (this.listData.length === 0) return;
    if (listVisible.length > 0) {
      if (this.listData[startIndex].key === listVisible[0].key) return;
      else if (this.listData[endIndex].key === listVisible[listVisible.length - 1].key) return;
    }

    this.state.listVisible = this.listData.slice(this.state.startIndex, this.state.endIndex);
  }
}
