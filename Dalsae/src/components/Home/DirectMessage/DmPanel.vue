<template>
  <div class="dm-panel" :style="stylePanel">
    <div class="dm-left">
      <dm-user v-for="(user, i) in listUser" :key="i" :user="user" />
    </div>
    <div class="dm-right"></div>
  </div>
</template>

<style lang="scss" scoped>
.dm-panel {
  display: flex;
}
.dm-left {
  width: 400px;
  height: 100%;
  overflow-y: scroll;
  background-color: azure;
}
.dm-right {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: gray;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleDm } from '@/store/modules/DmStore';

@Component
export default class DmPanel extends Vue {
  get stylePanel() {
    if (moduleOption.uiOption.isSmallInput) {
      return {
        height: 'calc(100vh - 99px)'
      };
    } else {
      return {
        height: 'calc(100vh - 156px)'
      };
    }
  }
  get listUser() {
    return moduleDm.listUser;
  }
}
</script>
