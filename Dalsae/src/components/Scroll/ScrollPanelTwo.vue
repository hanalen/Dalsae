<template>
  <!-- <div> -->
  <div ref="scrollPanel" tabindex="-1" class="scroll-panel" @scroll="OnScroll">
    <div ref="scrollPort" class="scroll-area">
      <scroll-item v-for="(item, i) in listComponent" :data="item" :itemType="'tweet'" :key="i" />
    </div>
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
  async created() {
    this.$nextTick(() => {
      window.addEventListener('resize', (e: Event) => {
        console.log('resize', e);
      });
    });
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
