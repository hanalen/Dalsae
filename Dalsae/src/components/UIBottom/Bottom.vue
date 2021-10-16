<template>
  <div class="ui-bottom">
    <v-btn icon rounded @click="ClickOption">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-btn icon rounded v-for="(item, i) in listIcons" :key="i" @click="ClickMenu(item.value)">
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
  place-items: 2px;
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
    return moduleUI.selectMenu;
  }
  listIcons = [
    {
      name: 'mdi-home',
      value: 0
    },
    {
      name: 'mdi-bell-outline',
      value: 1
    },
    {
      name: 'mdi-email-outline',
      value: 2
    },
    {
      name: 'mdi-heart-outline',
      value: 3
    },
    {
      name: 'mdi-link',
      value: 4
    }
  ];

  async ClickOption() {
    console.log('click option');
    moduleModal.ShowOptionModal(true);
  }

  async ClickMenu(menu: number) {
    moduleUI.ChangeMenu(menu);
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
    return moduleUI.panelHome.isLoad;
  }

  get isLoadMention() {
    return moduleUI.panelMention.isLoad;
  }

  get isLoadFavorite() {
    return moduleUI.panelFavorite.isLoad;
  }
}
</script>
