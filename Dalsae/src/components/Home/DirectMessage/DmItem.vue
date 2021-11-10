<template>
  <div class="dm-item">
    <div class="left" v-if="!itsMe">
      <p>
        <span class="left-message">{{ text }}</span>
        <br />
        <span class="left-time"> {{ time }}</span>
      </p>
    </div>
    <div v-else class="right">
      <p>
        <span class="right-message">{{ text }}</span>
        <br />
        <span class="right-time"> {{ time }}</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dm-item {
  font-size: 14px;
  position: relative;
  width: auto;
  display: flex;
  margin-bottom: 10px;
}
.left,
.right {
  display: flex;
  width: 100%;
}
.left {
  justify-content: flex-start;
}
.left-time,
.right-time {
  position: absolute;
  color: rgb(156, 156, 156);
}
.right-time {
  right: 4px;
}
.item {
  display: flex;
  flex-direction: column;
  width: 70%;
  justify-content: flex-end;
}
.right,
.right-message {
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
import moment from 'moment';

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
    const stamp = Number.parseInt(this.dm.created_timestamp);
    const date = new Date(stamp);
    const locale = window.navigator.language;
    moment.locale(locale);
    return moment(date).calendar();
  }
}
</script>
