<template>
  <div class="tweet">
    <div class="tweet-conv">
      <v-icon>mdi-plus-box-outline</v-icon>
    </div>
    <div class="tweet-left">
      <propic :user="orgUser"></propic>
    </div>
    <div class="tweet-right">
      <div v-html="tweetText"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet {
  display: flex;
  font-size: 14px;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
  padding: 4px;
}
.tweet-conv {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage, TweetBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class TweetNormal extends Mixins(TweetBase) {}
</script>
