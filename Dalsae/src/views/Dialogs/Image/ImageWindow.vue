<template>
  <div class="window-area">
    <span>이미지 윈도우 </span>
    <span>{{ tweet.full_text }}</span>
  </div>
</template>

<script lang="ts">
import * as I from '@/Interfaces';
import { Vue, Component, Inject } from 'vue-property-decorator';

@Component
export default class ImageWindow extends Vue {
  tweet = new I.Tweet();

  async created() {
    const id = this.$route.query.tweetId;
    if (id) {
      const json = window.preload.image.GetTweet(id.toString());
      this.tweet = JSON.parse(json);
    }
  }
}
</script>
