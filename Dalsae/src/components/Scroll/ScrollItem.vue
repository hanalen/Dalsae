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
import { moduleOption } from '@/store/modules/OptionStore';
@Component
export default class ScrollItem extends Vue {
  @Prop()
  data!: I.ScrollItem<any>;

  @Prop()
  itemType!: string;

  selected = false;

  @Watch('data', { immediate: true, deep: true })
  OnChangeData() {
    this.$nextTick(() => {
      this.SetHeight();
    });
  }
  obs!: ResizeObserver;

  async created() {
    this.$on('on-change-selected-key', this.OnChangeSelectedKey);
    this.$nextTick(() => {
      // this.SetHeight();
      this.obs = new ResizeObserver(() => {
        this.SetHeight();
      });
      this.obs.observe(this.$el);
    });
  }

  get itemStyle() {
    return {
      top: `${this.data.scrollTop}px`
    };
  }

  SetHeight() {
    if (!this.data) return;
    // if (!this.data.isResized) return;
    // this.data.height = newVal;
    this.$nextTick(() => {
      const oldVal = this.data.height;
      const newVal = this.$el.clientHeight;
      if (newVal === 0 || oldVal === newVal) return;
      this.$emit('on-resize', {
        oldVal: oldVal,
        newVal: newVal,
        key: this.data.key.toString()
      });
    });
  }

  async destroyed() {
    if (this.obs) {
      this.obs.unobserve(this.$el);
      this.obs.disconnect();
    }
  }

  OnChangeSelectedKey(key: string) {
    this.selected = this.data.key === key;
  }
}
</script>
