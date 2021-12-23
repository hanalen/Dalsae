<template>
  <div>
    <div class="header">
      <img class="profile-header" :src="userHeader" />
      <div class="overlay" />
      <v-icon class="edit-btn" style="font-size:28px; color:#1da1f2" offset-x="20"
        >mdi-camera-enhance</v-icon
      >
    </div>
    <div class="profile">
      <div class="profile-left">
        <div class="propic">
          <img class="v-avatar" :src="userPropic" />
          <div class="overlay" />
          <v-icon class="edit-btn" style="font-size:28px; color:#1da1f2" offset-x="20"
            >mdi-camera-enhance</v-icon
          >
        </div>
      </div>
      <div class="profile-right">
        <div class="profile-right-top">
          <div>
            <v-text-field
              class="ma-0 "
              label="이름"
              v-model="state.name"
              height="20"
              hide-details
              style="font-size: 14px"
            ></v-text-field>
            <br />
          </div>
          <div>
            <v-btn
              class="btn-follow"
              height="30"
              outlined
              color="primary"
              text
              @click="OnClickEdit(true)"
            >
              저장
            </v-btn>
            <v-btn
              class="btn-follow"
              height="30"
              outlined
              color="error"
              text
              @click="OnClickEdit(false)"
            >
              취소
            </v-btn>
          </div>
        </div>
        <v-text-field
          height="20"
          class="ma-0 "
          label="자기소개 입력"
          v-model="state.bio"
          hide-details
          style="font-size: 14px"
        ></v-text-field>
        <div class="user-place color-gray">
          <v-text-field
            height="20"
            class="ma-0 "
            label="위치 입력"
            v-model="state.place"
            hide-details
            style="font-size: 14px ;margin-top:12px !important"
          ></v-text-field>
        </div>
        <div class="user-url">
          <v-text-field
            height="20"
            class="ma-0 "
            label="링크 입력"
            v-model="state.url"
            hide-details
            style="font-size: 14px ; margin-top:12px !important"
          ></v-text-field>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile,
.header {
  display: flex;
  width: 100vw;
  position: relative;
}

.header {
  height: 250px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.profile-header {
  border-radius: 20px;
  height: 250px;
}
.profile {
  height: 200px;
}
.overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 10px;
  background-color: rgba(128, 128, 128, 0.5);
}
.profile-left {
  width: 128px;
}
.profile-right {
  width: calc(100vw - 128px);
  margin-right: 4px;
}
.profile-right-top {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.btn-follow {
  margin-right: 8px;
}

.profile-header {
  border-radius: 20px;
  margin-bottom: 8px;
  height: 250px;
  width: 100%;
}

.v-avatar {
  border-radius: 10px !important;
  width: 84px;
  height: 84px;
}
.edit-btn {
  position: absolute !important;
  top: calc(50% - 14px);
  left: calc(50% - 14px);
  background-color: white;
  border-radius: 50%;
}
.edit-btn:hover {
  cursor: pointer;
}
.propic {
  margin-left: 20px;
  width: 84px;
  height: 84px;
  position: relative;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleApi } from '@/store/modules/APIStore';

@Component
export default class ProfileView extends Vue {
  get state() {
    return moduleProfile.stateUpdateProfile;
  }
  get showUser() {
    return moduleProfile.showUser;
  }

  get userHeader() {
    return this.showUser.profile_banner_url + '/1080x360';
  }

  get userPropic() {
    return this.showUser.profile_image_url_https.replace('_normal', '');
  }

  get name() {
    return this.state.name;
  }
  set name(value: string) {
    moduleProfile.SetStateUpdateProfile({ ...this.state, name: value });
  }

  get bio() {
    return this.state.bio;
  }

  set bio(value: string) {
    moduleProfile.SetStateUpdateProfile({ ...this.state, bio: value });
  }
  get place() {
    return this.state.place;
  }

  set place(value: string) {
    moduleProfile.SetStateUpdateProfile({ ...this.state, place: value });
  }
  get url() {
    return this.state.url;
  }

  set url(value: string) {
    moduleProfile.SetStateUpdateProfile({ ...this.state, url: value });
  }

  OnClickEdit(isSave: boolean) {
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isEditMode: false });
    if (isSave) {
      const { name, url, place, bio } = moduleProfile.stateUpdateProfile;
      moduleApi.account.UpdateProfile(name, url, place, bio);
    }
  }
}
</script>
