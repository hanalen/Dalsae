<template>
  <div class="input-image" v-if="listImage.length > 0">
    <div class="image-list list-one" v-if="length === 1">
      <img class="img-item" :src="listImage[0]" />
    </div>
    <div class="image-list list-two" v-else-if="length === 2">
      <img class="img-item" :src="listImage[0]" />
      <img class="img-item" :src="listImage[1]" />
    </div>
    <div class="image-list list-three" v-else-if="length === 3">
      <div class="left">
        <img class="img-item" :src="listImage[0]" />
        <img class="img-item" :src="listImage[2]" />
      </div>
      <div class="right">
        <img class="img-item" :src="listImage[1]" />
      </div>
    </div>
    <div class="image-list list-four" v-else-if="length === 4">
      <div class="left">
        <img class="img-item" :src="listImage[0]" />
        <img class="img-item" :src="listImage[2]" />
      </div>
      <div class="right">
        <img class="img-item" :src="listImage[1]" />
        <img class="img-item" :src="listImage[3]" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  object-fit: cover;
  padding: 4px;
}
.input-image {
  width: 500px;
  height: 300px;
  overflow: hidden;
}
.image-list {
  display: flex;
  flex-direction: row;
  max-width: 500px;
  max-height: 280px;
}
.left,
.right {
  display: flex;
  flex-direction: column;
}
.list-one {
  .img-item {
    width: 100%;
    height: 280px;
  }
}
.list-two {
  flex-direction: row;
  .img-item {
    width: 50%;
    height: 280px;
  }
}
.list-three {
  .left .img-item {
    // width: 50%;
    height: 140px;
  }
  .right .img-item {
    // width: 50%;
    // width: 140px;
    height: 280px;
  }
}
.list-four {
  flex-wrap: wrap;
  .img-item {
    // width: 25%;
    height: 140px;
  }
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { moduleUI } from '@/store/modules/UIStore';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TopSmall extends Vue {
  get className() {
    const len = this.listImage.length;
    if (len === 1) {
      return 'list-one';
    } else if (len === 2) {
      return 'list-two';
    } else if (len === 3) {
      return 'list-three';
    } else if (len === 4) {
      return 'list-four';
    }
  }
  get listImage() {
    return moduleUI.stateInput.listImage;
  }
  get length() {
    return this.listImage.length;
  }
}
</script>
