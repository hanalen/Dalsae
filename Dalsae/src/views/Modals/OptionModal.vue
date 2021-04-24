<template>
  <div>
    <v-list>
      <v-list-item>
        <v-card width="256px">
          <v-avatar
            class="clickAble"
            v-for="(item, i) in listUser"
            :key="i"
            :size="40"
            @click="OnClickAccount(item)"
          >
            <img :src="item.user.profile_image_url" />
          </v-avatar>
          <v-icon class="clickAble" style="font-size:48px; color:#1da1f2" @click="OnClickAddAccount"
            >mdi-dots-horizontal-circle-outline</v-icon
          >
          <v-icon class="clickAble" style="font-size:48px; color:#1da1f2" @click="OnClickOption"
            >mdi-cog</v-icon
          >
        </v-card>
        <!-- <v-list-item-content> -->
        <!-- <v-list-item-title>John Leider</v-list-item-title> -->
        <!-- </v-list-item-content> -->
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>UI 설정</v-list-item-title>
          <v-switch v-model="option.isShowPropic" label="인장을 표시"></v-switch>
          <v-switch v-model="option.isBigPropic" label="인장을 크게 표시"></v-switch>
          <v-switch v-model="option.isShowPreview" label="이미지 미리보기를 표시"></v-switch>
          <v-switch v-model="option.isSmallTweet" label="트윗을 한 줄로 표시"></v-switch>
          <v-switch v-model="option.isUseRead" label="읽지 않은 트윗을 굵게 표시"></v-switch>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>트윗 작성 공간 설정</v-list-item-title>
          <v-switch v-model="option.isSmallInput" label="작게 표시"></v-switch>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>트윗 전송 설정</v-list-item-title>
          <v-switch v-model="option.isSendCheck" label="트윗 전송 시 확인 창 표시"></v-switch>
          <v-switch
            v-model="option.isSendEnter"
            label="Enter로 전송. 해제 시 Ctrl+Enter로 전송"
          ></v-switch>
          <v-switch
            v-model="option.isSendRTProtected"
            label="잠금 사용자의 트윗 복사 리트윗"
          ></v-switch>
          <v-switch v-model="option.isSendRTCheck" label="리트윗 시 확인창 표시"></v-switch>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>이미지 뷰어 설정</v-list-item-title>
          <v-switch v-model="option.isShowTweet" label="트윗 표시"></v-switch>
          <v-switch v-model="option.isShowBottomPreview" label="하단 미리보기 표시"></v-switch>
          <v-switch v-model="option.isLoadOrgImg" label="이미지 원본 불러오기"></v-switch>
          <!--마지막거 스크롤 밖으로 나감-->
          <v-switch v-model="option.isBigPropic" label="작게 표시"></v-switch>
        </v-list-item-content>
      </v-list-item>
      <!-- <v-divider></v-divider> -->
    </v-list>
    <!-- <v-divider></v-divider> -->
  </div>
</template>

<style lang="scss" scoped>
.clickAble:hover {
  cursor: pointer;
}
</style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { DalsaePage, OptionModalBase } from '@/mixins';
import store from '@/store';
// interface BaseInterface extends DalsaePage {}

@Component
export default class OptionModal extends OptionModalBase {
  listUser = store.state.switter.switter.listUser;
  option = store.state.option.uiOption;
}
</script>
