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
        <v-card-actions v-if="!isYesNo">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="isShow = false">
            확인
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn color="primary" ref="refYes" @click="OnClickBtn(true)">
            예(Y)
          </v-btn>
          <v-btn color="secondary" ref="refNo" @click="OnClickBtn(false)">
            아니오(N)
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import { moduleModal } from '@/store/modules/ModalStore';
import {} from 'vuetify/es5/components/';
@Component
export default class MessageModal extends Vue {
  get isShow() {
    return moduleModal.stateAlert.isShow;
  }
  set isShow(isShow: boolean) {
    if (!isShow && this.isShow) {
      this.OnClickBtn(false);
    }
    moduleModal.SetStateAlert({ isShow: isShow, title: '', isYesNo: false, message: '' });
  }
  get title() {
    return moduleModal.stateAlert.title;
  }
  get message() {
    return moduleModal.stateAlert.message;
  }
  get isYesNo() {
    return moduleModal.stateAlert.isYesNo;
  }

  @Ref()
  refYes!: Vue;
  @Ref()
  refNo!: Vue;

  @Watch('isShow')
  OnWatchShow(newVal: boolean) {
    if (newVal) {
      document.addEventListener('keydown', this.OnKeyDown);
    } else {
      document.removeEventListener('keydown', this.OnKeyDown);
    }
  }
  OnKeyDown(e: KeyboardEvent) {
    if (e.code === 'ArrowLeft') {
      const el = this.refYes.$el as HTMLElement;
      el.focus();
    } else if (e.code === 'ArrowRight') {
      const el = this.refNo.$el as HTMLElement;
      el.focus();
    } else if (e.code === 'KeyY' && this.isYesNo) {
      this.OnClickBtn(true);
    } else if (e.code === 'KeyN' && this.isYesNo) {
      this.OnClickBtn(false);
    }
  }

  OnClickBtn(value: boolean) {
    if (moduleModal.stateAlert.callback) {
      moduleModal.stateAlert.callback(value);
    }
    moduleModal.SetStateAlert({ ...moduleModal.stateAlert, isShow: false });
  }
}
</script>
