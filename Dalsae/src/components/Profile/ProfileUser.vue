<template>
  <div class="profile-user" @click="OnClickUser">
    <v-badge :value="user.verified" avatar bottom overlap color="white" offset-x="20" offset-y="20">
      <template v-slot:badge>
        <v-icon style="font-size:18px; color:#1da1f2">mdi-check-decagram</v-icon>
      </template>
      <v-avatar rounded>
        <v-img :src="propic">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-avatar>
    </v-badge>
    <div class="profile-name">
      <div class="top">
        <div class="top-left">
          <span>{{ name }}</span>
          <span>{{ screenName }}</span>
        </div>
        <div class="top-right">
          <v-btn outlined color="primary" text @click="OnClickFollow">
            {{ followText }}
          </v-btn>
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
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleUtil } from '@/store/modules/UtilStore';

@Component
export default class ProfileUser extends Vue {
  @Prop()
  user!: I.User;

  OnClickUser(e: MouseEvent) {
    console.log(e);
    moduleProfile.ChangeShowUser(this.user);
  }

  get isLoad() {
    return moduleProfile.isFollwRequest;
  }

  set isLoad(isLoad: boolean) {
    moduleProfile.SetFollowRequest(isLoad);
  }

  async OnClickFollow() {
    console.log('foolow');
    moduleUtil.Follow(this.user);
  }

  get followText() {
    return this.user.following ? '언팔로우' : '팔로잉';
  }

  get propic() {
    return this.user.profile_image_url_https;
  }

  get name() {
    return this.user.name;
  }

  get screenName() {
    return this.user.screen_name;
  }

  get userBio() {
    const text = this.user.description;
    if (this.user.entities?.description.length > 0) {
      this.user.entities?.description.forEach(url => {
        text.replace(url.display_url, url.expanded_url);
      });
    }
    return this.user.description;
  }
}
</script>
