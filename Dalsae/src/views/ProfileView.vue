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
    <div class="full-loading" v-if="isUpdateProfile">
      <v-progress-circular
        v-if="isUpdateProfile"
        :width="4"
        size="60"
        color="primary"
        indeterminate
        style="position: relative !important;"
      ></v-progress-circular>
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
              <v-text-field
                v-if="editMode"
                class="ma-0 "
                label="이름"
                v-model="state.name"
                height="20"
                hide-details
                style="font-size: 14px"
              ></v-text-field>
              <span v-else class="user-name">{{ name }}</span
              ><br />
              <div v-if="!editMode">
                <span class="user-screen-name">{{ screenName }}</span>
                <span class="follow-text" v-if="!editMode">
                  {{ followerText }}
                </span>
                <br />
                <br />
              </div>
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
            <v-btn
              v-if="itsMe"
              class="btn-follow"
              height="30"
              outlined
              color="primary"
              text
              @click="OnClickEdit"
            >
              {{ editText }}
            </v-btn>
          </div>
          <v-text-field
            v-if="editMode"
            height="20"
            class="ma-0 "
            label="자기소개 입력"
            v-model="state.bio"
            hide-details
            style="font-size: 14px"
          ></v-text-field>
          <div v-else v-html="userBio" @click="OnClickLink"></div>
          <div class="user-place color-gray">
            <v-icon v-if="!editMode" size="16">mdi-compass-outline </v-icon>
            <v-text-field
              v-if="editMode"
              height="20"
              class="ma-0 "
              label="위치 입력"
              v-model="state.place"
              hide-details
              style="font-size: 14px ;margin-top:12px !important"
            ></v-text-field>
            <span v-else>{{ place }}</span>
          </div>
          <div class="user-url">
            <v-icon v-if="!editMode" size="16">mdi-link-variant</v-icon>
            <v-text-field
              v-if="editMode"
              height="20"
              class="ma-0 "
              label="링크 입력"
              v-model="state.url"
              hide-details
              style="font-size: 14px ; margin-top:12px !important"
            ></v-text-field>
            <span v-else class="url" @click="OnClickProfileURL">{{ url }}</span>
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
            <v-tab-item eager class="tab-item" :key="0">
              <scroll-panel
                :listData="listFollowing"
                :itemType="'user'"
                :indexPanel="indexFollowing"
                :style="styleScroll"
                ref="refScrollFollowing"
              />
              <v-progress-circular
                v-if="isLoadFollowing"
                :width="3"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-tab-item>
            <v-tab-item eager class="tab-item" :key="1">
              <scroll-panel
                :listData="listFollower"
                :itemType="'user'"
                :indexPanel="indexFollower"
                :style="styleScroll"
                ref="refScrollFollower"
              />
              <v-progress-circular
                v-if="isLoadFollower"
                :width="3"
                color="primary"
                indeterminate
              ></v-progress-circular>
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
.full-loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(202, 202, 202, 0.4);
  z-index: 10;
}
input text {
  font-size: 14px !important;
}
.v-input__slot {
  margin: 0px !important;
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
  font-size: 14px !important;
}
.user-place {
  display: flex;
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
.v-tabs-bar {
  height: auto !important;
}
.v-tab {
  text-align: left !important;
}
.tab-item {
  height: calc(100vh - 552px);
}
.v-tabs:not(.v-tabs--vertical) .v-tab {
  white-space: none;
}
.v-avatar {
  border-radius: 10px !important;
}
.scroll-panel {
  padding: 4px;
  // overflow-y: scroll;
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
.v-progress-circular {
  position: absolute;
  left: 50%;
  top: 50%;
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
import { moduleOption } from '@/store/modules/OptionStore';
import { IPCPipeLine } from '@/mixins';

@Component
export default class ProfileView extends Mixins(MIX.ProfilePage, IPCPipeLine) {
  async created() {
    const id = this.$route.query.screenName.toString();
    await this.LoadUserInfo(id);
    this.LoadFollowerList();
    this.LoadFollowingList();
    moduleOption.ChangeOption({ ...moduleOption.uiOption, isBigPropic: false });
    this.$nextTick(() => {
      document.addEventListener('keydown', this.OnKeyDown);
      this.refScrollFollowing.$el.addEventListener('scroll', this.OnScrollFollowing);
      this.refScrollFollower.$el.addEventListener('scroll', this.OnScrollFollower);
    });
  }
}
</script>
