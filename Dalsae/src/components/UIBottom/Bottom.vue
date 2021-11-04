<template>
  <div class="ui-bottom">
    <v-btn icon rounded @click="ClickOption">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-btn icon rounded v-for="(item, i) in listIcon" :key="i" @click="ClickMenu(item.value)">
      <v-icon :color="item.value === selectMenu ? 'primary' : 'secondary'">{{ item.name }}</v-icon>

      <!-- <v-progress-circular
        v-if="isShowLoad(item.value)"
        :width="3"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <v-icon v-else :color="item.value === selectMenu ? 'primary' : 'secondary'">{{
        item.name
      }}</v-icon> -->
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.ui-bottom {
  display: flex;
  padding: 5px 4px 5px 4px;
  align-content: center;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleUI } from '@/store/modules/UIStore';
@Component
export default class Bottom extends Vue {
  get selectMenu() {
    return moduleUI.stateUI.selectMenu;
  }
  get listIcon() {
    return moduleUI.statePanel.listIcon;
  }

  async ClickOption() {
    moduleModal.ShowOptionModal(true);
  }

  async ClickMenu(menu: number) {
    moduleUI.SetStateUI({ ...moduleUI.stateUI, selectMenu: menu });
  }

  isShowLoad(menu: number) {
    if (menu === 0) {
      return this.isLoadHome;
    } else if (menu === 1) {
      return this.isLoadMention;
    } else if (menu === 3) {
      return this.isLoadFavorite;
    }
  }

  get isLoadHome() {
    return moduleUI.statePanel.home.isLoad;
  }

  get isLoadMention() {
    return moduleUI.statePanel.mention.isLoad;
  }

  get isLoadFavorite() {
    return moduleUI.statePanel.favorite.isLoad;
  }
}
</script>
