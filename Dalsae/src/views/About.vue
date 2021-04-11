<template>
  <div class="about" ref="about" @scroll="OnScroll">
    <div class="view-port" ref="viewPort" :style="viewportStyle">
      <div class="log-area">
        <!-- <span>total height: {{ totalHeight }}</span> -->
      </div>
      <div class="scroll-area" :style="listStyle">
        <scroll-item
          ref="scrollItem"
          v-for="(item, i) in listVisible"
          :key="i"
          :data="item"
          v-on:on-resize="OnResize"
        >
        </scroll-item>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  height: 100vh;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  // display: none; /* Chrome, Safari, Opera*/
}
.view-port {
  // overflow: scroll;
}
</style>

<script lang="ts">
import { Vue, Mixins, Component, Ref, Provide, Watch } from 'vue-property-decorator';
import faker from 'faker';
import * as I from '@/Interfaces';
import item from './Test/ScrollItem.vue';

const minHeight = 20;
const dataLength = 500;

@Component
export default class About extends Vue {
  scrollTop = 0;
  totalHeight = 0;
  listData: I.ScrollItem<I.ScrollData>[] = [];
  listVisible: I.ScrollItem<I.ScrollData>[] = [];
  startIndex = 0;
  endIndex = 50;
  translateY = 0;

  // get TStartIndex() {
  //   return this.BinarySearch(this.listData, this.scrollTop);
  // }

  // TEndIndex = 0;

  @Ref()
  viewPort!: HTMLElement;
  @Ref()
  about!: HTMLElement;
  @Ref()
  scrollItem!: Vue[];

  @Watch('scrollTop')
  OnWatchScrollTop(newVal: number, oldVal: number) {
    // const idx = newVal / 100;
    // if (Number.isInteger(idx)) {
    //   this.translateY = this.listData[idx].scrollTop;
    //   console.log('translate chagned');
    // }
    const prevStartIdx = this.startIndex;
    const prevEndIdx = this.endIndex;
    this.scrollTop = this.about.scrollTop;
    this.endIndex = this.startIndex + Math.floor(this.about.clientHeight / minHeight);
    this.startIndex = this.BinarySearch(this.listData, this.scrollTop);
    this.translateY = this.listData[this.startIndex].scrollTop;
    const startIdx = this.startIndex;
    const endIdx = this.endIndex;
    // console.log(prevStartIdx, startIdx, prevEndIdx, endIdx);
    if (prevStartIdx !== startIdx || prevEndIdx !== endIdx) this.SetVisibleData();
  }

  BinarySearch(list: I.ScrollItem<I.ScrollData>[], scrollTop: number) {
    let low = 0;
    let high = list.length - 1;
    let mid;
    while (low < high) {
      mid = Math.floor((high + low) / 2);
      const item = list[mid];
      if (item.scrollTop <= scrollTop && scrollTop <= item.scrollTop + item.height) {
        // console.log('fit mid:' + mid);
        return mid;
      } else if (list[mid].scrollTop > scrollTop) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    mid = Math.floor((high + low) / 2);
    const item = list[mid];
    // console.log(`low: ${low}, mid: ${mid}, high: ${high}`);
    if (item.scrollTop <= scrollTop && scrollTop <= item.scrollTop + item.height) {
      // console.log(`final if mid: ${mid}`);
      return mid;
    } else {
      // console.log(`final else mid: ${mid - 1}`);
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
      height: this.totalHeight + 'px',
      willChange: 'auto',
      overflow: 'hidden',
      position: 'relative'
    };
  }

  get listStyle() {
    return {
      // transform: 'translateY(-' + 0 + 'px)'
      willChange: 'auto',
      transform: 'translateY(' + this.translateY + 'px)'
    };
  }

  async created() {
    faker.locale = 'ko';
    for (let i = 0; i < dataLength; i++) {
      this.listData.push({
        key: i.toString(),
        data: { text: faker.lorem.text() },
        height: minHeight,
        scrollTop: i * minHeight,
        isResized: true
      });
      this.totalHeight += minHeight;
    }
    this.SetVisibleData();
    this.$nextTick(() => {
      window.addEventListener('resize', this.OnResizeWindow);
    });
  }

  OnResizeWindow() {
    for (let i = 0, len = this.listData.length; i < len; i++) {
      this.listData[i].isResized = true;
    }
  }

  OnResize(data: I.ResizeEvent) {
    // console.log('on resize');
    const moveY = data.newVal - data.oldVal;
    this.totalHeight += moveY;
    const idx = this.listData.findIndex(x => x.key == data.key) + 1; //key다음 idx부터 작업
    const len = this.listData.length;
    for (let i = idx; i < len; i++) {
      this.listData[i].scrollTop += moveY;
    }
  }

  get Total() {
    let sum = 0;
    this.listData.forEach(item => {
      sum += item.scrollTop;
    });
    return sum;
  }

  OnScroll(e: Event) {
    // console.log(e);
    this.scrollTop = this.about.scrollTop;
  }

  SetVisibleData() {
    // console.log('set visivle data');
    this.listVisible = this.listData.slice(this.startIndex, this.endIndex);
  }
}
</script>
