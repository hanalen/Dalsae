<template>
  <div class="video" v-if="Video.type != 'photo'">
    <video
      ref="video"
      controls
      autoplay
      muted
      loop
      v-if="Video.video_info.variants[0].content_type == 'application/x-mpegURL'"
    ></video>
    <video
      ref="video2"
      controls
      autoplay
      muted
      loop
      v-if="Video.video_info.variants[0].content_type != 'application/x-mpegURL'"
    >
      <source
        :src="Video.video_info.variants[0].url"
        :type="Video.video_info.variants[0].content_type"
      />
    </video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';

@Component
export default class VideoContent extends Mixins(MIX.VideoContentBase) {}
</script>
