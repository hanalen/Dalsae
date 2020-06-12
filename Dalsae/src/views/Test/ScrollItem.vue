<template>
  <div class="item-inner" @click="Click">
    <div class="head">
      <span># {{ source.id }}</span
      ><br />
      <span>{{ source.name }}</span>
    </div>
    <div class="desc">{{ source.fullText }}</div>
    <div v-if="source.isFav">
      <span>관심글</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

class Source {
  isFav = false;
}

@Component
export default class VirtualScrollItem extends Vue {
  @Prop({ type: Object, default: () => {} })
  source!: Source;

  Click(e: Event) {
    console.log(e);
    this.source.isFav = true;
  }
}
</script>

<style lang="scss" scoped>
.item-inner {
  border: 1px solid black;
  font-weight: 500;
  padding-top: 0.5em;
  text-align: justify;
  display: flex;
  align-items: center;
  padding: 1em;
  border-bottom: 1px solid;
  border-color: lightgray;
  flex-direction: column;
}
</style>
