/* eslint-disable @typescript-eslint/camelcase */
<template>
  <v-app>
    <message-modal ref="messageModal"> </message-modal>
    <pin-modal></pin-modal>
    <option-detail-modal ref="optionDetailModal"></option-detail-modal>
    <v-app-bar app max-height="90" height="90">
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
    <v-footer app fixed height="44" color="gray">
      <bottom></bottom>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { DalsaeApp } from '@/mixins';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleUI } from '@/store/modules/UIStore';
import { moduleUtil } from '@/store/modules/UtilStore';

@Component
export default class Home extends Mixins(DalsaeApp) {
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
    const hotKey = moduleOption.hotKey as any;
    if (document?.activeElement?.tagName == 'TEXTAREA') return;
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
    if (e.key === 'Enter') {
      if (moduleUI.stateContext.isShow) {
        moduleUtil.OnEnterByContext();
      }
    } else if (e.key === 'Escape') {
      if (moduleUI.stateContext.isShow) {
        const { x, y, maxIndex, listContext } = moduleUI.stateContext;
        moduleUI.OnContext({
          isShow: false,
          x: x,
          y: y,
          maxIndex: maxIndex,
          listContext: listContext
        });
      }
    }
  }
  ClickLink(e: Event) {
    // const listTweet: I.Tweet[] = TweetDataManager.listTweet as I.Tweet[];
    // console.log(listTweet[this.index]);
    // window.preload.image.OpenImageWindow(
    //   listTweet[this.index].id_str.toString(),
    //   listTweet[this.index]
    // );
    // this.index++;
  }

  async ClickModal() {
    // await this.ShowMessage('modal test');
  }
}
</script>
