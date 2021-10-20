<template>
  <div>
    <v-progress-circular
      v-if="isLoad"
      :width="5"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-else class="profile-view">
      <div class="profile-header">
        <v-img :src="userHeader">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
      <div class="profile">
        <div class="profile-left">
          <v-avatar class="img-propic" rounded :size="84">
            <v-img :src="userPropic">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-avatar>
          <div class="profile-count">
            <div class="profile-count-left">
              <span>트윗</span><br />
              <span>팔로잉</span><br />
              <span>팔로워</span><br />
            </div>
            <div class="profile-count-right">
              <span @click="ClickTweet">{{ countTweet }}</span>
              <span>{{ countFollowing }}</span>
              <span>{{ countFollower }}</span>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <span class="user-name">{{ name }}</span>
          <span class="user-screen-name">{{ screenName }}</span
          ><br />
          <span class="user-bio">{{ userBio }} </span>
          <div class="user-place">
            <span>{{ place }}</span>
          </div>
          <div class="user-url">
            <span>{{ url }}</span>
          </div>
        </div>
      </div>
      <v-tabs v-model="selectMenu">
        <v-tab :key="0">
          팔로잉
        </v-tab>
        <v-tab :key="1">
          팔로워
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="selectMenu">
        <v-tab-item :key="0">
          팔로잉 목록
        </v-tab-item>
        <v-tab-item :key="1">
          팔로워 목록
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile,
.profile-left,
.profile-count-left,
profile-count-right,
profile-count {
  display: flex;
}
.profile-count-left,
profile-count-right {
  flex-direction: column;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { moduleSwitter } from '@/store/modules/SwitterStore';

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
    this.$nextTick(() => {
      console.log('profile window created');
      const id = this.$route.query.screenName.toString();
      console.log('id: ' + id);
      const switter = window.preload.profile.GetSwitter(id);
      moduleSwitter.InitSwitter(switter);
      this.LoadUserInfo(id);
    });
  }
}
</script>
