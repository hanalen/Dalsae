/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div class="tweet-input" @drop="OnDrop">
    <v-textarea
      outlined
      hide-details
      :auto-grow="false"
      background-color="white"
      no-resize
      :spellcheck="false"
      height="44"
      v-on:paste="Paste"
      v-model="inputText"
      @keyup.esc="OnEsc"
      @dragenter="OnDragEnter"
      @keyup="selectionChange"
      @click="selectionChange"
      @focus="selectionChange"
      @keydown.down="ArrowDown"
      @keydown.up="ArrowUp"
      @keydown.enter="EnterDown"
      @keydown.esc="ClearInput"
    >
    </v-textarea>
    <div class="ui-top-bottom">
      <div>
        <v-icon color="primary">mdi-plus-circle-outline</v-icon>
        <v-icon color="primary">mdi-plus-circle-outline</v-icon>
        <v-icon color="primary">mdi-plus-circle-outline</v-icon>
        <v-icon color="primary">mdi-plus-circle-outline</v-icon>
        <img class="img-add" v-for="(item, i) in listImage" :src="item" :key="i" />
      </div>
      <div class="ui-top-bottom-right">
        <div>{{ GetTweetLength() }}/280</div>
        <v-btn outlined color="primary" text @click="OnClickTweet">
          트윗 하기
        </v-btn>
      </div>
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
.ui-top-bottom {
  display: flex;
  justify-content: space-between;
}
.ui-top-bottom-right {
  display: flex;
}
.img-add {
  max-width: 100px;
  max-height: 100px;
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
import { DalsaeApp, UITopBase, TweetInputBase } from '@/mixins';
import { mixins } from 'vue-class-component';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetInput extends TweetInputBase {}
</script>
