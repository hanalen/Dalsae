<template>
  <div class="dm-item">
    <div class="left" v-if="!itsMe">
      <div v-html="text" class="left-message" @click="OnClickLink"></div>
      <span class=" time">{{ time }}</span>
    </div>
    <div v-else class="right">
      <span class="time"> {{ time }}</span>
      <div v-html="text" class="right-message" @click="OnClickLink"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dm-item {
  font-size: 14px;
  position: relative;
  width: auto;
  display: flex;
  margin-bottom: 10px;
}
.left,
.right {
  display: flex;
  width: 100%;
}
.right,
.right-message {
  justify-content: flex-end;
}
.left span,
.right span {
  max-width: 70%;
  word-break: break-all;
}
.left-message {
  padding: 4px;
  max-width: 70%;
  background-color: #d5eefd;
  border-radius: 10px 10px 10px 0px;
}
.right-message {
  padding: 4px;
  max-width: 70%;
  background-color: #e7f5fe;
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
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import moment from 'moment';

@Component
export default class DmItem extends Vue {
  @Prop()
  dm!: I.DMEvent;

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
