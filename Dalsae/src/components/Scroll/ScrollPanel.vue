<template>
  <div class="scroll-panel" @scroll="OnScroll">
    <div class="view-port" ref="viewPort" :style="viewportStyle">
      <div class="scroll-area" :style="listStyle">
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
  height: 100vh;
  overflow-y: scroll;
}
</style>

<script lang="ts">
import { Vue, Mixins, Component, Ref, Provide, Watch } from 'vue-property-decorator';
import faker from 'faker';
import * as I from '@/Interfaces';
import * as M from '@/mixins';
import { mixins } from 'vue-class-component';

@Component
export default class ScrollPanel extends mixins(M.ScrollPanelBase) {}
</script>
