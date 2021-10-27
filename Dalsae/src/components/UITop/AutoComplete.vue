<template>
  <div class="auto-complete" v-if="isShow" :style="style">
    <user-small
      v-for="(user, i) in users"
      :key="i"
      :user="user"
      v-on:on-click-small-user="OnClickUser"
    />
  </div>
</template>

<style lang="scss" scoped>
.auto-complete {
  position: fixed;
  width: 300px;
  height: 200px;
  background-color: azure;
  overflow-y: scroll;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { DalsaeApp, UITopBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleUtil } from '@/store/modules/UtilStore';
import { moduleOption } from '@/store/modules/OptionStore';

@Component
export default class AutoComplete extends Vue {
  get isShow() {
    return moduleModal.bAutoComplete;
  }

  get word() {
    return moduleModal.autoCompleteWord;
  }

  get users() {
    return moduleModal.users;
  }

  get style() {
    let left = 15;
    let top = 0;
    const { isBigPropic, isShowPropic, isSmallInput } = moduleOption.uiOption;
    if (isSmallInput) {
      top += 30;
    } else {
      top += 60;
    }
    if (isShowPropic) {
      if (isBigPropic) {
        left += 70;
      } else {
        left += 45;
      }
    }
    return {
      left: `${left}px`,
      top: `${top}px`
    };
  }

  async created() {
    this.$nextTick(() => {
      document.addEventListener('keydown', this.OnKeyDown);
    });
  }

  OnClickUser(user: I.User) {
    moduleUtil.AutoCompleted(user);
  }

  OnKeyDown(e: KeyboardEvent) {
    if (!moduleModal.bAutoComplete) return;
    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        let index = moduleModal.indexAutoComplete - 1;
        if (index < 0) index = 0;
        else if (index >= this.users.length) index = this.users.length - 1;
        moduleModal.SetIndexAutoComplete(moduleModal.indexAutoComplete - 1);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        let index = moduleModal.indexAutoComplete - 1;
        if (index < 0) index = 0;
        else if (index >= this.users.length) index = this.users.length - 1;
        moduleModal.SetIndexAutoComplete(moduleModal.indexAutoComplete + 1);
      }
    }
  }

  async beforeDestroy() {
    document.removeEventListener('keydown', this.OnKeyDown);
  }
}
</script>
