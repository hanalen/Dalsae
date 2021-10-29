<template>
  <div class="system-bar">
    <system-bar-item v-for="(item, i) in listSystemBar" :item="item" :key="i"></system-bar-item>
  </div>
</template>

<style lang="scss" scoped>
.system-bar {
  width: 100vh;
  height: 22px;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #007acc;
  display: flex;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleSysbar } from '@/store/modules/SystemBarStore';
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';

@Component
export default class SystemBar extends Vue {
  get listSystemBar() {
    return moduleSysbar.stateSystemBar.listSystemBarItem;
  }
}
</script>
