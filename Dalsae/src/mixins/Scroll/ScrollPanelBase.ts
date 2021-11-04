/* eslint-disable @typescript-eslint/camelcase */
import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch, Prop, Ref } from 'vue-property-decorator';
import * as M from '@/mixins';
import * as I from '@/Interfaces';
import faker from 'faker';
import { moduleTweet } from '@/store/modules/TweetStore';
import { TweetSelectorBase } from '../Home';
import { ETweetType } from '@/store/Interface';
import { moduleUI } from '@/store/modules/UIStore';
import ScrollItem from '@/components/Scroll/ScrollItem.vue';
class State {
  scrollTop = 0;
  totalHeight = 0;
  startIndex = 0;
  endIndex = 50;
  translateY = 0;
  selectKey = '';
}

class StateData<T> {
  setKey: Set<string>;
  listData: M.ScrollItem<T>[];
  // listVisible: M.ScrollItem<any>[] = [];
  constructor() {
    this.setKey = new Set();
    this.listData = [];
  }
}

class StatePool {
  listBench: M.ScrollItem<any>[] = [];
  listVisible: M.ScrollItem<any>[] = [];
  constructor() {
    this.listBench = [];
    this.listVisible = [];
  }
}

@Component
export class ScrollPanelBase extends Vue {
  // 오브젝트 풀
  // v-for 렌더링은 오브젝트풀 땡겨다 쓴 목록
  // 오브젝트가 화면 밖으로 나간 거 체크(scrolltop)
  // 체크해서 나가면 오브젝트 풀로 반환
  // 오브젝트 풀 사이즈는 height/minheight
  // index 범위는 기존 로직 쓰면 됨
  // 문제는 데이터 갱신 되면 체크를 어떻게 할지임

  //scrollitem에서 template, 자식 그리게 하는 건
  //slot type같은 거 줘서 컴포넌트를 고르게 할까?

  //동적 추가 코드
  //https://codesandbox.io/embed/4l3w20zomw
  isMounted = false;
  state = new State();
  stateData = new StateData();
  statePool = new StatePool();

  @Ref()
  scrollPanel!: HTMLElement;

  @Ref()
  scrollItem!: Vue[];

  @Ref()
  scrollPort!: HTMLElement;

  @Prop()
  listData!: any[];

  @Prop()
  itemType!: string;

  @Prop()
  indexPanel!: number;

  @Prop()
  tweetType!: ETweetType;

  get listComponent() {
    return this.statePool.listBench;
  }

  get viewportStyle() {
    const { listData } = this.stateData;
    const last = listData[listData.length - 1];
    if (last) {
      const top = last.scrollTop + last.height;
      return {
        height: top + 'px'
      };
    } else {
      return {
        height: 0 + 'px'
      };
    }
  }

  get isRendered() {
    if (!this.isMounted) return false;
    else if (this.$el.clientHeight === 0) return false;
    else return true;
  }

  get listVisible() {
    return this.stateData.listData.slice(this.state.startIndex, this.state.endIndex);
  }

  async created() {
    return;
    const testTweets = window.preload.LoadTestTweet();
    const data: M.ScrollItem<I.Tweet> = {
      data: new I.Tweet(testTweets[0]),
      height: 40,
      isResized: false,
      key: testTweets[0].id_str,
      scrollTop: 100
    };
    const item = new ScrollItem({ propsData: { data: data, itemType: 'tweet' } });
    item.$vuetify = this.$vuetify;
    this.$nextTick(() => {
      console.log(this.scrollPanel.clientHeight);
      item.$mount(this.scrollPanel);
    });
    setTimeout(() => {
      console.log(Object.keys(item.$props));
      console.log(item.$props.data);
    }, 1500);
    // this.statePool.listBench.push(item);
  }

  CreateObjectPool() {
    // const size = Math.ceil(this.scrollPanel.clientHeight / moduleUI.minHeight)
    // console.log('size: ',size)
    // for(let i=0;i<size;i++){
    //   const data: M.ScrollItem<I.Tweet> = {
    //     data: new I.Tweet(testTweets[0]),
    //     height: 40,
    //     isResized: false,
    //     key: testTweets[0].id_str,
    //     scrollTop: 100
    //   };
    //   const item = new ScrollItem({ propsData: { data: data, itemType: 'tweet' } });
    //   item.$vuetify = this.$vuetify;
    // }
  }

  @Watch('indexPanel')
  OnChangePanelIndex(newVal: number) {
    console.log('index panel', newVal);
    if (!this.scrollItem) return;
    if (newVal === -1) return;
    const selectData = this.stateData.listData[newVal];
    if (!selectData) return;
    this.state.selectKey = selectData.key;
    const idx = this.listVisible.findIndex(x => x.key === selectData.key);
    if (idx === -1) {
      this.scrollPanel.scrollTo({ top: selectData.scrollTop });
      return;
    }
    const component = this.scrollItem.find(x => x.$props.data.key === selectData.key);
    if (!component) return;
    const tweetPos = component.$el.getBoundingClientRect();
    const panelPos = this.scrollPanel.getBoundingClientRect();
    const tweetBottom = tweetPos.y + tweetPos.height;
    const panelBottom = panelPos.y + panelPos.height;
    if (tweetBottom > panelBottom) {
      //내려가는 로직
      const top = tweetBottom - panelBottom;
      this.scrollPanel.scrollTo({ top: this.state.scrollTop + top });
    } else if (tweetPos.top < panelPos.y) {
      //올라가는 로직
      this.scrollPanel.scrollTo({ top: selectData.scrollTop });
    }
  }

