<template>
  <div class="scroll-panel" @scroll="OnScroll" v-if="state != undefined">
    <!-- <div class="view-port" ref="viewPort" :style="viewportStyle"> -->
    <div ref="scrollPort" class="scroll-area" :style="viewportStyle">
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
    <!-- </div> -->
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
    eventBus.$on('AddTweetHome', () => {
      this.SetVisibleData();
    });
    // this.AddTestData();

    this.$nextTick(() => {
      window.addEventListener('resize', this.OnResizeWindow);
      this.SetVisibleData();
    });
  }

  OnResize(data: M.ResizeEvent) {
    const moveY = data.newVal - data.oldVal;
    this.state.totalHeight += moveY;
    const idx = this.listData.findIndex(x => x.key == data.key) + 1; //key다음 idx부터 작업
    moduleTweet.MoveScroll({ moveY: moveY, idxFrom: idx, listTweet: this.listData });
  }

  OnScroll() {
    this.state.scrollTop = this.$el.scrollTop;
  }
}
</script>
