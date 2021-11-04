<template>
  <div
    class="system-bar-item"
    v-if="item"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    :style="styleItem"
    @click="OnClick"
  >
    <v-icon size="20">
      {{ item.icon }}
    </v-icon>
    <span>
      {{ item.text }}
    </span>
    <div class="tooltip" v-if="isHover">
      <span>
        {{ item.toolTip }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.system-bar-item {
  display: flex;
  margin-left: 4px;
}
.system-bar-item:hover {
  background-color: #008ae6 !important;
}
.system-bar-item span {
  font-size: 14px !important;
}
.v-icon {
  color: white !important;
}
span {
  color: white;
  margin-top: 2px;
}
.tooltip {
  position: absolute;
  bottom: 20px;
  margin-left: 10px;
  width: auto;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  padding: 0px 8px;
  background-color: rgba(160, 160, 160, 0.9);
}
.tooltip span {
  // text-align: center;
  color: white !important;
  // vertical-align: middle;
}
</style>

<script lang="ts">
import * as A from '@/store/Interface';
import { DalsaeApp } from '@/mixins';
import { moduleUI } from '@/store/modules/UIStore';
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';

@Component
export default class SystemBarItem extends Vue {
  @Prop()
  item!: A.SystemBarItem;

  isHover = false;

  get styleItem() {
    if (!this.item.onClick) {
      return '';
    } else {
      return {
        cursor: 'pointer'
      };
    }
  }
  OnClick(e: MouseEvent) {
    if (this.item.onClick) this.item.onClick(e);
  }
}
</script>
