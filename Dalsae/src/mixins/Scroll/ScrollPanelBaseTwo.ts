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

class StateData<T> {
  setKey: Set<string>;
  listData: M.ScrollItem<T>[];
  constructor() {
    this.setKey = new Set();
    this.listData = [];
  }
}

class StatePool {
  listBench: ScrollItem[];
  listVisible: ScrollItem[];
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

  @Prop()
  listData!: I.Tweet[];

  @Prop()
  tweetType!: ETweetType;

  async created() {
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
      item.$mount(this.scrollPanel);
    });
    this.statePool.listBench.push(item);
  }

  @Watch('listData', { immediate: true, deep: true })
  OnChangeListData(newVal: I.Tweet[]) {
    // console.log('on watch listData', newVal);
  }
  // @Watch('length', { immediate: true, deep: true })
  // OnChangelength(newVal: number) {
  // console.log('on watch length', newVal);
  // }

  // get length() {
  //   return this.listData.length;
  // }

  get datas() {
    const list = (this.listData as unknown) as I.Tweet[];
    // console.log('list', list.length);
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const current = list[i];
      if (!this.stateData.setKey.has(current.id_str)) {
        this.stateData.setKey.add(current.id_str);
        const item: M.ScrollItem<I.Tweet> = {
          data: new I.Tweet(current),
          key: current.id_str,
          height: 40,
          isResized: false,
          scrollTop: 0
        };
        if (new I.Tweet(current).orgUser === undefined) {
          console.log('unde!!!! i', i);
        }
        this.stateData.listData.splice(i, 0, item);
      } else {
        // console.log('exists');
      }
    }
    console.log('datas!!!!!!!');
    console.log(this.stateData.listData, this.listData);
    return this.stateData.listData;
  }
}
