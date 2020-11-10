/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div class="tweet-input">
    <!-- <textarea
      v-model="state.tweet"
      spellcheck="false"
      class="text"
      v-on:input="Input"
      v-on:select="selectionChange"
      v-on:paste="Paste"
      @keyup="selectionChange"
      @click="selectionChange"
      @focus="selectionChange"
      @keydown.down="ArrowDown"
      @keydown.up="ArrowUp"
      @keydown.enter="EnterDown"
      @keydown.esc="ClearInput"
    >
    </textarea> -->
    <v-textarea
      outlined
      hide-details
      :auto-grow="false"
      background-color="white"
      no-resize
      :spellcheck="false"
      height="44"
      v-on:paste="Paste"
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
textarea {
  font-family: 'Malgun Gothic' !important;
  height: 44px;
  font-size: 13px !important;
  background-color: white;
  padding: 2px 4px 2px 4px;
  resize: none;
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage, UITopBase, TweetInputBase } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetInput extends mixins(TweetInputBase) {
  async created() {
    console.log('aaaaa');
  }
}
</script>
