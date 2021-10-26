<template>
  <div class="ui-top-big">
    <div class="ui-top-left" v-if="isShowPropic">
      <img class="propic" :src="propicPath" :class="propicClass" />
    </div>
    <div class="ui-top-right">
      <tweet-input></tweet-input>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-top-big {
  height: 90px;
  padding: 4px !important;
  display: flex;
}
.ui-top-right {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 4px;
  padding-right: 4px;
}
.propic {
  object-fit: contain;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
.normal {
  width: 48px;
  height: 48px;
  border-radius: 4px;
}
.big {
  width: 73px;
  height: 73px;
  border-radius: 12px;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { DalsaeApp, UITopBase } from '@/mixins';
import faker from 'faker';
import { mixins } from 'vue-class-component';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleTweet } from '@/store/modules/TweetStore';
import { AddTweet, ETweetType } from '@/store/Interface';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { eventBus } from '@/plugins/EventBus';
@Component
export default class TopBig extends UITopBase {}
</script>
