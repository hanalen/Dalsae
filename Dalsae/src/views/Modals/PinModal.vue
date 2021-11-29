<template>
  <div class="message-modal">
    <v-dialog persistent class="modals" ref="modal" v-model="isShow" max-width="300">
      <v-card>
        <v-card-title class="headline">
          인증을 진행 해주세요
        </v-card-title>
        <v-card-text>
          인터넷 브라우저에서 로그인 후<br />
          앱 인증을 누르신 다음<br />
          나온 PIN을 입력 해주세요.
        </v-card-text>
        <v-text-field
          style="width: 250px; margin-left: 25px"
          v-model="state.pin"
          width
          label="7자리 숫자를 입력 해주세요"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="ClickOk">
            확인
          </v-btn>
          <v-btn color="primary" @click="ClickClose">
            닫기
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { PinModalBase } from '@/mixins';
import { moduleModal } from '@/store/modules/ModalStore';

@Component
export default class PinModal extends PinModalBase {}
</script>
