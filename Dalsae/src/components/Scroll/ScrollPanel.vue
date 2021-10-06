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
      this.AddTemp(tweet.id_str);
      this.SetIndex();
      this.scrollPanel.scrollTo({ top: this.state.scrollTop + 40 });
    });

    this.$nextTick(() => {
      window.addEventListener('resize', this.OnResizeWindow);
      this.SetIndex();
    });
  }

  AddTemp(id: string) {
    //scrolltop이 0보다 크고 start ~ end 사이일 경우에만 사용
    if (this.state.scrollTop > 0) {
      const idx = this.listData.findIndex(x => x.data.id_str === id);
      this.state.listAddedKey.splice(0, 0, id);
      // if (this.state.startIndex <= idx && idx <= this.state.endIndex) {
      //   this.state.listAddedKey.push(id);
      // }
    }
  }

  //TODO 호출이 너무 많이 됨
  OnResizeTweet(data: M.ResizeEvent) {
    const moveY = data.newVal - data.oldVal;
    this.state.totalHeight += moveY;
    const idx = this.listData.findIndex(x => x.key == data.key);
    moduleTweet.MoveScroll({ height: data.newVal, idxFrom: idx, listTweet: this.listData });
    console.log(this.state.startIndex, this.state.endIndex);
    // if (this.state.scrollTop > 0) {
    //   //화면 밖에 있을 때 추가되고 렌더링될 떄 스크롤이 튐
    //   const keyIndex = this.state.listAddedKey.findIndex(x => x === data.key);
    //   if (keyIndex > -1) {
    //     console.log('-----------------------------');
    //     console.log(this.scrollPanel.scrollTop);
    //     console.log(this.listData.findIndex(x => x.key === data.key));
    //     // console.log(keyIndex);
    //     console.log(data);
    //     this.scrollPanel.scrollTo({ top: this.state.scrollTop - data.oldVal + data.newVal });
    //     this.state.listAddedKey.splice(keyIndex, 1);
    //   }
    // }
  }

  OnScroll() {
    this.state.scrollTop = this.scrollPanel.scrollTop;
  }
}
</script>
