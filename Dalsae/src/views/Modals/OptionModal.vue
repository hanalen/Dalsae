<template>
  <div>
    <v-list>
      <v-list-item>
        <div>
          <v-avatar
            class="click-able"
            v-for="(item, i) in listUser"
            :key="i"
            :size="40"
            @click="OnClickAccount(item)"
          >
            <img :src="item.user.profile_image_url" />
          </v-avatar>
          <v-icon
            class="click-able"
            style="font-size:40px; color:#1da1f2"
            @click="OnClickAddAccount"
            >mdi-account-plus</v-icon
          >
          <v-icon
            class="click-able"
            style="font-size:40px; color:#1da1f2"
            @click="OnClickOptionDetail"
            >mdi-cog</v-icon
          >
        </div>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>UI 설정</v-list-item-title>
          <v-switch v-model="option.isShowPropic" label="인장을 표시"></v-switch>
          <v-switch v-model="option.isBigPropic" label="인장을 크게 표시"></v-switch>
          <v-switch v-model="option.isShowPreview" label="이미지 미리보기를 표시"></v-switch>
          <v-switch
            v-if="option.isShowPreview"
            v-model="option.isSmallPreview"
            label="이미지 미리보기를 작게 표시"
          ></v-switch>
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
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>달새 정보</v-list-item-title>
          <v-list-item-subtitle>현재 버전: {{ version }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <!-- <v-divider></v-divider> -->
    </v-list>
    <!-- <v-divider></v-divider> -->
  </div>
</template>

<style lang="scss" scoped>
.click-able:hover {
  cursor: pointer;
}
.click-able {
  margin: 2px !important;
}
</style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { OptionModalBase } from '@/mixins';
import store from '@/store';
import * as I from '@/Interfaces';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export default class OptionModal extends OptionModalBase {
  option = moduleOption.uiOption;
}
</script>
