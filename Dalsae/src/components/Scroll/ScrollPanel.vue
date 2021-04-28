<template>
  <div class="scroll-panel" @scroll="OnScroll" v-if="state != undefined">
    <div class="view-port" ref="viewPort" :style="viewportStyle">
      <div ref="scrollPort" class="scroll-area" :style="listStyle">
        <scroll-item
          ref="scrollItem"
          v-for="(item, i) in state.listVisible"
          :key="i"
          :data="item"
          v-on:on-resize="OnResize"
        >
          <tweet-selector :tweet="item.data"></tweet-selector>
        </scroll-item>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-panel {
  height: calc(100vh - 134px);
  overflow-y: scroll;
}
</style>

<script lang="ts">
import { Vue, Mixins, Component, Ref, Provide, Watch } from 'vue-property-decorator';
import faker from 'faker';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';

@Component
export default class ScrollPanel extends M.ScrollPanelBase {
  @Ref()
  scrollPort!: HTMLElement;
  async created() {
    // this.AddTestData();

    this.$nextTick(() => {
      window.addEventListener('resize', this.OnResizeWindow);
      for (let i = 0, len = this.listData.length; i < len; i++) {
        this.state.totalHeight += this.state.minHeight;
      }
      this.SetVisibleData();
    });
  }

  OnResize(data: M.ResizeEvent) {
    console.log('onresized');
    //scrollTop은 랜더링 할 때 계산
    const moveY = data.newVal - data.oldVal;
    this.state.totalHeight += moveY;
    const idx = this.listData.findIndex(x => x.key == data.key) + 1; //key다음 idx부터 작업
    // const len = this.listData.length;
    console.log(this.scrollPort.getBoundingClientRect());
    const top = data.top - this.scrollPort.getBoundingClientRect().top;
    moduleTweet.MoveScroll({ moveY: moveY, idxFrom: idx, listTweet: this.listData, top: top });
    // for (let i = idx; i < len; i++) {
    //   this.listData[i].scrollTop += moveY;
    // }
  }

  OnScroll() {
    this.state.scrollTop = this.$el.scrollTop;
  }
}
</script>
