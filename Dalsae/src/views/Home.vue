<template>
  <v-app>
    <audio style="diplay: none;" ref="refAudio" :src="pathSound" />
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
    <message-modal ref="messageModal"> </message-modal>
    <pin-modal></pin-modal>
    <option-detail-modal ref="optionDetailModal"></option-detail-modal>
    <v-app-bar app :height="topHeight">
      <top-selector> </top-selector>
    </v-app-bar>
    <v-main>
      <v-navigation-drawer
        @input="OnOptionChange"
        v-model="isShowOptionModal"
        absolute
        temporary
        app
      >
        <option-modal></option-modal>
      </v-navigation-drawer>
      <v-container fluid>
        <tweet-panel></tweet-panel>
      </v-container>
    </v-main>
    <v-footer app fixed height="66" color="gray">
      <bottom></bottom>
      <system-bar />
    </v-footer>
  </v-app>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { DalsaeApp, IPCPipeLine } from '@/mixins';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { moduleDom } from '@/store/modules/DomStore';

@Component
export default class Home extends Mixins(DalsaeApp, IPCPipeLine) {
  get listMsg() {
    return moduleModal.stateMessage.listMessage;
  }
  get topHeight() {
    let ret = 0;
    const height = moduleDom.stateDom.textAreaheight;
    if (height) {
      ret += height;
    } else {
      ret += moduleOption.uiOption.isSmallInput ? 25 : 42;
    }
    ret += moduleOption.uiOption.isSmallInput ? 11 : 46;
    ret += moduleUI.stateInput.listImage.length > 0 ? 280 : 0;
    ret += moduleUI.stateInput.video ? 280 : 0;
    return ret;
  }
  get isShowOptionModal() {
    return moduleModal.bOption;
  }
  set isShowOptionModal(bShow: boolean) {
    moduleModal.ShowOptionModal(bShow);
  }
  get isShowPinModal() {
    return moduleModal.bPin;
  }
  set isShowPinModal(bShow: boolean) {
    moduleModal.ShowPinModal(bShow);
  }
  async created() {
    this.$nextTick(() => {
      document.addEventListener('keydown', this.KeyDown);
    });
  }
  KeyDown(e: KeyboardEvent) {
    if (
      !moduleUtil.isFocusPanel ||
      document?.activeElement?.tagName === 'TEXTAREA' ||
      document?.activeElement?.tagName === 'INPUT'
    )
      return;
    const hotKey = moduleOption.hotKey as any;
    Object.keys(hotKey).forEach(key => {
      const currentHotKey = hotKey[key] as I.Key;
      if (
        currentHotKey.isCtrl == e.ctrlKey &&
        currentHotKey.isAlt == e.altKey &&
        currentHotKey.isShift == e.shiftKey &&
        currentHotKey.key.toUpperCase() == e.key.toUpperCase()
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.OnKeyDownHotKey(currentHotKey.hotkeyType);
      }
    });
    if (e.key === 'Enter' && !e.altKey && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      if (moduleUI.stateContext.isShow) {
        moduleUtil.OnEnterByContext();
      } else {
        moduleDom.stateDom.textArea.focus();
      }
    } else if (e.key === 'Escape') {
      if (moduleUI.stateContext.isShow) {
        const { x, y, maxIndex, listContext } = moduleUI.stateContext;
        moduleUI.SetStateContext({
          ...moduleUI.stateContext,
          isShow: false,
          x: x,
          y: y,
          maxIndex: maxIndex,
          listContext: listContext
        });
      }
    }
  }
}
</script>
