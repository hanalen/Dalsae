/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch, Prop, Ref } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/mixins';
import * as I from '@/Interfaces';
import faker from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
import { TweetSelectorBase } from '../Home';
class State {
  scrollTop = 0;
  totalHeight = 0;
  listVisible: M.ScrollItem<I.Tweet>[] = [];
  startIndex = 0;
  endIndex = 50;
  translateY = 0;
  minHeight = 40;
  isScrollLock = false;
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

  SetScroll() {
    const prevStartIdx = this.state.startIndex;
    const prevEndIdx = this.state.endIndex;
    this.state.scrollTop = this.scrollPanel.scrollTop;
    let scrollTop = this.state.scrollTop - 1000; // 상단 버퍼 px
    if (scrollTop < 0) scrollTop = 0;
    this.state.endIndex =
      this.state.startIndex + Math.floor(this.$el.clientHeight / this.state.minHeight);
    this.state.startIndex = this.BinarySearch(this.listData, scrollTop);
    if (this.state.endIndex >= this.listData.length) this.state.endIndex = this.listData.length - 1;
    const startIdx = this.state.startIndex;
    const endIdx = this.state.endIndex;
    this.SetVisibleData();
    // if (prevStartIdx !== startIdx || prevEndIdx !== endIdx) this.SetVisibleData();
  }

  @Watch('state.scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.SetScroll();
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

  async CheckLockScroll(tweet: I.Tweet | undefined) {
    if (tweet === undefined) return false;
    if (this.state.scrollTop === 0) return false;
    //추가된 트윗이 현재 어느 시점인지를 모름...
    //listData에서 tweet의 index를 구해서 그 index가 start~end사이에 있는지 체크하고
    //index를 또 계산하면 그러니까 addTweet에서 add할 때 index를 던지는 게 맞을 거 같다
    //index범위 안일 경우, 밖일 경우 2가지로 분기
    //안일 경우 setvisible yield하고 와서 구해진값으로...
    //안일 경우 setvisible에서 idx+1해버리면 끝인데 그러면 resize할 때 튐
    //밖일 경우는 그냥 minHeight 더해버리면 끝

    //listData의 scrollTop이 0으로 고정 돼서 index범위가 이상해짐

    //일단 idx범위 밖일 때

    //idx가 start보다 낮을 때에만 스크롤 고정을 해야 하니 start 보다 크면 무조건 false;
    //범위 안에 추가 될 때에는 굳이 스크롤을 고정할 필요가 없다. 상위만 중요
    const idx = this.listData.findIndex(x => x.data.id_str === tweet.id_str);
    // console.log('idx', idx);
    if (idx < 0) return false;
    if (idx > this.state.startIndex) return false;

    const idxTop = this.BinarySearch(this.listData, this.scrollPanel.scrollTop); //viewport top idx
    // console.log('idx', idx, 'idx top', idxTop);
    //scroll top 보다 위에 추가 될 경우에만
    if (idx < idxTop) {
      //문제는 추가되는 애 resize이벤트가 호출 되지 않아서 scrolltop이 계속 0으로 지정 됨
      //minheight로 설정해도 스크롤 움직이는 순간 난리날 거 같다
      //숨겨놓는 오브젝트를 놔두고 거기에 매번 할당해서 height를 받아올까...극단적이긴 한데
      //가장 확실할 방법이다.
      //라이브러리는 minheight를 더했었는데 이게 그러면 나중에 이동 시 복잡해질 거 같다

      //listTweet 스크롤 이동 -> 스크롤 이동 강제 호출 -> OnScroll 호출됨 -> scrollTop 바뀜 -> setVisible다시 호출
      //lock일때는 setvisible필요가없는 거 같은데
      moduleTweet.MoveScroll({
        idxFrom: idx,
        listTweet: this.listData,
        height: 0
        // height: this.state.minHeight
      });
      this.state.isScrollLock = true;
      this.scrollPanel.scrollTo({ top: this.scrollPanel.scrollTop - this.state.minHeight });
      return true;
    }
    return false;
  }

  async SetVisibleData(tweet: I.Tweet | undefined = undefined) {
    //await 하고 리턴값 받아서 처리하게 해야 순서가 맞는다
    if (await this.CheckLockScroll(tweet)) {
      console.log('lock scroll');
      // this.state.listVisible = this.listData.slice(
      //   this.state.startIndex + 1,
      //   this.state.endIndex + 1
      // );
    } else {
      console.log('not lock scroll');
      this.state.listVisible = this.listData.slice(this.state.startIndex, this.state.endIndex);
    }
  }
}
