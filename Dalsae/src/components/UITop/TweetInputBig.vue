<template>
  <div class="tweet-input" @drop="OnDrop">
    <input
      ref="refFile"
      type="file"
      hidden="hidden"
      accept="image/gif, image/jpeg, image/png"
      @change="OnFileChange"
      multiple
    />
    <textarea
      ref="textArea"
      outlined
      hide-details
      :auto-grow="false"
      background-color="white"
      no-resize
      :spellcheck="false"
      height="44"
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
    <div class="ui-top-bottom">
      <div>
        <v-icon
          v-if="listImage.length < 4 && !isAddedMedia"
          color="info"
          @click="OnClickAddImage"
          class="click-able"
          >mdi-image-outline</v-icon
        >
      </div>
      <div class="ui-top-bottom-right">
        <div class="tweet-count">
          <span>({{ GetTweetLength() }} / 280)</span>
        </div>
        <v-btn height="30px" width="80px" outlined color="primary" @click="OnClickTweet">
          트윗하기
        </v-btn>
      </div>
    </div>
    <input-image> </input-image>
  </div>
</template>

<style lang="scss" scoped>
.tweet-input {
  // width: calc(100vw - 20px);
  // height: 90px;
  padding: 4px !important;
  display: flex;
  flex-direction: column;
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
  font-size: 14px;
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
  height: 44px;
  font-size: 13px !important;
  background-color: white;
  padding: 2px 4px 2px 4px;
  resize: none;
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
