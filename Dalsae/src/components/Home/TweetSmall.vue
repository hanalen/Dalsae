<template>
  <div class="tweet-small">
    <div class="tweet-conv">
      <v-icon size="18px" v-show="isConv">mdi-chat-plus</v-icon>
    </div>
    <div class="tweet-left" v-if="isShowPropic">
      <img :src="propic" />
    </div>
    <div class="tweet-text" style="margin-left:4px;">
      <div v-html="tweetText" :style="styleTweetText"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet-small {
  display: flex;
  font-size: 14px;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
  padding: 2px;
  width: 100%;
  height: 30px;
  max-height: 30px;
  overflow-y: hidden;
}
img {
  width: 48px;
  height: 20px;
  object-fit: cover;
  border-radius: 4px;
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
  overflow-y: hidden;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as M from '@/mixins';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export default class TweetSmall extends M.TweetBase {
  get propic() {
    return this.orgUser.profile_image_url_https;
  }
  get isShowPropic() {
    return moduleOption.uiOption.isShowPropic;
  }
}
</script>
