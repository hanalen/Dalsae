<template>
  <div class="img-item">
    <img :src="img" />
    <v-icon class="click-able" style="font-size:30px;" @click="OnClickRemove"
      >mdi-close-circle</v-icon
    >
  </div>
</template>

<style lang="scss" scoped>
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  padding: 4px;
  border-radius: 10px;
}
.img-item {
  position: relative;
}
.click-able:hover {
  cursor: pointer;
}
.click-able {
  position: absolute !important;
  top: 5px;
  right: 10px;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { moduleUI } from '@/store/modules/UIStore';
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';

@Component
export default class TopSmall extends Vue {
  @Prop()
  img!: string;
  @Prop()
  index!: number;

  OnClickRemove() {
    const listImage = moduleUI.stateInput.listImage.concat();
    listImage.splice(this.index, 1);
    moduleUI.SetStateInput({ ...moduleUI.stateInput, listImage: listImage });
  }
}
</script>
