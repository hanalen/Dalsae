<template>
  <!-- <div> -->
  <div ref="scrollPanel" class="scroll-panel" @scroll="OnScroll" v-if="state != undefined">
    <div ref="scrollPort" class="scroll-area" :style="viewportStyle">
      <scroll-item
        ref="scrollItem"
        v-for="(item, i) in this.state.listVisible"
        :key="i"
        :data="item"
        v-on:on-resize="OnResizeTweet"
      >
        <tweet-selector :tweet="item.data"></tweet-selector>
      </scroll-item>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-panel {
  height: calc(100vh - 134px);
  overflow-y: scroll;
}
.scroll-area {
  position: relative;
}
.temp-tweet {
  position: absolute;
  transform: translateX(-10000px);
}
</style>

<script lang="ts">
import { Vue, Mixins, Component, Ref, Provide, Watch, Inject } from 'vue-property-decorator';
import faker from 'faker';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';
import { eventBus } from '@/plugins/EventBus';
@Component
export default class ScrollPanel extends M.ScrollPanelBase {
  @Ref()
  scrollPort!: HTMLElement;

  async created() {
    eventBus.$on('AddedTweet', (tweet: I.Tweet) => {
      console.log('addedtweet \r\n', tweet.full_text.substring(0, 10));
      this.SetIndex();
    });
    eventBus.$on('AddedList', () => {
      console.log('addedtweetList');
      this.SetIndex();
    });

    this.$nextTick(() => {
      window.addEventListener('resize', this.OnResizeWindow);
      this.SetIndex();
    });
  }

  //TODO 호출이 너무 많이 됨
  OnResizeTweet(data: M.ResizeEvent) {
    const moveY = data.newVal - data.oldVal;
    this.state.totalHeight += moveY;
    const idx = this.listData.findIndex(x => x.key == data.key);
    const tweet = this.listData[idx];
    if (tweet.isResized && idx <= this.state.startIndex && this.scrollPanel.scrollTop > 0) {
      this.scrollPanel.scrollTo({ top: this.scrollPanel.scrollTop + moveY + 40 });
    }
    moduleTweet.MoveScroll({ height: data.newVal, idxFrom: idx, listTweet: this.listData });
  }

  OnScroll() {
    this.state.scrollTop = this.scrollPanel.scrollTop;
  }
}
</script>
