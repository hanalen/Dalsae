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
import TestItem from '@/components/Scroll/TestItem.vue';
import { moduleOption } from '@/store/modules/OptionStore';
class State {
  scrollTop = 0;
  startIndex = 0;
  endIndex = 50;
  translateY = 0;
  selectKey = '';
  index = 0;
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
  listBench: Vue[] = [];
  constructor() {
    this.listBench = [];
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

  // @Ref()
  // scrollItem!: Vue[];

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

  get isSmallTweet() {
    return moduleOption.uiOption.isSmallTweet;
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

  isRendered() {
    if (!this.isMounted) return false;
    // else if (this.$el.clientHeight === 0) return false;
    else return true;
  }

  get listVisible() {
    return this.stateData.listVisible;
  }

  ScrollToIndex(newVal: number) {
    if (newVal === -1) return;
    this.state.index = newVal;
    const selectData = this.stateData.listData[newVal];
    if (!selectData) return;
    (selectData.data as any).isRead = true;
    this.state.selectKey = selectData.key;
    const idx = this.listVisible.findIndex(x => x.key === selectData.key);
    if (idx === -1) {
      this.scrollPanel.scrollTo({ top: selectData.scrollTop });
      return;
    }
    const component = this.statePool.listBench.find(x => x.$props.data.key === selectData.key);
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
    this.Emit(newVal);
  }

  @Watch('isSmallTweet', { immediate: true, deep: true })
  OnChangeSmall() {
    this.SetIndex();
  }

  Emit(index: number) {
    const key = this.stateData.listData[index].key;
    for (let i = 0; i < this.statePool.listBench.length; i++) {
      const data = this.statePool.listBench[i].$props['data'] as M.ScrollItem<any>;
      this.statePool.listBench[i].$props['selected'] = data.key === key;
    }
  }

  @Watch('listData', { immediate: true, deep: true })
  OnChangeListData(newVal: any[]) {
    if (!newVal) return;
    if (newVal.length === 0) {
      this.Clear();
    }
    this.CreateScrollData();
    if (this.isRendered()) {
      this.SetIndex();
    } else {
      this.WaitTime();
    }
  }

  @Watch('state.scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    this.SetIndex();
  }
  WaitTime() {
    setTimeout(() => {
      if (!this.isRendered()) {
        this.WaitTime();
      } else {
        this.SetIndex();
      }
    }, 100);
  }

  AddData(data: any, index: number) {
    const minHeight = moduleUI.minHeight;
    if (!this.stateData.setKey.has(data.id_str)) {
      this.stateData.setKey.add(data.id_str);
      const prev = this.stateData.listData[index - 1];
      const scrollTop = prev ? prev.scrollTop + prev.height : index * minHeight;
      const item: M.ScrollItem<any> = {
        data: this.CreateData(data),
        key: data.id_str,
        height: minHeight,
        isResized: true,
        scrollTop: scrollTop
      };
      this.stateData.listData.splice(index, 0, item);
    }
    if (this.isRendered()) {
      this.SetIndex();
    }
  }

  RemoveData(key: string, index: number) {
    this.stateData.listData.splice(index, 1);
    this.stateData.setKey.delete(key);
    this.statePool.listBench.splice;
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
    //렌더링용 데이터 추가
    const keysBench = this.statePool.listBench.map(x => x.$props['data'].key);
    this.listVisible.forEach(item => {
      if (keysBench.includes(item.key)) {
        return true;
      }
      const selected = item.key === this.stateData.listData[this.state.index].key;
      const component = new ScrollItem({
        propsData: { data: item, itemType: this.itemType, selected: selected }
      });
      component.$on('on-resize', this.OnResizeTweet);
      component.$vuetify = this.$vuetify;
      this.statePool.listBench.push(component);

      const div = document.createElement('div');
      div.id = item.key;

      this.scrollPort.appendChild(div);
      component.$mount(div);
      this.$children.push(component);
      this.$nextTick(() => {
        //기본 observer 제거, 메모리 줄이는 로직
        delete component.$props['data'].data.__ob__;
        delete component.$props['data'].__ob__;
        delete component.$data.__ob__;
      });
    });
    //렌더링에서 뺴야 될 데이터 체크
    const keysVisible = this.listVisible.map(x => x.key);
    for (let i = 0; i < this.statePool.listBench.length; ) {
      if (keysVisible.includes(this.statePool.listBench[i].$props['data'].key)) {
        i++;
      } else {
        const destroy = this.statePool.listBench[i];
        this.statePool.listBench.splice(i, 1);
        destroy.$el.remove();
        destroy.$destroy();
      }
    }
  }

  SetIndex() {
    if (!this.isRendered()) {
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
      if (this.isSmallTweet) {
        this.state.endIndex += 10;
      }
      if (this.$el.clientHeight === 0) {
        setTimeout(() => {
          this.SetIndex();
        }, 100);
      }
      this.stateData.listVisible = this.stateData.listData.slice(
        this.state.startIndex,
        this.state.endIndex
      );
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
    const idx = this.stateData.listData.findIndex(x => x.key == resizeEvent.key);
    const data = this.stateData.listData[idx];
    if (!data) return;
    if (idx <= this.state.startIndex && this.scrollPanel.scrollTop > 0) {
      this.scrollPanel.scrollTo({ top: this.scrollPanel.scrollTop + moveY + moduleUI.minHeight });
    }
    this.MoveScroll(this.stateData.listData, idx, resizeEvent.newVal);
  }

  MoveScroll(listTweet: M.ScrollItem<any>[], idxFrom: number, height: number) {
    listTweet[idxFrom].height = height;
    let total = listTweet[idxFrom].scrollTop + listTweet[idxFrom].height;
    for (let i = idxFrom + 1, len = listTweet.length; i < len; i++) {
      listTweet[i].scrollTop = total;
      total += listTweet[i].height;
    }
  }

  Clear() {
    this.statePool.listBench.forEach(item => {
      item.$el.remove();
      item.$destroy();
    });
    this.stateData = new StateData();
    this.state = new State();
    this.statePool = new StatePool();
  }
}
