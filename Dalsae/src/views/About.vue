<template>
  <div class="about" ref="about" @scroll="OnScroll">
    <div class="view-port" ref="viewPort" :style="viewportStyle">
      <div class="log-area">
        <span>total height: {{ totalHeight }}</span>
        <button @click="Add">add</button>
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
// import * as I from '@/Interfaces';
import * as M from '@/mixins';
import item from './Test/ScrollItem.vue';

const minHeight = 20;
const dataLength = 500;

@Component
export default class About extends Vue {}
</script>
