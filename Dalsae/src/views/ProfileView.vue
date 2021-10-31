<template>
  <v-app class="profile-view">
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
    <v-progress-circular
      v-if="isLoadProfile"
      :width="5"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-else>
      <div>
        <v-img class="profile-header" :src="userHeader">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
      <div class="profile">
        <div class="profile-left">
          <div class="propic">
            <v-badge
              :value="verified"
              avatar
              bottom
              overlap
              color="white"
              offset-x="20"
              offset-y="20"
            >
              <template v-slot:badge>
                <v-icon style="font-size:18px; color:#1da1f2">mdi-check-decagram</v-icon>
              </template>
              <v-avatar rounded :size="84">
                <v-img :src="userPropic">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <!-- <img ref="refImg" :src="img" :class="imgClass" /> -->
              </v-avatar>
            </v-badge>
          </div>
          <div class="profile-count">
            <div class="profile-count-left">
              <span>트윗</span>
              <span>팔로잉</span>
              <span>팔로워</span>
            </div>
            <div class="profile-count-right color-gray">
              <span @click="ClickTweet">{{ countTweet }}</span>
              <span @click="OnClickShowFollowing">{{ countFollowing }}</span>
              <span @click="OnClickShowFollower">{{ countFollower }}</span>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <div class="profile-right-top">
            <div>
              <span class="user-name">{{ name }}</span
              ><br />
              <span class="user-screen-name">{{ screenName }}</span>
              <span class="follow-text">
                {{ followerText }}
              </span>
              <br />
              <br />
            </div>
            <v-btn
              v-if="!itsMe"
              class="btn-follow"
              height="30"
              outlined
              color="primary"
              text
              @click="OnClickFollow"
            >
              {{ followText }}
            </v-btn>
          </div>
          <span class="user-bio">{{ userBio }} </span>
          <div class="user-place color-gray">
            <v-icon size="16">mdi-compass-outline </v-icon>
            <span>{{ place }}</span>
          </div>
          <div class="user-url">
            <v-icon size="16">mdi-link-variant</v-icon>
            <span class="url" @click="OnClickProfileURL">{{ url }}</span>
          </div>
        </div>
      </div>
      <div>
        <v-tabs v-model="selectMenu">
          <v-tab :key="0">
            <div class="tab-name">
              <div class="tab-name-left">
                {{ selectScreenName }}
                <br />
                {{ selectName }}
              </div>
              <div class="tab-name-right">
                의 팔로잉
              </div>
            </div>
          </v-tab>
          <v-tab :key="1">
            <div class="tab-name">
              <div class="tab-name-left">
                <div>
                  {{ selectScreenName }}

                  <br />
                  {{ selectName }}
                </div>
              </div>
              <div class="tab-name-right">
                의 팔로워
              </div>
            </div>
          </v-tab>
        </v-tabs>
        <div class="scroll-panel">
          <v-tabs-items v-model="selectMenu">
            <v-tab-item class="tab-item" :key="0">
              <profile-user v-for="(user, i) in listFollowing" :user="user" :key="i" />
            </v-tab-item>
            <v-tab-item class="tab-item" :key="1">
              <profile-user v-for="(user, i) in listFollower" :user="user" :key="i" />
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <system-bar></system-bar>
      <v-menu v-model="isShowContext" :position-x="x" :position-y="y" absolute offset-y>
        <v-list>
          <v-list-item-group>
            <v-list-item v-for="(user, i) in listUser" :key="i" @click="OnClickAccount(user)">
              <template>
                <div class="context-item">
                  <span> @{{ user.screen_name }} </span>
                </div>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </div>
  </v-app>
</template>

<style lang="scss" scoped>
.profile,
.profile-count-left,
.profile-count-right,
.profile-count,
tab-name {
  display: flex;
}
.v-application {
  line-height: normal !important;
}
.app-alert {
  pointer-events: none;
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
  align-items: center;
  width: 100vw;
}
.profile-count-left,
.profile-count-right {
  flex-direction: column;
}
.profile-count-left {
  width: 50px;
}
.profile-count-right {
  width: 60px;
}
.color-gray,
.follow-text {
  color: rgb(156, 156, 156);
}
.profile-right-top {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.profile-right {
  width: 100%;
}
.color-gray:hover {
  cursor: pointer;
}
.profile-count-left span,
.profile-count-right span {
  margin-bottom: 4px;
}
.count-text {
  margin-bottom: 4px;
}
.profile-count-left {
  text-align: right;
  margin-right: 10px;
}
.profile-right span {
  margin-bottom: 4px;
}
.profile-count {
  padding: 4px;
}
.profile-view {
  padding: 4px;
  font-size: 14px;
}
.profile-header {
  border-radius: 20px;
  margin-bottom: 8px;
  height: 250px;
}
.profile {
  height: 200px;
}
.propic {
  margin-left: 20px;
  width: 84px;
  height: 84px;
}
.user-name {
  font-weight: bold;
  font-size: 16px;
}
.btn-follow {
  position: relative;
  right: 10px;
  top: 10px;
}
.url {
  color: #1d9bf0;
}
.url:hover {
  cursor: pointer;
}
.v-tabs-bar {
  height: auto !important;
}
.v-tab {
  text-align: left !important;
}
.tab-item {
  height: calc(100vh - 530px);
}
.v-tabs:not(.v-tabs--vertical) .v-tab {
  white-space: none;
}
.v-avatar {
  border-radius: 10px !important;
}
.scroll-panel {
  padding: 4px;
  overflow-y: scroll;
}

.v-list-item {
  min-height: 24px !important;
  max-width: 300px !important;
  font-size: 14px !important;
}
.context-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleProfile } from '@/store/modules/ProfileStore';
import { moduleApi } from '@/store/modules/APIStore';
import { moduleSysbar } from '@/store/modules/SystemBarStore';
import { ESystemBar } from '@/store/Interface';

@Component
export default class ProfileView extends MIX.ProfilePage {
  /*
    헤더 이미지

    프사 영역		프로필 이름 영역				     버튼 영역
    트윗	    	이름					              더보기	언팔로우/팔로우
    팔로잉	   	x 님은 나를 팔로우 하고 있습니다.
    팔로워	  	한줄띄고
                계정 만든날짜
                생일
                바이오
                위치
                링크

    목록 영역
    프로필 이름
    screnn_name
                님의팔로잉	xx님의팔로워  <- 탭으로
    name
    하단 햄버거버튼

  */
  async created() {
    const testFollowing = window.preload.LoadTestFriends();
    console.log(testFollowing);
    moduleSwitter.AddFollowingList({
      followList: testFollowing,
      selectId: moduleSwitter.selectID
    });
    moduleProfile.SetSelectUserFollowingList(testFollowing);
    const testSwitter = window.preload.LoadSwitter();
    moduleSwitter.InitSwitter(testSwitter);
    moduleProfile.ChangeShowUser(testSwitter.selectUser.user);

    moduleProfile.ChangeSelectUser(testSwitter.selectUser.user);

    return;
    console.log('profile window created');
    const id = this.$route.query.screenName.toString();
    console.log('id: ' + id);
    const switter = window.preload.profile.GetSwitter(id);
    moduleSwitter.InitSwitter(switter);
    await this.LoadUserInfo(id);
    this.LoadFollowerList();
    this.LoadFollowingList();
    moduleSwitter.initFollowDatas(window.preload.profile.GetFollowDatas(id));
    moduleSwitter.InitBlockIds(window.preload.profile.GetBlockIds(id));
  }
}
</script>
