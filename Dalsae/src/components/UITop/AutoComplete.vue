<template>
  <div class="auto-complete" v-if="isShow" :style="style" ref="refScrollPanel">
    <user-small
      ref="refUserSmall"
      v-for="(user, i) in users"
      :key="i"
      :user="user"
      :index="i"
      v-on:on-click-small-user="OnClickUser"
    />
  </div>
</template>

<style lang="scss" scoped>
.auto-complete {
  position: fixed;
  width: 300px;
  height: 200px;
  background-color: rgb(238, 238, 238);
  overflow-y: scroll;
  border-radius: 10px;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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
  @Ref()
  refUserSmall!: Vue[];
  @Ref()
  refScrollPanel!: HTMLElement;

  get isShow() {
    return moduleModal.stateAutoComplete.bAutoComplete;
  }

  get word() {
    return moduleModal.stateAutoComplete.autoCompleteWord;
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
    if (!moduleModal.stateAutoComplete.bAutoComplete) return;
    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        const { indexAutoComplete } = moduleModal.stateAutoComplete;
        let index = indexAutoComplete - 1;
        if (index < 0) index = 0;
        else if (index >= this.users.length) index = this.users.length - 1;
        moduleModal.SetAutoComplete({ ...moduleModal.stateAutoComplete, indexAutoComplete: index });
        this.MoveScroll();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        const { indexAutoComplete } = moduleModal.stateAutoComplete;
        let index = indexAutoComplete + 1;
        if (index < 0) index = 0;
        else if (index >= this.users.length) index = this.users.length - 1;
        moduleModal.SetAutoComplete({ ...moduleModal.stateAutoComplete, indexAutoComplete: index });
        this.MoveScroll();
      }
    }
  }

  MoveScroll() {
    const index = moduleModal.stateAutoComplete.indexAutoComplete;
    this.refUserSmall[index].$el.scrollIntoView();
  }

  async beforeDestroy() {
    document.removeEventListener('keydown', this.OnKeyDown);
  }
}
</script>
