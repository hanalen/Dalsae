<template>
  <div>
    <div class="no-data" v-if="isNoData">
      <span>트윗을 볼 수 없습니다.</span><br />
      <span>링크를 클릭 해주시기 바랍니다.</span>
    </div>
    <div v-else class="qt-tweet" @click="OnClickQT">
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
        <div class="retweet-info" v-if="isRetweet">
          <propic :size="20" :user="tweet.user" :option="uiOption"></propic>
          <span>{{ retweetText }}</span>
        </div>
      </div>
      <div class="img-preview" v-if="isShowPreview">
        <image-preview :media="media" :tweet="tweet"></image-preview>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-data {
  flex-direction: column;
}
.qt-tweet,
.no-data {
  display: flex;
  font-size: 14px;
  border: dashed 1px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 4px;
  width: 100%;
  background-color: #edf6fc;
}
.qt-tweet:hover {
  cursor: pointer;
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
.retweet-info {
  display: flex;
}
.retweet-info span {
  margin-left: 8px;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as M from '@/mixins';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { ETweetType } from '@/store/Interface';
@Component
export default class QtTweet extends M.TweetBase {
  OnClickQT(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (this.isNoData) return;
    moduleUtil.AddQtTweet(this.tweet);
  }
}
</script>
