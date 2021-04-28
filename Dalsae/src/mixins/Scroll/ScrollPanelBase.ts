/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch, Prop } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/mixins';
import * as I from '@/Interfaces';
import faker from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
class State {
  scrollTop = 0;
  totalHeight = 0;
  listVisible: M.ScrollItem<I.Tweet>[] = [];
  startIndex = 0;
  endIndex = 50;
  translateY = 0;
  minHeight = 40;
  constructor() {
    this.listVisible = [];
  }
}

export class ScrollPanelBase extends Vue {
  state = new State();

  // @Prop({ default: [] })
  // listTweet!: I.Tweet[];

  @Prop({ default: [] })
  listData!: M.ScrollItem<I.Tweet>[];

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

  @Watch('state.scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    const prevStartIdx = this.state.startIndex;
    const prevEndIdx = this.state.endIndex;
    this.state.scrollTop = this.$el.scrollTop;
    let scrollTop = this.state.scrollTop - 500; // 상단 버퍼 px
    if (scrollTop < 0) scrollTop = 0;
    this.state.endIndex =
      this.state.startIndex + Math.floor(this.$el.clientHeight / this.state.minHeight);
    this.state.startIndex = this.BinarySearch(this.listData, scrollTop);
    this.state.translateY = this.listData[this.state.startIndex].scrollTop;
    if (this.state.endIndex >= this.listData.length) this.state.endIndex = this.listData.length - 1;
    const startIdx = this.state.startIndex;
    const endIdx = this.state.endIndex;
    if (prevStartIdx !== startIdx || prevEndIdx !== endIdx) this.SetVisibleData();
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
    const item = list[mid];
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

  Add() {
    //add되면 사이즈 계산은 onresize에서 자동으로 함
    //TODO ScrollTop계산이 필요함.
    //나중에 트윗은 외부에서 추가 할 텐데 그때 index몇으로 추가되는지 모름
    this.SetVisibleData();
  }

  get viewportStyle() {
    return {
      'background-color': 'aliceblue',
      height: this.state.totalHeight + 'px',
      willChange: 'auto',
      overflow: 'hidden',
      position: 'relative'
    };
  }

  get listStyle() {
    return {
      willChange: 'auto',
      transform: 'translateY(' + this.state.translateY + 'px)'
    };
  }

  key = 0;

  OnResizeWindow() {
    moduleTweet.Resized();
    // for (let i = 0, len = this.listData.length; i < len; i++) {
    //   this.listData[i].isResized = true;
    // }
  }

  get Total() {
    let sum = 0;
    this.listData.forEach(item => {
      sum += item.scrollTop;
    });
    return sum;
  }

  SetVisibleData() {
    this.state.listVisible = this.listData.slice(this.state.startIndex, this.state.endIndex);
  }
}
