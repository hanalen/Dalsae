<template>
  <div class="dm-item">
    <div class="left" v-if="!itsMe">
      <span class="left-message">{{ text }}</span>
    </div>
    <div v-else class="right">
      <span class="right-message">{{ text }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dm-item {
  font-size: 14px;
  position: relative;
  width: auto;
  display: flex;
  margin-bottom: 6px;
}
.left,
.right {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
.left span,
.right span {
  max-width: 70%;
  word-break: break-all;
}
.left-message {
  padding: 4px;
  background-color: #d5eefd;
  border-radius: 10px 10px 10px 0px;
}
.right-message {
  padding: 4px;
  background-color: #e7f5fe;
  border-radius: 10px 10px 0px 10px;
}
.time {
  font-size: 12p;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';

@Component
export default class DmItem extends Vue {
  @Prop()
  dm!: I.DMEvent;

  get itsMe() {
    return this.dm.message_create?.sender_id === moduleSwitter.selectID;
  }

  get text() {
    return this.dm.message_create?.message_data?.text;
  }
  get time() {
    return 'weajkrwjaekr';
  }
}
</script>
