<template>
  <div class="profile-user" @click="OnClickUser" :class="{ selected: isSelected }">
    <propic :user="user" :option="uiOption"></propic>
    <div class="profile-name">
      <div class="profile-top">
        <div class="top-left">
          <span class="name">{{ name }}</span
          ><br />
          <span>{{ screenName }}</span>
        </div>
        <div class="top-right">
          <v-btn height="30" outlined color="primary" text @click="OnClickFollow">
            {{ followText }}
          </v-btn>
          <!-- <v-btn icon rounded @click="ClickMenu">
            <v-icon :color="'primary'">
              mdi-dots-horizontal
            </v-icon>
          </v-btn> -->
        </div>
      </div>
      <div class="bottom">
        <span>{{ userBio }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-user {
  display: flex;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
  padding: 4px;
  width: 100%;
}
.selected {
  background-color: rgb(231, 231, 231) !important;
}
.profile-user:hover {
  background-color: rgb(218, 218, 218) !important;
}
.v-avatar {
  border-radius: 10px;
}
.name {
  font-weight: bold;
}
.profile-name {
  margin-left: 4px;
  width: 100%;
}
.profile-top {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.v-btn {
  padding: 0 4px !important;
}
.v-badge__badge:after {
  transform: none !important;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { ContextItem } from '@/mixins';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export default class ProfileUser extends Vue {
  @Prop()
  user!: I.User;

  get uiOption() {
    return moduleOption.uiOption;
  }

  get isSelected() {
    return moduleProfile.showUser.screen_name === this.user.screen_name;
  }

  OnClickUser(e: MouseEvent) {
    moduleProfile.ChangeShowUser(this.user);
    if (moduleProfile.stateProfile.selectMenu === 0) {
      const idx = moduleProfile.listFollowing.users.findIndex(x => x.id === this.user.id);
      if (idx === -1) return;
      moduleProfile.SetState({ ...moduleProfile.stateProfile, indexFollowing: idx });
    } else {
      const idx = moduleProfile.listFollower.users.findIndex(x => x.id === this.user.id);
      if (idx === -1) return;
      moduleProfile.SetState({ ...moduleProfile.stateProfile, indexFollower: idx });
    }
  }

  get listContext() {
    let value = 0;
    const listContext: ContextItem[] = [];
    listContext.push({
      title: '차단하기',
      onClick: this.OnBlock,
      value: value++,
      isDivider: false
    });
    listContext.push({
      title: '뮤트 하기',
      onClick: this.OnMute,
      value: value++,
      isDivider: false
    });
    listContext.push({
      title: '리트윗 끄기',
      onClick: this.OnOffRetweet,
      value: value++,
      isDivider: false
    });
    return listContext;
  }

  get isLoad() {
    return moduleProfile.stateProfile.isFollwRequest;
  }

  set isLoad(isLoad: boolean) {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isFollwRequest: isLoad });
  }

  ClickMenu(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  async OnClickFollow(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    moduleUtil.Follow(this.user);
  }

  async OnBlock(value: number) {
    console.log('on block');
  }

  async OnOffRetweet(value: number) {
    console.log('on off rt');
  }

  async OnMute(value: number) {
    console.log('on mute');
  }

  get followText() {
    const user = this.user;
    const ids = moduleProfile.listFollowingIds.ids;
    if (!user) return '';
    if (moduleProfile.listRequestIds.ids.findIndex(x => x === user.id) > -1) {
      return '팔로우 요청 중';
    } else if (ids.findIndex(x => x === user.id) > -1) {
      return '언팔로우';
    } else {
      return '팔로잉';
    }
  }

  get propic() {
    return this.user.profile_image_url_https.replace('_normal', '');
  }

  get name() {
    return this.user.name;
  }

  get screenName() {
    return `@${this.user.screen_name}`;
  }

  get userBio() {
    let text = this.user.description;
    const { entities } = this.user;
    if (!entities) return text;
    const { url, description } = entities;
    if (url) {
      url.urls.forEach(url => {
        text = text.replace(url.url, url.display_url);
      });
    }
    if (description) {
      description.urls.forEach(url => {
        text = text.replace(url.url, url.display_url);
      });
    }
    return text;
  }
}
</script>
