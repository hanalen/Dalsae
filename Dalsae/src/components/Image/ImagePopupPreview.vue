<template>
  <div @click="OnClickMedia" class="img-preview">
    <img :src="media.media_url_https" class="bottom-preview" />
    <div class="progress" v-if="isDownloadStart">
      <v-icon size="15px" color="white" v-if="isDownloadEnd">mdi-check-all</v-icon>
      <v-icon size="15px" color="white" v-if="isError">mdi-alert-circle-outline </v-icon>
      <v-progress-linear
        color="light-blue"
        height="10"
        :value="progress.percent"
      ></v-progress-linear>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-preview {
  margin: 0px 4px;
  width: auto;
  height: 130px;
  cursor: pointer;
}
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
.progress {
  display: flex;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins/Image';
import * as M from '@/store/Interface';
import { moduleImage } from '@/store/modules/ImageStore';
@Component
export default class ImagePopupPreview extends Vue {
  @Prop()
  media!: I.Media;

  @Prop()
  progress!: M.Progress;

  get isDownloadStart() {
    return this.progress.bStartDownload;
  }

  get isDownloadEnd() {
    return this.progress.percent === 100;
  }

  get isError() {
    return this.progress.bError;
  }

  OnClickMedia() {
    this.$emit('on-click-media', this.media);
  }
}
</script>
