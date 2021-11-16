<template>
  <div
    class="image-preview"
    :style="{ width: maxWidth }"
    @mouseover="MouseOver"
    @mouseout="MouseOut"
    @click="Click"
    v-if="media"
  >
    <v-icon class="icon-video" color="primary" size="50" v-if="isVideo"
      >mdi-play-circle-outline
    </v-icon>
    <div class="tweet-images-group" :style="styleGroup" v-show="isHover">
      <img
        :style="styleSize"
        class="tweet-image"
        v-for="(item, i) in media"
        :key="i"
        :src="imgPreview(item)"
      />
    </div>
    <div class="tweet-images img" :style="{ height: size + 'px' }">
      <img
        :style="styleSize"
        :id="'img' + i"
        class="tweet-image"
        :class="'tweet-image' + i"
        v-for="(item, i) in media"
        :key="i"
        :src="imgPreview(item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-preview {
  position: relative;
}
.icon-video {
  position: absolute !important;
  left: 25%;
  top: 25%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  z-index: 5;
}
.image-preview:hover {
  cursor: pointer;
}
.tweet-images-group {
  position: absolute;
  display: flex;
  background: white;
  padding: 4px;
  margin-top: -4px;
  border-radius: 12px;

  backdrop-filter: blur(5px);
  :not(:last-child) {
    margin-right: 4px;
  }
}
.tweet-images {
  // display: inline-flex;
  height: 100px;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
}
.tweet-image {
  object-fit: cover;
  border-radius: 12px;
  box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.12);
}
.tweet-image0 {
  position: absolute;
  right: 0px;
}
.tweet-image1 {
  position: absolute;
  right: 8px;
}
.tweet-image2 {
  position: absolute;
  right: 16px;
}
.tweet-image3 {
  position: absolute;
  right: 24px;
}
</style>

<script lang="ts">
import { ImagePreviewBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class ImagePreview extends Mixins(ImagePreviewBase) {}
</script>
