<template>
  <div>
    <div class="image-content" @mousewheel="MouseWheel">
      <div class="arrow" v-if="media.length > 1 && !isZoom">
        <div class="left-button" @click="OnClickPrev">
          <v-icon x-large>mdi-chevron-left</v-icon>
        </div>
        <div class="right-button" @click="OnClickNext">
          <v-icon x-large>mdi-chevron-right</v-icon>
        </div>
      </div>
      <div ref="imgDiv" v-show="i == index" v-for="(image, i) in media" :key="i" class="img-div">
        <img
          ref="img"
          :src="GetSrc(image)"
          class="img-content"
          :class="{ zoom: isZoom }"
          :style="imgStyle"
          @mousedown="MouseDown"
          @mouseleave="MouseLeave"
          @mouseup="MouseUp"
          @mousemove="MouseMove"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
  overflow: hidden;
  margin: auto;
  justify-content: center;
  display: flex;
}
.img-div {
  display: flex;
  max-height: 100%;
  justify-content: center;
  align-items: center;
}
.img-content {
  display: block;
  object-fit: scale-down;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  height: auto;
}
img {
  cursor: pointer;
}
.left-button,
.right-button {
  cursor: pointer;
}
.left-button {
  position: absolute;
  left: 20px;
  top: 50%;
  color: white;
  z-index: 10;
}
.right-button {
  position: absolute;
  right: 20px;
  top: 50%;
  color: white;
  z-index: 10;
}
.right-button:hover,
.left-button:hover {
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 20px;
}
.zoom {
  object-fit: cover !important;
  max-width: none;
  max-height: none;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';

@Component
export default class ImageContent extends Mixins(MIX.ImageContentBase) {
  async created() {
    this.$nextTick(() => {
      window.addEventListener('keydown', this.OnKeyDown);
    });
  }
}
</script>
