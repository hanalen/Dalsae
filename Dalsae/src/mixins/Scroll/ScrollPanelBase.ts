import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit, Watch } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/mixins';
import * as I from '@/Interfaces';

class State {
  scrollTop = 0;
  totalHeight = 0;
  listData: M.ScrollItem<I.Tweet>[] = [];
  listVisible: M.ScrollItem<I.Tweet>[] = [];
  startIndex = 0;
  endIndex = 50;
  translateY = 0;
  minHeight = 0;
  constructor() {
    this.listData = [];
    this.listVisible = [];
  }
}

export class ScrollPanelBase extends Vue {
  state = new State();
  name = '';
  @Watch('scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    const prevStartIdx = this.state.startIndex;
    const prevEndIdx = this.state.endIndex;
    this.state.scrollTop = this.$el.scrollTop;
    this.state.endIndex =
      this.state.startIndex + Math.floor(this.$el.clientHeight / this.state.minHeight);
    this.state.startIndex = this.BinarySearch(this.state.listData, this.state.scrollTop);
    this.state.translateY = this.state.listData[this.state.startIndex].scrollTop;
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

  async created() {
    for (let i = 0, len = this.state.listData.length; i < len; i++) {
      this.state.totalHeight += this.state.minHeight;
    }
    this.SetVisibleData();
    this.$nextTick(() => {
      window.addEventListener('resize', this.OnResizeWindow);
    });
  }

  OnResizeWindow() {
    for (let i = 0, len = this.state.listData.length; i < len; i++) {
      this.state.listData[i].isResized = true;
    }
  }

  OnResize(data: M.ResizeEvent) {
    //scrollTop은 랜더링 할 때 계산
    const moveY = data.newVal - data.oldVal;
    this.state.totalHeight += moveY;
    const idx = this.state.listData.findIndex(x => x.key == data.key) + 1; //key다음 idx부터 작업
    console.log('on resize idx' + idx);
    const len = this.state.listData.length;
    for (let i = idx; i < len; i++) {
      this.state.listData[i].scrollTop += moveY;
    }
  }

  get Total() {
    let sum = 0;
    this.state.listData.forEach(item => {
      sum += item.scrollTop;
    });
    return sum;
  }

  OnScroll() {
    this.state.scrollTop = this.$el.scrollTop;
  }

  SetVisibleData() {
    this.state.listVisible = this.state.listData.slice(this.state.startIndex, this.state.endIndex);
  }
}
