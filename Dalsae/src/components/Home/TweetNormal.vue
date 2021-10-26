<template>
  <div class="tweet" :class="{ selected: selected }">
    <div class="tweet-conv">
      <v-icon size="18px" v-show="isConv">mdi-chat-plus</v-icon>
    </div>
    <div class="tweet-left">
      <propic :user="orgUser" :option="uiOption"></propic>
    </div>
    <div class="tweet-text" style="margin-left:4px;">
      <span class="user-name">{{ name }}</span>
      <div v-html="tweetText"></div>
      <span class="tweet-date">{{ date }}{{ via }}</span>
    </div>
    <div class="img-preview">
      <image-preview :media="media" :tweet="tweet"></image-preview>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet {
  display: flex;
  font-size: 14px;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
  padding: 4px;
  width: 100%;
}
.tweet:hover {
  background-color: #d5eefd;
}
.tweet-conv {
  width: 20px;
  padding-right: 2px;
}
.tweet-text {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
.selected {
  background-color: #e7f5fe;
}
.tweet-conv {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  font-weight: bold;
  white-space: inherit;
}
.tweet-date {
  color: hsla(0, 0, 20, 1);
}
</style>

<script lang="ts">
import { DalsaeApp, TweetBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class TweetNormal extends TweetBase {}
</script>
