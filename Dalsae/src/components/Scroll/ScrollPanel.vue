<template>
  <!-- <div> -->
  <div ref="scrollPanel" tabindex="-1" class="scroll-panel" @scroll="OnScroll">
    <div ref="scrollPort" class="scroll-area" :style="viewportStyle">
      <!-- <scroll-item
        ref="scrollItem"
        v-for="(item, i) in listComponent"
        :data="item"
        :itemType="itemType"
        :key="i"
        :selected="item.key === state.selectKey"
        v-on:on-resize="OnResizeTweet"
      /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-panel {
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
import { moduleDom } from '@/store/modules/DomStore';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleUtil } from '@/store/modules/UtilStore';
@Component
export default class ScrollPanel extends M.ScrollPanelBase {
  async created() {
    this.$nextTick(() => {
      this.isMounted = true;
      window.addEventListener('resize', (e: Event) => {
        for (let i = 0, len = this.stateData.listData.length; i < len; i++) {
          this.stateData.listData[i].isResized = true;
        }
      });
      moduleDom.RegisteScrollPanel({ panel: this, panelType: this.tweetType });
    });
    eventBus.$on('FocusPanel', () => {
      if (this.scrollPanel) {
        this.scrollPanel.focus();
      }
    });
    eventBus.$on('PanelHome', (tweetType: ETweetType) => {
      if (this.tweetType !== tweetType) return;
      if (this.listData.length === 0) return;
      const { listData } = this.stateData;
      const first = listData[0];
      this.scrollPanel.scrollTo({ top: first.scrollTop });
    });
    eventBus.$on('PanelEnd', (tweetType: ETweetType) => {
      if (this.tweetType !== tweetType) return;
      if (this.listData.length === 0) return;
      const { listData } = this.stateData;
      const last = listData[listData.length - 1];
      this.scrollPanel.scrollTo({ top: last.scrollTop });
    });
  }

  OnScroll() {
    this.state.scrollTop = this.scrollPanel.scrollTop;
  }
}
</script>
