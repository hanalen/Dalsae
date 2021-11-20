<template>
  <div class="tweet-input" @drop="OnDrop">
    <div class="tweet-input-top">
      <input
        ref="refFile"
        type="file"
        hidden="hidden"
        accept="image/gif, image/jpeg, image/png"
        @change="OnFileChange"
        multiple
      />
      <input
        ref="refFileVideo"
        type="file"
        hidden="hidden"
        accept="video/mp4"
        @change="OnFileChangeVideo"
      />
      <v-icon
        v-if="listImage.length < 4 && !isAddedMedia"
        color="info"
        @click="OnClickAddImage"
        class="click-able"
        >mdi-image-outline</v-icon
      >
      <v-icon
        v-if="listImage.length < 4 && !isAddedMedia"
        color="info"
        @click="OnClickAddImage"
        class="click-able"
        >mdi-video</v-icon
      >
      <textarea
        ref="textArea"
        outlined
        hide-details
        :auto-grow="false"
        background-color="white"
        no-resize
        :spellcheck="false"
        v-on:paste="Paste"
        @input="OnChange"
        @keyup.esc="OnEsc"
        @dragenter="OnDragEnter"
        @keyup="selectionChange"
        @click="selectionChange"
        @focus="selectionChange"
        @keydown.down="ArrowDown"
        @keydown.enter="EnterDown"
        @keydown.esc="ClearInput"
      >
      </textarea>
      <div class="tweet-count">
        <span>({{ GetTweetLength() }}/280)</span>
      </div>
    </div>
    <input-image> </input-image>
  </div>
</template>

<style lang="scss" scoped>
.tweet-input {
  // width: calc(100vw - 20px);
  // height: 90px;
  padding: 0px !important;
  display: flex;
  flex-direction: column;
}
.tweet-input-top {
  display: flex;
  width: 100%;
}
textarea {
  border-radius: 4px;
  border: 1px solid #c1c1c1;
}
textarea:focus {
  outline: none;
  border-radius: 4px;
  border: 1px solid #007cd6;
}
.click-able:hover {
  cursor: pointer;
}
.tweet-count {
  font-size: 12px;
  width: 50px;
  align-items: center;
  display: inline-flex;
  justify-content: center;
  margin-right: 8px;
  margin-top: -4px;
}
.ui-top-bottom {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 4px;
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
  height: 25px;
  font-size: 13px !important;
  background-color: white;
  padding: 2px 4px 2px 4px;
  resize: none;
  width: 100%;
}
</style>

<script lang="ts">
import { DalsaeApp, UITopBase, TweetInputBase } from '@/mixins';
import { eventBus } from '@/plugins';
import { moduleDom } from '@/store/modules/DomStore';
import { mixins } from 'vue-class-component';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetInput extends TweetInputBase {
  async created() {
    this.$nextTick(() => {
      moduleDom.RegisterTextArea(this.textArea);
      // eventBus.$on('FocusInput', () => {
      //   this.textArea.focus();
      // });
    });
  }
}
</script>
