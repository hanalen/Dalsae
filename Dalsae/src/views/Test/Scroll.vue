<template>
  <div class="scroll-area">
    <VirtualList
      class="list"
      :data-key="'id'"
      :data-sources="listData"
      :data-component="ScrollItemComponent"
      :estimate-size="20"
    >
    </VirtualList>
  </div>
</template>

<script>
import { DataMng } from './TestDataManager';
import VirtualList from 'vue-virtual-scroll-list';
import ScrollItem from './ScrollItem.vue';
export default {
  name: 'VirtualScroll',
  components: {
    // ScrollItem
    VirtualList
  },
  data: function() {
    return {
      listData: [],
      ScrollItemComponent: ScrollItem
    };
  },
  created: function() {
    this.$nextTick(() => {
      console.log(this.listData);
      this.listData = DataMng.Instence().listTweet;
      console.log(this.listData);
    });
  }
};
</script>
