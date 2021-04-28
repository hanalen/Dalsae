<template>
  <div class="scroll-item">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.scroll-item {
  box-shadow: 0 0 0 1px #000 inset;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import * as I from '@/mixins';
@Component
export default class ScrollItem extends Vue {
  // observer!: ResizeObserver;
  @Prop()
  data!: I.ScrollItem<I.ScrollData>;

  @Watch('data', { immediate: true, deep: true })
  OnChangeData(newVal: I.ScrollItem<I.ScrollData>, oldVal: I.ScrollItem<I.ScrollData>) {
    this.$nextTick(() => {
      this.SetHeight();
    });
  }

  async created() {
    this.$nextTick(() => {
      this.SetHeight();
      // this.observer = new ResizeObserver(() => {
      //   this.SetHeight();
      // });
      // this.observer.observe(this.$el);
    });
  }

  SetHeight() {
    if (!this.data || !this.data.isResized) return;

    const oldVal = this.data.height;
    const newVal = this.$el.clientHeight;
    this.data.height = newVal;
    this.data.isResized = false;
    // console.log(this.$el.getClientRects());
    const top = this.$el.getBoundingClientRect().y;
    this.$emit('on-resize', {
      oldVal: oldVal,
      newVal: newVal,
      key: this.data.key.toString(),
      top: top
    });
  }

  async destroyed() {
    // this.observer?.disconnect();
  }
}
</script>
