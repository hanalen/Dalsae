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
        return moduleUI.statePanel.home.index;
      case ETweetType.E_MENTION:
        return moduleUI.statePanel.mention.index;
      case ETweetType.E_FAVORITE:
        return moduleUI.statePanel.favorite.index;
      case ETweetType.E_OPEN:
        return moduleUI.statePanel.open.index;
      case ETweetType.E_CONV:
        return moduleUI.statePanel.conv.index;
      default:
        return moduleUI.statePanel.home.index;
    }
  }

  get selectedId() {
    switch (this.tweetType) {
      case ETweetType.E_HOME:
        return moduleUI.statePanel.home.selectedId;
      case ETweetType.E_MENTION:
        return moduleUI.statePanel.mention.selectedId;
      case ETweetType.E_FAVORITE:
        return moduleUI.statePanel.favorite.selectedId;
      case ETweetType.E_OPEN:
        return moduleUI.statePanel.open.selectedId;
      case ETweetType.E_CONV:
        return moduleUI.statePanel.conv.selectedId;
      default:
        return moduleUI.statePanel.home.selectedId;
    }
  }

  @Watch('panelIndex')
  OnChangePanelIndex(newVal: number) {
    if (!this.scrollItem) return;
    const selectTweet = this.listData[newVal];
    const idx = this.state.listVisible.findIndex(x => x.key === selectTweet.key);
    if (idx === -1) {
      return;
    }
    const component = this.scrollItem[idx];
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
      this.scrollPanel.scrollTo({ top: selectTweet.scrollTop });
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
    if (this.$el.clientHeight === 0) {
      setTimeout(() => {
        this.SetIndex();
      }, 100);
    }
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
    const last = this.listData[this.listData.length - 1];
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

  key = 0;
  timer!: NodeJS.Timeout;
  OnResizeWindow() {
    clearTimeout(this.timer);
    // this.timer = setTimeout(() => {
    //   moduleTweet.Resized();
    // }, 100);
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
