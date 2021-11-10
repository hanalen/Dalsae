<template>
  <div class="dm-user" @click="OnClick" :class="{ selected: selected }">
    <div class="dm-user-top">
      <div class="propic">
        <img :src="img" />
        <v-icon v-if="verified" color="primary">mdi-check-decagram-outline </v-icon>
      </div>
      <div class="text-area">
        <p class="bold">{{ name }}</p>
        <p>{{ text }}</p>
      </div>
    </div>
    <p>{{ time }}</p>
  </div>
</template>

<style lang="scss" scoped>
.dm-user {
  width: 100%;
  // height: 80px;
  padding: 8px;
  // display: flex;
  font-size: 14px !important;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
}
.dm-user:hover {
  background-color: #d5eefd;
}
.selected {
  background-color: #e7f5fe;
}
.text-area {
  margin-left: 4px;
  width: calc(100% - 52px);
}
.bold {
  font-weight: bold;
}
p {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 !important;
}
.dm-user-top {
  display: flex;
}
img {
  border-radius: 15%;
  width: 48px;
}
.v-icon {
  position: absolute !important;
  right: 0px;
  bottom: 0px;
  background-color: white !important;
  border-radius: 50%;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import moment from 'moment';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleDm } from '@/store/modules/DmStore';

@Component
export default class DmUser extends Vue {
  @Prop()
  user!: I.User;

  get selected() {
    return moduleDm.stateDm.selectUser.id_str === this.user.id_str;
  }

  get img() {
    return this.user.profile_image_url_https.replace('_normal', '');
  }

  get verified() {
    return this.user.verified;
  }

  get name() {
    return this.user.screen_name + ' / ' + this.user.name;
  }

  get text() {
    let text = this.user.last_direct_message?.message_create?.message_data?.text;
    if (!text) return '';
    const urls = this.user.last_direct_message?.message_create?.message_data?.entities?.urls;
    const media = this.user.last_direct_message?.message_create?.message_data?.entities?.media;
    if (urls) {
      for (const url of urls) {
        text = text.replace(url.url, url.display_url);
      }
    }
    if (media) {
      text = text.replace(media.url, media.display_url);
    }
    return text;
  }

  get time() {
    if (!this.user.last_direct_message?.created_timestamp) return '';
    const locale = window.navigator.language;
    moment.locale(locale);
    const stamp = Number.parseInt(this.user.last_direct_message?.created_timestamp);
    const date = new Date(stamp);
    return moment(date).format('LLLL') + ':' + moment(date).format('ss');
  }
  OnClick(e: MouseEvent) {
    moduleDm.ChangeSelectUser(this.user);
  }
}
</script>
