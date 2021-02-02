<template>
  <div class="tweet">
    <div class="tweet-conv">
      <v-icon>mdi-plus-box-outline</v-icon>
    </div>
    <div class="tweet-left">
      <propic :user="orgUser" :option="mngOption.uiOption"></propic>
    </div>
    <div class="tweet-text" style="margin-left:4px;">
      <span class="user-name">{{ name }}</span>
      <div v-html="tweetText"></div>
      <span class="tweet-date">{{ date }}{{ via }}</span>
    </div>
    <div class="img-preview">
      <image-preview :media="media"></image-preview>
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
.user-name {
  font-weight: bold;
  white-space: nowrap;
}
.tweet-date {
  color: hsla(0, 0, 20, 1);
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage, TweetBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class TweetNormal extends Mixins(TweetBase) {}
</script>
