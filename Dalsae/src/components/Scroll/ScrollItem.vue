<template>
  <div class="scroll-item" :style="itemStyle">
    <div v-if="itemType === 'tweet'">
      <tweet-selector :tweet="data.data" :selected="selected"></tweet-selector>
    </div>
    <div v-if="itemType === 'user'">
      <profile-user :user="data.data" :selected="selected" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-item {
  position: absolute;
  width: 100%;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import * as I from '@/mixins';
@Component
export default class ScrollItem extends Vue {
  @Prop()
  data!: I.ScrollItem<any>;

  @Prop()
  itemType!: string;

  @Prop()
  selected!: boolean;

  @Watch('data', { immediate: true, deep: true })
  OnChangeData(newVal: I.ScrollItem<any>, oldVal: I.ScrollItem<any>) {
    this.$nextTick(() => {
      this.SetHeight();
    });
  }

  async created() {
    this.$nextTick(() => {
      this.SetHeight();
    });
  }

  get itemStyle() {
    return {
      top: `${this.data.scrollTop}px`
    };
  }

  SetHeight() {
    if (!this.data || !this.data.isResized) return;

    const oldVal = this.data.height;
    const newVal = this.$el.clientHeight;
    if (newVal === 0 || oldVal === newVal) return;
    this.data.height = newVal;
    this.$emit('on-resize', {
      oldVal: oldVal,
      newVal: newVal,
      key: this.data.key.toString()
    });
  }

  async destroyed() {
    // this.observer?.disconnect();
  }
}
</script>
