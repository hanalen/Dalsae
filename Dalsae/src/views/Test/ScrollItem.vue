<template>
  <div class="scroll-item">
    <!-- <span>{{ height }}</span> -->
    <span>{{ data.data.text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.scroll-item {
  border: 1px solid black;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class ScrollItem extends Vue {
  @Prop()
  data!: I.ScrollItem<I.ScrollData>;

  @Prop()
  source!: I.ScrollItem<I.ScrollData>;

  @Watch('source', { immediate: true, deep: true })
  OnChangeData(newVal: I.ScrollItem<I.ScrollData>, oldVal: I.ScrollItem<I.ScrollData>) {
    // console.log('on change datas');
    // console.log(newVal);
    // console.log(oldVal);
  }

  async created() {
    this.$nextTick(() => {
      this.SetHeight();
    });
  }

  SetHeight() {
    if (!this.data) return;
    const oldVal = this.data.height;
    const newVal = this.$el.clientHeight;
    this.data.height = newVal;
    this.$emit('on-resize', { oldVal: oldVal, newVal: newVal });
  }
}
</script>
