/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div class="tweet-input">
    <v-textarea
      v-model="state.tweet"
      outlined
      hide-details
      :auto-grow="false"
      background-color="white"
      no-resize
      height="44"
    >
    </v-textarea>
    <div class="ui-top-right-bottom">
      <v-icon color="primary">mdi-plus-circle-outline</v-icon>
      <v-icon color="primary">mdi-plus-circle-outline</v-icon>
      <v-icon color="primary">mdi-plus-circle-outline</v-icon>
      <v-icon color="primary">mdi-plus-circle-outline</v-icon>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet-input {
  // width: calc(100vw - 20px);
  height: 90px;
  padding: 4px !important;
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage, UITopBase } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetInput extends mixins(UITopBase) {
  async created() {
    console.log('aaaaa');
  }
}
</script>
