<template>
  <div class="about" ref="about" @scroll="OnScroll">
    <div class="view-port" ref="viewPort" :style="viewportStyle">
      <div class="log-area">
        <span>total height: {{ totalHeight }}</span>
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
  display: none; /* Chrome, Safari, Opera*/
}
.view-port {
  // overflow: scroll;
}
</style>

<script lang="ts">
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import faker from 'faker';
import * as I from '@/Interfaces';
import item from './Test/ScrollItem.vue';

const minHeight = 20;

@Component
export default class About extends Vue {
  translateY = 0;
  totalHeight = 0;
  listData: I.ScrollItem<I.ScrollData>[] = [];

  @Ref()
  viewPort!: HTMLElement;
  @Ref()
  about!: HTMLElement;
  @Ref()
  scrollItem!: Vue[];

  get startIndex() {
    return 0;
  }

  get endIndex() {
    return 20;
  }
  get listVisible(): I.ScrollItem<I.ScrollData>[] {
    return this.listData.splice(this.startIndex, this.endIndex);
  }

  get viewportStyle() {
    return {
      'background-color': 'aliceblue',
      height: this.totalHeight + 'px',
      overflow: 'hidden',
      position: 'relative'
    };
  }

  get listStyle() {
    return {
      transform: 'translateY(-' + this.translateY + 'px)'
    };
  }

  async created() {
    faker.locale = 'ko';
    for (let i = 0; i < 100; i++) {
      this.listData.push({
        key: i,
        data: { text: faker.lorem.text() },
        height: minHeight,
        scrollTop: i * minHeight,
        isResized: false
      });
      this.totalHeight += minHeight;
    }
  }

  OnResize(data: I.ResizeEvent) {
    this.totalHeight += data.newVal - data.oldVal;
  }

  OnScroll(e: Event) {
    this.translateY = this.about.scrollTop;
  }
}
</script>
