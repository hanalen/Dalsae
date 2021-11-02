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

class StateData<T> {
  setKey: Set<string>;
  listData: M.ScrollItem<T>[];
  constructor() {
    this.setKey = new Set();
    this.listData = [];
  }
}

export class ScrollPanelBaseTwo extends Vue {
  state = new State();
  stateData = new StateData();

  @Ref()
  scrollPanel!: HTMLElement;

  @Ref()
  scrollItem!: Vue[];

  @Prop()
  listData!: I.Tweet[];

  @Prop()
  tweetType!: ETweetType;

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