  Clear() {
    this.stateData.listData = [];
    this.stateData.setKey.clear();
    // this.stateData.listVisible = [];
    this.statePool.listBench = [];
  }

  @Watch('listData', { immediate: true, deep: true })
  OnChangeListData(newVal: any[]) {
    if (!newVal) return;
    if (newVal.length === 0) {
      this.Clear();
    }
    this.CreateScrollData();
    if (this.isRendered) {
      this.SetIndex();
      // this.CreateComponent();
    } else {
      console.log('not render');
      this.WaitTime();
    }
  }
  @Watch('state.scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    if (this.listData.length === 0) return;
    this.SetIndex();
    // this.CreateComponent();
  }
  WaitTime() {
    setTimeout(() => {
      if (!this.isRendered) {
        this.WaitTime();
      } else {
        this.SetIndex();
        // this.CreateComponent();
      }
    }, 100);
  }

  CreateScrollData() {
    //props listData가 갱신 될 때만 호출
    const list = (this.listData as unknown) as any;
    if (!list) return;
    const minHeight = moduleUI.minHeight;
    for (let i = 0, len = list.length; i < len; i++) {
      const current = list[i];
      if (!this.stateData.setKey.has(current.id_str)) {
        this.stateData.setKey.add(current.id_str);
        const prev = this.stateData.listData[i - 1];
        const scrollTop = prev ? prev.scrollTop + prev.height : i * minHeight;
        const item: M.ScrollItem<any> = {
          data: this.CreateData(current),
          key: current.id_str,
          height: minHeight,
          isResized: true,
          scrollTop: scrollTop
        };
        this.stateData.listData.splice(i, 0, item);
      }
    }
  }

  CreateData(current: any) {
    if (this.itemType === 'tweet') {
      return new I.Tweet(current);
    } else if (this.itemType === 'user') {
      return current;
    }
  }

  CreateComponent() {
    if (this.listVisible.length === 0) {
      return;
    }

    //렌더링용 데이터 추가
    const keysBench = this.statePool.listBench.map(x => x.key);
    this.listVisible.forEach(item => {
      if (keysBench.includes(item.key)) {
        return true;
      }
      this.statePool.listBench.push(item);
      // const component = new ScrollItem({ propsData: { data: item, itemType: 'tweet' } });
      // component.$vuetify = this.$vuetify;
      // component.$mount(this.scrollPort);
      // this.statePool.listBench.push(component);
    });
    //렌더링에서 뺴야 될 데이터 체크
    const keysVisible = this.listVisible.map(x => x.key);
    for (let i = 0; i < this.statePool.listBench.length; ) {
      if (keysVisible.includes(this.statePool.listBench[i].key)) {
        i++;
      } else {
        this.statePool.listBench.splice(i, 1);
      }
    }
  }

  SetIndex() {
    if (!this.isRendered) {
      setTimeout(() => {
        this.SetIndex();
      }, 100);
      return;
    } else {
      this.state.scrollTop = this.scrollPanel.scrollTop;
      let scrollTop = this.state.scrollTop;
      if (scrollTop < 0) {
        scrollTop = 0;
      }
      let startIndex = this.BinarySearch(this.stateData.listData, scrollTop);
      startIndex -= 5; //버퍼
      if (startIndex < 0) startIndex = 0;
      if (this.scrollPanel.scrollTop === 0) {
        startIndex = 0;
      }
      this.state.startIndex = startIndex;
      this.state.endIndex = startIndex + Math.floor(this.$el.clientHeight / moduleUI.minHeight);
      if (this.$el.clientHeight === 0) {
        setTimeout(() => {
          this.SetIndex();
        }, 100);
      }
      this.CreateComponent();
    }
  }

  BinarySearch(list: M.ScrollItem<any>[], scrollTop: number) {
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

  // async SetVisibleData() {
  //   if (this.listData.length === 0) return;
  //   this.listVisible = this.stateData.listData.slice(
  //     this.state.startIndex,
  //     this.state.endIndex
  //   );
  // }

  OnResizeTweet(resizeEvent: M.ResizeEvent) {
    const moveY = resizeEvent.newVal - resizeEvent.oldVal;
    this.state.totalHeight += moveY;
    const idx = this.stateData.listData.findIndex(x => x.key == resizeEvent.key);
    const data = this.stateData.listData[idx];
    if (!data) return;
    if (data.isResized && idx <= this.state.startIndex && this.scrollPanel.scrollTop > 0) {
      this.scrollPanel.scrollTo({ top: this.scrollPanel.scrollTop + moveY + moduleUI.minHeight });
    }
    this.MoveScroll(this.stateData.listData, idx, resizeEvent.newVal);
  }

  MoveScroll(listTweet: M.ScrollItem<any>[], idxFrom: number, height: number) {
    listTweet[idxFrom].height = height;
    listTweet[idxFrom].isResized = false;
    let total = listTweet[idxFrom].scrollTop + listTweet[idxFrom].height;
    for (let i = idxFrom + 1, len = listTweet.length; i < len; i++) {
      listTweet[i].scrollTop = total;
      total += listTweet[i].height;
    }
  }
}
