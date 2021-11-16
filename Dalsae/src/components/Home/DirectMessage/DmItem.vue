<template>
  <div class="dm-item">
    <propic :user="user" :size="40" />
    <div class="dm" :style="styleDm" :class="{ me: itsMe }">
      <v-progress-circular
        v-if="isLoadImage"
        :width="3"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div v-if="isErrorLoadImage">
        <v-icon color="primary">mdi-alert-circle-outline</v-icon>
        <span>이미지 불러오기 에러</span>
      </div>
      <video v-if="isVideo" ref="refVideo" class="video-js"></video>
      <img v-if="img" :src="img" />
      <div v-html="text" class="left-message" @click="OnClickLink"></div>
      <span class=" time">{{ time }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dm-item {
  font-size: 14px;
  display: flex;
  margin-bottom: 10px;
}
.dm {
  margin-left: 10px;
  padding: 4px;
  max-width: 70%;
  border-radius: 0px 10px 10px 10px;
  background-color: #d5eefd;
}
img {
  max-width: 100%;
  object-fit: cover;
  border-radius: 20px;
}
.right-message {
  padding: 4px;
  max-width: 70%;
  border-radius: 10px 10px 0px 10px;
}
.time {
  font-size: 12px !important;
  margin: 0px 4px;
  color: rgb(156, 156, 156);
}
.video-js {
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop, Watch } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import moment from 'moment';
import axios from 'axios';
import { CreateHeader } from '@/API';
import { moduleDm } from '@/store/modules/DmStore';
import twitterRequest from '@/API/TwitterRequest';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

@Component
export default class DmItem extends Vue {
  @Prop()
  dm!: I.DMEvent;

  @Ref()
  refVideo!: HTMLVideoElement;
  player!: VideoJsPlayer;

  img = '';
  video = '';

  isLoadImage = false;
  isErrorLoadImage = false;

  get user() {
    if (this.itsMe) {
      return moduleSwitter.selectUser.user;
    } else {
      return moduleDm.stateDm.selectUser;
    }
  }

  get media() {
    return this.dm.message_create?.message_data?.attachment?.media;
  }

  get isVideo() {
    return this.media?.type !== 'photo' && this.media?.type;
  }

  get isGif() {
    return this.media?.type === 'animated_gif';
  }

  get photoUrl() {
    return this.media?.media_url_https;
  }

  get videoUrl() {
    if (!this.isVideo) return '';
    return this.media?.video_info?.variants[0].url;
  }

  get styleDm() {
    if (this.isVideo) {
      return {
        width: '70%'
      };
    }
  }

  @Watch('dm', { immediate: true, deep: true })
  OnWatchDm(newVal: I.DMEvent) {
    if (!this.media) return;

    if (this.isVideo) {
      this.DownloadImage(this.videoUrl);
    } else {
      this.DownloadImage(this.photoUrl);
    }
  }

  async DownloadImage(url: string | undefined) {
    if (!url) {
      this.isErrorLoadImage = true;
      return;
    }
    const method = 'GET';
    const oauth = new I.OAuth();
    oauth.SetKey(moduleSwitter.publicKey, moduleSwitter.secretKey);
    try {
      this.isLoadImage = true;
      const resp = await axios({
        method: method,
        url: url,
        headers: CreateHeader(oauth.GetHeader(undefined, method, url)),
        responseType: 'blob'
      });
      this.isLoadImage = false;
      const reader = new FileReader();
      reader.readAsDataURL(resp.data);
      reader.onload = e => {
        const img = e.target?.result as string;
        if (this.isVideo) {
          this.video = img;
          this.PlayVideo();
        } else this.img = img;
      };
    } catch (e) {
      this.isLoadImage = false;
      this.isErrorLoadImage = true;
    }
  }

  get itsMe() {
    return this.dm.message_create?.sender_id === moduleSwitter.selectID;
  }

  get text() {
    let text = this.dm.message_create?.message_data?.text;
    if (!text) return '';
    const entities = this.dm.message_create?.message_data?.entities;
    if (!entities) return text;
    const { urls, media } = entities;
    if (urls) {
      for (const url of urls) {
        text = text.replace(url.url, `<span class="url" ref="refUrl">${url.display_url}</span>`);
      }
    }
    if (media) {
      text = text.replace(media.url, `<span class="url" ref="refUrl">${media.display_url}</span>`);
    }
    // text += `<br/><span class="left-time">${this.time}</span>`;
    return text;
  }
  get time() {
    const stamp = Number.parseInt(this.dm.created_timestamp);
    const date = new Date(stamp);
    const locale = window.navigator.language;
    moment.locale(locale);
    return moment(date).calendar();
  }

  PlayVideo() {
    const option: VideoJsPlayerOptions = {
      controls: true,
      loop: this.isGif,
      fluid: true,
      controlBar: {
        volumePanel: !this.isGif,
        fullscreenToggle: false,
        pictureInPictureToggle: false
      },
      sources: [{ src: this.video, type: this.media?.video_info?.variants[0].content_type }]
    };
    this.player = videojs(this.refVideo, option);
  }

  OnClickLink(e: MouseEvent) {
    const el = e.target as Element;
    if (el.tagName === 'SPAN' && el.className === 'url') {
      const entities = this.dm.message_create?.message_data?.entities;
      const urls = entities?.urls;
      if (urls) {
        for (const url of urls) {
          if (url.display_url === el.innerHTML) {
            window.ipc.browser.OpenBrowser(url.expanded_url);
            return;
          }
        }
      }
      const media = entities?.media;
      if (media) {
        if (media.display_url === el.innerHTML) {
          window.ipc.browser.OpenBrowser(media.expanded_url);
        }
      }
    }
  }
}
</script>
