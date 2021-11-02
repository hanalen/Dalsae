<template>
  <!-- <div> -->
  <div ref="scrollPanel" tabindex="-1" class="scroll-panel" @scroll="OnScroll">
    <div ref="scrollPort" class="scroll-area">
      <scroll-item ref="scrollItem" v-for="(item, i) in datas" :key="i" :data="item">
        <tweet-selector :tweet="item.data" :selected="false" :index="i"></tweet-selector>
      </scroll-item>
    </div>
    <!-- <scroll-item
      ref="scrollItem"
      v-for="(item, i) in datas"
      :key="i"
      :data="item"
      v-on:on-resize="OnResizeTweet"
    >
      <tweet-selector :tweet="item.data" :selected="selectedId === item.key"></tweet-selector>
    </scroll-item> -->
  </div>
</template>

<style lang="scss" scoped>
.scroll-panel {
  height: calc(100vh - 134px);
  overflow-y: scroll;
  outline: none !important;
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
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Watch, Inject } from 'vue-property-decorator';
import faker from 'faker';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { mixins } from 'vue-class-component';
import { moduleTweet } from '@/store/modules/TweetStore';
import { eventBus } from '@/plugins/EventBus';
import { ETweetType } from '@/store/Interface';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleUtil } from '@/store/modules/UtilStore';
@Component
export default class ScrollPanelTwo extends M.ScrollPanelBaseTwo {
  @Ref()
  scrollPort!: HTMLElement;

  async created() {
    // eventBus.$on('AddedTweet', (tweetType: ETweetType) => {
    //   if (this.tweetType === tweetType) this.SetIndex();
    // });
    // eventBus.$on('PanelHome', (tweetType: ETweetType) => {
    //   if (this.tweetType !== tweetType) return;
    //   if (this.listData.length === 0) return;
    //   const first = this.listData[0];
    //   this.scrollPanel.scrollTo({ top: first.scrollTop });
    // });
    // eventBus.$on('PanelEnd', (tweetType: ETweetType) => {
    //   if (this.tweetType !== tweetType) return;
    //   if (this.listData.length === 0) return;
    //   const last = this.listData[this.listData.length - 1];
    //   this.scrollPanel.scrollTo({ top: last.scrollTop });
    // });
    // eventBus.$on('FocusPanel', (tweetType: ETweetType) => {
    //   if (this.tweetType !== tweetType) return;
    //   if (!moduleUtil.isFocusPanel) return;
    //   console.log('focus panel');
    //   this.scrollPanel.focus();
    // });
    // this.$nextTick(() => {
    //   window.addEventListener('resize', this.OnResizeWindow);
    //   this.SetIndex();
    // });
  }

  //TODO 호출이 너무 많이 됨
  // OnResizeTweet(data: M.ResizeEvent) {
  //   const moveY = data.newVal - data.oldVal;
  //   this.state.totalHeight += moveY;
  //   const idx = this.listData.findIndex(x => x.key == data.key);
  //   const tweet = this.listData[idx];
  //   if (!tweet) return;
  //   if (tweet.isResized && idx <= this.state.startIndex && this.scrollPanel.scrollTop > 0) {
  //     this.scrollPanel.scrollTo({ top: this.scrollPanel.scrollTop + moveY + 40 });
  //   }
  //   moduleTweet.MoveScroll({ height: data.newVal, idxFrom: idx, listTweet: this.listData });
  // }

  OnScroll() {
    this.state.scrollTop = this.scrollPanel.scrollTop;
  }
}
</script>
