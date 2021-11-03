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
}

class StateData<T> {
  setKey: Set<string>;
  listData: M.ScrollItem<T>[];
  listVisible: M.ScrollItem<any>[] = [];
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
export class ScrollPanelBaseTwo extends Vue {
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
  listData!: I.Tweet[];

  @Prop()
  tweetType!: ETweetType;

  get listComponent() {
    return this.statePool.listBench;
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

  @Watch('listData', { immediate: true, deep: true })
  OnChangeListData(newVal: I.Tweet[]) {
    console.log('on watch listData', newVal);
    if (!newVal) return;
    this.CreateScrollData();
    this.SetIndex();
    this.CreateComponent();
  }

  CreateScrollData() {
    const list = (this.listData as unknown) as any;
    if (!list) return;
    const minHeight = moduleUI.minHeight;
    for (let i = 0, len = list.length; i < len; i++) {
      const current = list[i];
      if (!this.stateData.setKey.has(current.id_str)) {
        this.stateData.setKey.add(current.id_str);
        const prev = this.stateData.listData[i - 1];
        const scrollTop = prev ? prev.scrollTop + prev.height : i * minHeight;
        const item: M.ScrollItem<I.Tweet> = {
          data: new I.Tweet(current),
          key: current.id_str,
          height: minHeight,
          isResized: false,
          scrollTop: scrollTop
        };
        this.stateData.listData.splice(i, 0, item);
      }
    }
  }

  CreateComponent() {
    if (this.stateData.listVisible.length === 0) return;

    //렌더링용 데이터 추가
    const keysBench = this.statePool.listBench.map(x => x.key);
    this.stateData.listVisible.forEach(item => {
      if (keysBench.includes(item.key)) return true;
      this.statePool.listBench.push(item);
      // const component = new ScrollItem({ propsData: { data: item, itemType: 'tweet' } });
      // component.$vuetify = this.$vuetify;
      // component.$mount(this.scrollPort);
      // this.statePool.listBench.push(component);
    });
    //렌더링에서 뺴야 될 데이터 체크
    const keysVisible = this.stateData.listVisible.map(x => x.key);
    for (let i = 0; i < this.statePool.listBench.length; ) {
      if (keysVisible.includes(this.statePool.listBench[i].key)) {
        i++;
      } else {
        this.statePool.listBench.splice(i, 1);
      }
    }
  }

  SetIndex() {
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
    this.SetVisibleData();
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

  async SetVisibleData() {
    //중복 렌더링일 경우 로직 개선 필요
    if (this.listData.length === 0) return;

    this.stateData.listVisible = this.stateData.listData.slice(
      this.state.startIndex,
      this.state.endIndex
    );
  }
}
