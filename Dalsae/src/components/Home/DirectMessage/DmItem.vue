<template>
  <div class="dm-item">
    <propic :user="user" :size="40" />
    <div class="dm" :class="{ me: itsMe }">
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

@Component
export default class DmItem extends Vue {
  @Prop()
  dm!: I.DMEvent;

  img = '';

  get user() {
    if (this.itsMe) {
      return moduleSwitter.selectUser.user;
    } else {
      return moduleDm.stateDm.selectUser;
    }
  }

  @Watch('dm', { immediate: true, deep: true })
  OnWatchDm(newVal: I.DMEvent) {
    const url = newVal.message_create?.message_data?.attachment?.media?.media_url_https;
    if (url) {
      this.DownloadImage(url);
    } else {
      this.img = '';
    }
  }

  async DownloadImage(url: string) {
    const method = 'GET';
    const oauth = new I.OAuth();
    oauth.SetKey(moduleSwitter.publicKey, moduleSwitter.secretKey);
    const resp = await axios({
      method: method,
      url: url,
      headers: CreateHeader(oauth.GetHeader(undefined, method, url)),
      responseType: 'blob'
    });
    console.log(resp);
    const reader = new FileReader();
    reader.readAsDataURL(resp.data);
    reader.onload = e => {
      const img = e.target?.result as string;
      this.img = img;
    };
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

  OnClickLink(e: MouseEvent) {
    const el = e.target as Element;
    if (el.tagName === 'SPAN' && el.className === 'url') {
      const entities = this.dm.message_create?.message_data?.entities;
      const urls = entities?.urls;
      if (urls) {
        for (const url of urls) {
          if (url.display_url === el.innerHTML) {
            window.preload.OpenBrowser(url.expanded_url);
            return;
          }
        }
      }
      const media = entities?.media;
      if (media) {
        if (media.display_url === el.innerHTML) {
          window.preload.OpenBrowser(media.expanded_url);
        }
      }
    }
  }
}
</script>
