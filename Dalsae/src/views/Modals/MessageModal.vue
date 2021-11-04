<template>
  <div class="message-modal">
    <v-dialog class="modals" ref="modal" v-model="isShow" max-width="300">
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="isShow = false">
            확인
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import { moduleModal } from '@/store/modules/ModalStore';

@Component
export default class MessageModal extends Vue {
  get isShow() {
    return moduleModal.stateAlert.isShow;
  }
  set isShow(isShow: boolean) {
    moduleModal.SetStateAlert({ isShow: isShow, title: '', message: '' });
  }
  get title() {
    return moduleModal.stateAlert.title;
  }
  get message() {
    return moduleModal.stateAlert.message;
  }
}
</script>
