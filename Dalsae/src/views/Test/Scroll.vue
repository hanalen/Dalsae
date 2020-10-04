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

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class VirtualScroll extends Vue {
  // listData: Tweet[] = [];
  // async created() {
  //   await this.$nextTick();
  //   console.log(this.listData);
  //   this.listData = DataManager.listTweet;
  //   console.log(this.listData);
  // }
}
</script>
