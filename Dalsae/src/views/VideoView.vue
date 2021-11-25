<template>
  <v-app class="app">
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
      <v-container class="container" fluid>
        <div :style="styleTweet" ref="refTweet">
          <tweet-selector v-if="isShowTweet" :selected="false" :tweet="tweet"></tweet-selector>
        </div>
        <v-progress-circular
          class="progress"
          v-if="!isLoadVideo"
          :width="5"
          size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <div class="video-view" :style="styleContent" v-show="isLoadVideo">
          <video ref="refVideo" class="video-js"></video>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.video-view {
  background-color: black;
  display: flex;
  justify-content: center;
}
.progress {
  position: fixed;
  top: 50%;
  left: 50%;
}
.video-js {
  max-width: 100% !important;
  max-height: 100% !important;
}
.app {
  background-color: black !important;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component, Mixins, Ref, Watch } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleOption } from '@/store/modules/OptionStore';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import 'video.js/dist/video-js.css';
import { moduleModal } from '@/store/modules/ModalStore';
import { IPCPipeLine, Messagetype } from '@/mixins';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
@Component
export default class VideoView extends Mixins(Vue, IPCPipeLine) {
  bExpanded = false;
  bMounted = false;
  isLoadVideo = false;
  isLoaded = false;

  @Ref()
  refTweet!: HTMLElement;

  get isShowTweet() {
    return moduleOption.uiOption.isShowTweet && this.tweet.orgTweet !== undefined;
  }

  get listMsg() {
    return moduleModal.stateMessage.listMessage;
  }
  get styleContent() {
    const mount = this.bMounted;
    if (!mount) return;
    let height = 50;
    if (this.isShowTweet) height += this.refTweet.clientHeight;
    return {
      height: `calc(100vh - ${height}px)`
    };
  }
  get styleTweet() {
    if (!this.bExpanded) {
      return {
        'max-height': '150px',
        overflow: 'hidden'
      };
    }
  }
  get option() {
    return moduleOption.uiOption;
  }
  @Ref()
  refVideo!: HTMLVideoElement;

  player!: VideoJsPlayer;

  PlayVideo() {
    if (!this.media) return;
    const variant = this.media.video_info?.variants[0];
    if (!variant) return;
    const { url, content_type } = variant;
    const isGif = this.media.type === 'animated_gif';
    const option: VideoJsPlayerOptions = {
      autoplay: true,
      controls: true,
      loop: isGif,
      controlBar: { volumePanel: !isGif, fullscreenToggle: false, pictureInPictureToggle: false },
      sources: [{ src: url, type: content_type }]
    };
    this.player = videojs(this.refVideo, option, () => {
      this.isLoadVideo = true;
    });
  }

  get media() {
    if (!this.tweet.orgTweet) return undefined;
    else return this.tweet.extended_entities.media[0];
  }

  get tweet() {
    return moduleImage.tweet;
  }

  @Watch('tweet')
  OnWatchTweet(newVal: I.Tweet, oldVal: I.Tweet) {
    console.log('watch tweet', oldVal, newVal);
    if (newVal.orgTweet) {
      // this.isLoaded
      setTimeout(() => {
        this.isLoaded = true;
        this.PlayVideo();
      }, 1000);
    }
  }

  async created() {
    const id = this.$route.query.tweetId;
    this.$nextTick(() => {
      if (!id) {
        moduleModal.AddMessage({
          errorType: Messagetype.E_ERROR,
          time: 10,
          message: '동영상 플레이어 오류'
        });
        return;
      }
      this.bMounted = true;
    });
  }
}
</script>
