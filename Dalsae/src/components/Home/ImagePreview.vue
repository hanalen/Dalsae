<template>
  <div
    class="image-preview"
    :style="{ 'max-width': maxWidth }"
    @mouseover="MouseOver"
    @mouseout="MouseOut"
    @click="Click"
    v-if="media"
  >
    <!-- <transition name="bounce" v-for="(item, i) in media" :key="i">
      <img :src="imgPreview(media[i])" />
    </transition> -->

    <!-- <transition name="bounce" v-for="(item, i) in media" :key="i">
      <img :src="imgPreview(media[i])" :class="imgClass" />
    </transition> -->

    <!-- <div id="arrow">
      <img :src="imgPreview(media[0])" />
    </div> -->

    <!-- <img :src="imgPreview(media[0])" class="bounce-enter-active" /> -->

    <!-- <transition-group name="card" tag="div">
      <img v-for="item in media" :key="item.id_str" :src="imgPreview(item)" />
    </transition-group> -->
    <div class="tweet-images img">
      <img
        :id="'img' + i"
        class="tweet-image"
        v-for="(item, i) in media"
        :key="i"
        :src="imgPreview(item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet-images {
  cursor: pointer;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 5px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  :not(:last-child) {
    margin-right: -92px;
  }
}
.tweet-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
.img {
  :not(:last-child) {
    left: 0px;
    position: relative;
    left: 0;
    transition: left ease 0.5s;
  }
}
.img:hover {
  :not(:last-child) {
    left: -100px;
  }
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateX(0);
  }
  // 50% {
  // transform: translateX(-250px);
  // }
  100% {
    transform: translateX(-500px);
  }
}
</style>

<script lang="ts">
import { ImagePreviewBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class ImagePreview extends Mixins(ImagePreviewBase) {
  //이미지 기본 표시를 하고(기존 방식)
  //마우스 오버 시 legnth-1만큼 이미지가 -x축으로 이동
  //이동 시 이미지1 이미지2 이미지3 이미지4 이렇게 정렬 되게
  //해당 이동은 애니메이션 효과를 줌
  //해제 시 딜레이 주고 똑같이 기존 위치로 이동하게 구현
}
</script>
