<template>
  <v-app>
    <div class="app-alert">
      <v-alert
        dense
        text
        :type="item.errorType"
        v-for="(item, i) in listMsg"
        :key="i"
        transition="scale-transition"
      >
        {{ item.message }}
      </v-alert>
    </div>
    <v-main app>
      <v-container fluid :style="styleTop">
        <div :style="styleTweet" ref="refTweet">
          <tweet-selector
            v-if="option.isShowTweet"
            :selected="false"
            :tweet="tweet"
          ></tweet-selector>
        </div>
      </v-container>
    </v-main>
    <div class="video-view">
      <video ref="refVideo" class="video-js"></video>
    </div>
  </v-app>
</template>

<style lang="scss" scoped>
.video-view {
  background-color: gray;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component, Mixins, Ref } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleOption } from '@/store/modules/OptionStore';
import videojs from 'video.js';
import { VideoJsPlayerOptions, ControlBarOptions } from '@types/video.js';
import 'video.js/dist/video-js.css';
import { moduleModal } from '@/store/modules/ModalStore';
@Component
export default class VideoView extends Vue {
  bExpanded = false;
  bMounted = false;
  get listMsg() {
    return moduleModal.stateMessage.listMessage;
  }
  get styleTop() {
    if (!this.bExpanded) {
      return {
        'max-height': '180px'
      };
    }
  }
  get styleTweet() {
    if (!this.bExpanded) {
      return {
        'max-height': '150px',
        overflow: 'hidden'
      };
    }
  }
  get styleContent() {
    return {
      height: 'calc(100vh - 310px)'
    };
  }

  get option() {
    return moduleImage.option;
  }
  @Ref()
  refVideo!: HTMLVideoElement;

  player!: videojs.VideoJsPlayer;

  media!: I.Media;

  tweet!: I.Tweet;
  async created() {
    const tweets = window.preload.LoadTestTweet();
    this.tweet = new I.Tweet(tweets[1]);
    this.media = this.tweet.extended_entities.media[0];
    this.$nextTick(() => {
      this.bMounted = true;
      const { url, content_type } = this.media.video_info.variants[0];
      const option: VideoJsPlayerOptions = {
        autoplay: true,
        controls: true,
        loop: this.media.type === 'animated_gif',
        sources: [{ src: url, type: content_type }]
      };
      this.player = videojs(this.refVideo, option);
    });
    return;
    const id = this.$route.query.tweetId;
    if (id) {
      const option = window.preload.video.GetOption(id.toString());
      moduleOption.ChangeOption(JSON.parse(option));
      const json = window.preload.video.GetTweet(id.toString());
      this.tweet = new I.Tweet(JSON.parse(json));
    }
  }
}
</script>
