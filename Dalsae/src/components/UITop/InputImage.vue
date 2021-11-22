<template>
  <div>
    <div class="input-video">
      <div class="video-view" v-if="video">
        <video ref="refVideo" class="video-js"></video>
      </div>
    </div>
    <div class="input-image" v-if="listImage.length > 0">
      <div class="image-list list-one" v-if="length === 1">
        <add-image :img="listImage[0]" :index="0"></add-image>
      </div>
      <div class="image-list list-two" v-else-if="length === 2">
        <add-image :img="listImage[0]" :index="0"></add-image>
        <add-image :img="listImage[1]" :index="1"></add-image>
      </div>
      <div class="image-list list-three" v-else-if="length === 3">
        <div class="left">
          <add-image :img="listImage[0]" :index="0"></add-image>
          <add-image :img="listImage[2]" :index="2"></add-image>
        </div>
        <div class="right">
          <add-image :img="listImage[1]" :index="1"></add-image>
        </div>
      </div>
      <div class="image-list list-four" v-else-if="length === 4">
        <div class="left">
          <add-image :img="listImage[0]" :index="0"></add-image>
          <add-image :img="listImage[2]" :index="2"></add-image>
        </div>
        <div class="right">
          <add-image :img="listImage[1]" :index="1"></add-image>
          <add-image :img="listImage[3]" :index="3"></add-image>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-image {
  width: 500px;
  height: 280px;
  overflow: hidden;
}
.image-list {
  display: flex;
  flex-direction: row;
  width: 500px;
  height: 280px;
}
.left,
.right {
  display: flex;
  flex-direction: column;
}
.list-one {
  .img-item {
    width: 100%;
    height: 280px;
  }
}
.list-two {
  flex-direction: row;
  .img-item {
    width: 50%;
    height: 280px;
  }
}
.list-three {
  .left .img-item {
    width: 250px;
    height: 140px;
  }
  .right .img-item {
    width: 250px;
    height: 280px;
  }
}
.list-four {
  // flex-wrap: wrap;
  .img-item {
    // width: 25%;
    width: 250px;
    height: 140px;
  }
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { moduleUI } from '@/store/modules/UIStore';
import { Vue, Mixins, Component, Ref, Provide, Watch } from 'vue-property-decorator';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import 'video.js/dist/video-js.css';

@Component
export default class TopSmall extends Vue {
  get className() {
    const len = this.listImage.length;
    if (len === 1) {
      return 'list-one';
    } else if (len === 2) {
      return 'list-two';
    } else if (len === 3) {
      return 'list-three';
    } else if (len === 4) {
      return 'list-four';
    }
  }
  get listImage() {
    return moduleUI.stateInput.listImage;
  }
  get length() {
    return this.listImage.length;
  }

  get video() {
    return moduleUI.stateInput.video;
  }

  @Watch('video')
  OnWatchVideo(newVal: string) {
    if (newVal) {
      this.PlayVideo();
    }
  }

  @Ref()
  refVideo!: HTMLVideoElement;

  player!: VideoJsPlayer;

  PlayVideo() {
    const option: VideoJsPlayerOptions = {
      controls: true,
      loop: false,
      fluid: true,
      controlBar: {
        volumePanel: false,
        fullscreenToggle: false,
        pictureInPictureToggle: false
      },
      sources: [{ src: this.video, type: 'video/mp4' }]
    };
    this.player = videojs(this.refVideo, option);
  }
}
</script>
