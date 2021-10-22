<template>
  <div class="auto-complete" v-if="isShow">
    <div>
      {{ word }}
    </div>
    <div v-for="(user, i) in users" :key="i">{{ user.name }} / {{ user.screen_name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.auto-complete {
  position: fixed;
  left: 100px;
  top: 300px;
  width: 300px;
  height: 100px;
  background-color: azure;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { DalsaeApp, UITopBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleSwitter } from '@/store/modules/SwitterStore';

@Component
export default class AutoComplete extends Vue {
  get isShow() {
    return moduleModal.bAutoComplete;
  }

  get word() {
    return moduleModal.autoCompleteWord;
  }

  get users() {
    if (!moduleModal.bAutoComplete) return [];
    const word = moduleModal.autoCompleteWord.toUpperCase();
    if (!word) return [];
    console.log(word);
    if (!moduleSwitter.listFollowing || !moduleSwitter.listFollower) return [];
    const following = moduleSwitter.listFollowing.filter(
      x => x.screen_name.toUpperCase().indexOf(word) > -1 || x.name.toUpperCase().indexOf(word) > -1
    );
    const follower = moduleSwitter.listFollower.filter(
      x => x.screen_name.toUpperCase().indexOf(word) > -1 || x.name.toUpperCase().indexOf(word) > -1
    );
    console.log(following, follower);
    return following.concat(follower);
  }
  async created() {
    console.log('created');
  }
}
</script>
